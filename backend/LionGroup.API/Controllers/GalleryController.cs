using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Common;
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
    [ProducesResponseType(typeof(ApiResponse<List<GalleryAlbumDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAlbums()
    {
        var albums = await _galleryService.GetAlbumsAsync();
        return Ok(ApiResponse<List<GalleryAlbumDto>>.Ok(albums, "Gallery albums retrieved successfully"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<GalleryAlbumDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<GalleryAlbumDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAlbumById(int id)
    {
        var album = await _galleryService.GetAlbumByIdAsync(id);
        if (album == null)
        {
            return NotFound(ApiResponse<GalleryAlbumDto>.Fail($"Album with ID {id} not found"));
        }
        return Ok(ApiResponse<GalleryAlbumDto>.Ok(album, "Album details retrieved successfully"));
    }

    [HttpGet("recent")]
    [ProducesResponseType(typeof(ApiResponse<List<GalleryImageDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecentImages([FromQuery] int count = 6)
    {
        var images = await _galleryService.GetRecentImagesAsync(count);
        return Ok(ApiResponse<List<GalleryImageDto>>.Ok(images, "Recent gallery photos retrieved successfully"));
    }
}
