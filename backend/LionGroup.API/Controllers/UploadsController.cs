using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<UploadsController> _logger;

    public UploadsController(
        IWebHostEnvironment environment,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<UploadsController> logger)
    {
        _environment = environment;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file was uploaded." });
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP, GIF." });
        }

        // Limit size to 10 MB
        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds maximum allowed limit of 10 MB." });
        }

        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";

        var supabaseUrl = _configuration["Supabase:Url"];
        var supabaseKey = _configuration["Supabase:ServiceRoleKey"];
        var bucketName = _configuration["Supabase:StorageBucket"] ?? "uploads";

        // Use Supabase Storage if configured
        if (!string.IsNullOrWhiteSpace(supabaseUrl) && !string.IsNullOrWhiteSpace(supabaseKey))
        {
            var uploadUrl = $"{supabaseUrl}/storage/v1/object/{bucketName}/{uniqueFileName}";

            var client = _httpClientFactory.CreateClient();
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
            request.Headers.Add("Authorization", $"Bearer {supabaseKey}");
            request.Headers.Add("apikey", supabaseKey);
            request.Headers.Add("x-upsert", "true");

            var contentType = file.ContentType ?? "application/octet-stream";
            request.Content = new ByteArrayContent(fileBytes);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Supabase Storage upload failed ({StatusCode}): {Error}", response.StatusCode, errorBody);
                return StatusCode(500, new { message = "Failed to upload image to cloud storage." });
            }

            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{bucketName}/{uniqueFileName}";

            return Ok(new
            {
                url = publicUrl,
                relativeUrl = publicUrl,
                fileName = uniqueFileName,
                originalName = file.FileName,
                size = file.Length
            });
        }

        // Fallback: save to local disk (development)
        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var host = Request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? Request.Host.Value;
        var scheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? Request.Scheme;
        var baseUrl = $"{scheme}://{host}";
        var fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";

        return Ok(new
        {
            url = fileUrl,
            relativeUrl = $"/uploads/{uniqueFileName}",
            fileName = uniqueFileName,
            originalName = file.FileName,
            size = file.Length
        });
    }
}
