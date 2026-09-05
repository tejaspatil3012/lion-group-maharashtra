using System.Net.Http.Headers;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<FileStorageService> _logger;

    public FileStorageService(
        IWebHostEnvironment environment,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<FileStorageService> logger)
    {
        _environment = environment;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("No file provided");
        }

        var supabaseUrl = _configuration["Supabase:Url"];
        var supabaseKey = _configuration["Supabase:ServiceRoleKey"];
        var bucketName = _configuration["Supabase:StorageBucket"] ?? "uploads";

        // Use Supabase Storage if configured
        if (!string.IsNullOrWhiteSpace(supabaseUrl) && !string.IsNullOrWhiteSpace(supabaseKey))
        {
            return await UploadToSupabaseAsync(file, subFolder, supabaseUrl, supabaseKey, bucketName);
        }

        // Forward to production API if local environment lacks direct Supabase service role key
        try
        {
            var proxyClient = _httpClientFactory.CreateClient();
            proxyClient.Timeout = TimeSpan.FromSeconds(30);

            using var content = new MultipartFormDataContent();
            using var fileStream = file.OpenReadStream();
            using var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");
            content.Add(streamContent, "file", file.FileName);

            var proxyResponse = await proxyClient.PostAsync("https://lion-group-maharashtra.onrender.com/api/uploads", content);
            if (proxyResponse.IsSuccessStatusCode)
            {
                var responseJson = await proxyResponse.Content.ReadAsStringAsync();
                using var doc = System.Text.Json.JsonDocument.Parse(responseJson);
                if (doc.RootElement.TryGetProperty("url", out var urlProp))
                {
                    var url = urlProp.GetString();
                    if (!string.IsNullOrWhiteSpace(url)) return url;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to proxy upload to production Supabase handler, falling back to local disk.");
        }

        return await SaveToLocalDiskAsync(file, subFolder);
    }

    public void DeleteFile(string relativeFilePath)
    {
        if (string.IsNullOrWhiteSpace(relativeFilePath)) return;

        var supabaseUrl = _configuration["Supabase:Url"];
        var supabaseKey = _configuration["Supabase:ServiceRoleKey"];
        var bucketName = _configuration["Supabase:StorageBucket"] ?? "uploads";

        if (!string.IsNullOrWhiteSpace(supabaseUrl) && !string.IsNullOrWhiteSpace(supabaseKey))
        {
            _ = DeleteFromSupabaseAsync(relativeFilePath, supabaseUrl, supabaseKey, bucketName);
            return;
        }

        DeleteFromLocalDisk(relativeFilePath);
    }

    // ── Supabase Storage ──

    private async Task<string> UploadToSupabaseAsync(
        IFormFile file, string subFolder, string supabaseUrl, string supabaseKey, string bucketName)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
        var storagePath = string.IsNullOrWhiteSpace(subFolder)
            ? uniqueFileName
            : $"{subFolder}/{uniqueFileName}";

        // POST https://<project>.supabase.co/storage/v1/object/<bucket>/<path>
        var uploadUrl = $"{supabaseUrl}/storage/v1/object/{bucketName}/{storagePath}";

        var client = _httpClientFactory.CreateClient();
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        var fileBytes = memoryStream.ToArray();

        var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
        request.Headers.Add("Authorization", $"Bearer {supabaseKey}");
        request.Headers.Add("apikey", supabaseKey);

        // Send as raw binary with correct content type (not multipart)
        var contentType = file.ContentType ?? "application/octet-stream";
        request.Content = new ByteArrayContent(fileBytes);
        request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        // Enable upsert in case file already exists
        request.Headers.Add("x-upsert", "true");

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("Supabase Storage upload failed ({StatusCode}): {Error}", response.StatusCode, errorBody);
            throw new Exception($"Failed to upload to Supabase Storage: {response.StatusCode}");
        }

        // Return the public URL
        var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{bucketName}/{storagePath}";
        _logger.LogInformation("File uploaded to Supabase Storage: {Url}", publicUrl);
        return publicUrl;
    }

    private async Task DeleteFromSupabaseAsync(
        string fileUrl, string supabaseUrl, string supabaseKey, string bucketName)
    {
        try
        {
            // Extract the storage path from the full URL or relative path
            string storagePath;
            var publicPrefix = $"{supabaseUrl}/storage/v1/object/public/{bucketName}/";
            if (fileUrl.StartsWith(publicPrefix, StringComparison.OrdinalIgnoreCase))
            {
                storagePath = fileUrl[publicPrefix.Length..];
            }
            else
            {
                storagePath = fileUrl.TrimStart('/');
                if (storagePath.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
                    storagePath = storagePath["uploads/".Length..];
            }

            var deleteUrl = $"{supabaseUrl}/storage/v1/object/{bucketName}/{storagePath}";

            var client = _httpClientFactory.CreateClient();
            var request = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
            request.Headers.Add("Authorization", $"Bearer {supabaseKey}");
            request.Headers.Add("apikey", supabaseKey);

            await client.SendAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete file from Supabase Storage: {Path}", fileUrl);
        }
    }

    // ── Local Disk (development fallback) ──

    private async Task<string> SaveToLocalDiskAsync(IFormFile file, string subFolder)
    {
        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", subFolder);

        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        var fileExtension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var physicalPath = Path.Combine(uploadsDir, uniqueFileName);

        using (var stream = new FileStream(physicalPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{subFolder}/{uniqueFileName}";
    }

    private void DeleteFromLocalDisk(string relativeFilePath)
    {
        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var physicalPath = Path.Combine(webRoot, relativeFilePath.TrimStart('/'));

        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }
    }
}
