using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Gallery;
using LionGroup.API.Interfaces;

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
        return await _context.GalleryAlbums
            .Where(a => a.IsActive)
            .Include(a => a.Images)
            .OrderByDescending(a => a.EventDate)
            .AsNoTracking()
            .Select(a => new GalleryAlbumDto
            {
                Id = a.Id,
                TitleEnglish = a.TitleEnglish,
                TitleMarathi = a.TitleMarathi,
                DescriptionEnglish = a.DescriptionEnglish,
                DescriptionMarathi = a.DescriptionMarathi,
                CoverImageUrl = a.CoverImageUrl ?? (a.Images.Any() ? a.Images.OrderBy(i => i.DisplayOrder).First().ImageUrl : null),
                EventDate = a.EventDate,
                TotalImages = a.Images.Count,
                Images = a.Images
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => new GalleryImageDto
                    {
                        Id = i.Id,
                        GalleryAlbumId = i.GalleryAlbumId,
                        ImageUrl = i.ImageUrl,
                        CaptionEnglish = i.CaptionEnglish,
                        CaptionMarathi = i.CaptionMarathi,
                        DisplayOrder = i.DisplayOrder
                    })
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<GalleryAlbumDto?> GetAlbumByIdAsync(int id)
    {
        return await _context.GalleryAlbums
            .Where(a => a.Id == id && a.IsActive)
            .Include(a => a.Images)
            .AsNoTracking()
            .Select(a => new GalleryAlbumDto
            {
                Id = a.Id,
                TitleEnglish = a.TitleEnglish,
                TitleMarathi = a.TitleMarathi,
                DescriptionEnglish = a.DescriptionEnglish,
                DescriptionMarathi = a.DescriptionMarathi,
                CoverImageUrl = a.CoverImageUrl ?? (a.Images.Any() ? a.Images.OrderBy(i => i.DisplayOrder).First().ImageUrl : null),
                EventDate = a.EventDate,
                TotalImages = a.Images.Count,
                Images = a.Images
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => new GalleryImageDto
                    {
                        Id = i.Id,
                        GalleryAlbumId = i.GalleryAlbumId,
                        ImageUrl = i.ImageUrl,
                        CaptionEnglish = i.CaptionEnglish,
                        CaptionMarathi = i.CaptionMarathi,
                        DisplayOrder = i.DisplayOrder
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<GalleryImageDto>> GetRecentImagesAsync(int count = 6)
    {
        return await _context.GalleryImages
            .Include(i => i.GalleryAlbum)
            .Where(i => i.GalleryAlbum != null && i.GalleryAlbum.IsActive)
            .OrderByDescending(i => i.UploadedAt)
            .Take(count)
            .AsNoTracking()
            .Select(i => new GalleryImageDto
            {
                Id = i.Id,
                GalleryAlbumId = i.GalleryAlbumId,
                ImageUrl = i.ImageUrl,
                CaptionEnglish = i.CaptionEnglish,
                CaptionMarathi = i.CaptionMarathi,
                DisplayOrder = i.DisplayOrder
            })
            .ToListAsync();
    }
}
