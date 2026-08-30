using LionGroup.API.DTOs.Gallery;

namespace LionGroup.API.Interfaces;

public interface IGalleryService
{
    Task<List<GalleryAlbumDto>> GetAlbumsAsync();
    Task<GalleryAlbumDto?> GetAlbumByIdAsync(int id);
    Task<List<GalleryImageDto>> GetRecentImagesAsync(int count = 6);
}
