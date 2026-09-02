using Microsoft.AspNetCore.Mvc;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadsController(IWebHostEnvironment environment)
    {
        _environment = environment;
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

        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Auto-sync to frontend public/uploads for local development
        try
        {
            var frontendUploads = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "frontend", "lion-group-web", "public", "uploads"));
            if (Directory.Exists(frontendUploads))
            {
                var frontendFilePath = Path.Combine(frontendUploads, uniqueFileName);
                System.IO.File.Copy(filePath, frontendFilePath, true);
            }
        }
        catch
        {
            // Ignore if in production/standalone container
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
