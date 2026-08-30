using Microsoft.AspNetCore.Mvc;
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
}
