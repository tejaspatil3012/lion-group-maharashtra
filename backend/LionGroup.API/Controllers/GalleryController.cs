using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Gallery;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IGalleryService _galleryService;

    public GalleryController(IGalleryService galleryService)
    {
        _galleryService = galleryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAlbums()
    {
        var albums = await _galleryService.GetAlbumsAsync();
        return Ok(albums);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAlbumById(int id)
    {
        var album = await _galleryService.GetAlbumByIdAsync(id);
        if (album == null)
        {
            return NotFound(new { message = $"Album with ID {id} not found" });
        }
        return Ok(album);
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentImages(int count = 6)
    {
        var images = await _galleryService.GetRecentImagesAsync(count);
        return Ok(images);
    }

    // Admin CRUD Endpoints
    [HttpPost]
    public async Task<IActionResult> CreateAlbum([FromBody] CreateAlbumDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _galleryService.CreateAlbumAsync(dto);
        return CreatedAtAction(nameof(GetAlbumById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAlbum(int id, [FromBody] UpdateAlbumDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _galleryService.UpdateAlbumAsync(id, dto);
        if (updated == null) return NotFound(new { message = $"Album with ID {id} not found" });
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAlbum(int id)
    {
        var deleted = await _galleryService.DeleteAlbumAsync(id);
        if (!deleted) return NotFound(new { message = $"Album with ID {id} not found" });
        return Ok(new { message = "Album deleted successfully" });
    }

    [HttpPost("{id:int}/images")]
    public async Task<IActionResult> AddImageToAlbum(int id, [FromBody] AddGalleryImageDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var image = await _galleryService.AddImageToAlbumAsync(id, dto);
        if (image == null) return NotFound(new { message = $"Album with ID {id} not found" });
        return Ok(image);
    }

    [HttpDelete("images/{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int imageId)
    {
        var deleted = await _galleryService.DeleteImageAsync(imageId);
        if (!deleted) return NotFound(new { message = $"Image with ID {imageId} not found" });
        return Ok(new { message = "Image deleted successfully" });
    }
}
