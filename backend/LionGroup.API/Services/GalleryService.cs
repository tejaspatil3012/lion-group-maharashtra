using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Gallery;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class GalleryService : IGalleryService
{
    private readonly ApplicationDbContext _context;

    public GalleryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GalleryAlbumDto>> GetAlbumsAsync()
    {
        var albums = await _context.GalleryAlbums
            .Include(a => a.Images)
            .AsNoTracking()
            .Where(a => a.IsActive)
            .OrderByDescending(a => a.EventDate)
            .ToListAsync();

        return albums.Select(MapToAlbumDto).ToList();
    }

    public async Task<GalleryAlbumDto?> GetAlbumByIdAsync(int id)
    {
        var album = await _context.GalleryAlbums
            .Include(a => a.Images.OrderBy(i => i.DisplayOrder))
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        return album == null ? null : MapToAlbumDto(album);
    }

    public async Task<List<GalleryImageDto>> GetRecentImagesAsync(int count = 6)
    {
        var images = await _context.GalleryImages
            .Include(i => i.GalleryAlbum)
            .AsNoTracking()
            .Where(i => i.GalleryAlbum.IsActive)
            .OrderByDescending(i => i.UploadedAt)
            .Take(count)
            .ToListAsync();

        return images.Select(MapToImageDto).ToList();
    }

    public async Task<GalleryAlbumDto> CreateAlbumAsync(CreateAlbumDto dto)
    {
        var album = new GalleryAlbum
        {
            TitleEnglish = dto.TitleEnglish.Trim(),
            TitleMarathi = dto.TitleMarathi.Trim(),
            DescriptionEnglish = dto.DescriptionEnglish?.Trim(),
            DescriptionMarathi = dto.DescriptionMarathi?.Trim(),
            CoverImageUrl = dto.CoverImageUrl.Trim(),
            EventDate = dto.EventDate,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _context.GalleryAlbums.AddAsync(album);
        await _context.SaveChangesAsync();
        return MapToAlbumDto(album);
    }

    public async Task<GalleryAlbumDto?> UpdateAlbumAsync(int id, UpdateAlbumDto dto)
    {
        var album = await _context.GalleryAlbums.Include(a => a.Images).FirstOrDefaultAsync(a => a.Id == id);
        if (album == null) return null;

        album.TitleEnglish = dto.TitleEnglish.Trim();
        album.TitleMarathi = dto.TitleMarathi.Trim();
        album.DescriptionEnglish = dto.DescriptionEnglish?.Trim();
        album.DescriptionMarathi = dto.DescriptionMarathi?.Trim();
        album.CoverImageUrl = dto.CoverImageUrl.Trim();
        album.EventDate = dto.EventDate;
        album.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return MapToAlbumDto(album);
    }

    public async Task<bool> DeleteAlbumAsync(int id)
    {
        var album = await _context.GalleryAlbums.Include(a => a.Images).FirstOrDefaultAsync(a => a.Id == id);
        if (album == null) return false;

        _context.GalleryAlbums.Remove(album);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<GalleryImageDto?> AddImageToAlbumAsync(int albumId, AddGalleryImageDto dto)
    {
        var album = await _context.GalleryAlbums.FindAsync(albumId);
        if (album == null) return null;

        var image = new GalleryImage
        {
            GalleryAlbumId = albumId,
            ImageUrl = dto.ImageUrl.Trim(),
            CaptionEnglish = dto.CaptionEnglish?.Trim(),
            CaptionMarathi = dto.CaptionMarathi?.Trim(),
            DisplayOrder = dto.DisplayOrder,
            UploadedAt = DateTime.UtcNow
        };

        await _context.GalleryImages.AddAsync(image);
        await _context.SaveChangesAsync();
        return MapToImageDto(image);
    }

    public async Task<bool> DeleteImageAsync(int imageId)
    {
        var image = await _context.GalleryImages.FindAsync(imageId);
        if (image == null) return false;

        _context.GalleryImages.Remove(image);
        await _context.SaveChangesAsync();
        return true;
    }

    private static GalleryAlbumDto MapToAlbumDto(GalleryAlbum a) => new()
    {
        Id = a.Id,
        TitleEnglish = a.TitleEnglish,
        TitleMarathi = a.TitleMarathi,
        DescriptionEnglish = a.DescriptionEnglish,
        DescriptionMarathi = a.DescriptionMarathi,
        CoverImageUrl = a.CoverImageUrl,
        EventDate = a.EventDate,
        TotalImages = a.Images?.Count ?? 0,
        Images = a.Images?.OrderBy(i => i.DisplayOrder).Select(MapToImageDto).ToList() ?? new()
    };

    private static GalleryImageDto MapToImageDto(GalleryImage i) => new()
    {
        Id = i.Id,
        GalleryAlbumId = i.GalleryAlbumId,
        ImageUrl = i.ImageUrl,
        CaptionEnglish = i.CaptionEnglish,
        CaptionMarathi = i.CaptionMarathi,
        DisplayOrder = i.DisplayOrder
    };
}
