using LionGroup.API.DTOs.Gallery;

namespace LionGroup.API.Interfaces;

public interface IGalleryService
{
    Task<List<GalleryAlbumDto>> GetAlbumsAsync();
    Task<GalleryAlbumDto?> GetAlbumByIdAsync(int id);
    Task<List<GalleryImageDto>> GetRecentImagesAsync(int count = 6);

    // Admin CRUD
    Task<GalleryAlbumDto> CreateAlbumAsync(CreateAlbumDto dto);
    Task<GalleryAlbumDto?> UpdateAlbumAsync(int id, UpdateAlbumDto dto);
    Task<bool> DeleteAlbumAsync(int id);
    Task<GalleryImageDto?> AddImageToAlbumAsync(int albumId, AddGalleryImageDto dto);
    Task<bool> DeleteImageAsync(int imageId);
}
