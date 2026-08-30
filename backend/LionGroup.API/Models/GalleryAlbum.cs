namespace LionGroup.API.Models;

public class GalleryAlbum
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionMarathi { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime EventDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<GalleryImage> Images { get; set; } = new List<GalleryImage>();
}
