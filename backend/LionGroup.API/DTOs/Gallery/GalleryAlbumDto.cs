namespace LionGroup.API.DTOs.Gallery;

public class GalleryImageDto
{
    public int Id { get; set; }
    public int GalleryAlbumId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? CaptionEnglish { get; set; }
    public string? CaptionMarathi { get; set; }
    public int DisplayOrder { get; set; }
}

public class GalleryAlbumDto
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionMarathi { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime EventDate { get; set; }
    public int TotalImages { get; set; }
    public List<GalleryImageDto> Images { get; set; } = new();
}
