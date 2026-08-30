namespace LionGroup.API.Models;

public class GalleryImage
{
    public int Id { get; set; }
    public int GalleryAlbumId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? CaptionEnglish { get; set; }
    public string? CaptionMarathi { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public GalleryAlbum? GalleryAlbum { get; set; }
}
