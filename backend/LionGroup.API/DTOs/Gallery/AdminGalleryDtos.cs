using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Gallery;

public class CreateAlbumDto
{
    [Required]
    [MaxLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleMarathi { get; set; } = string.Empty;

    public string? DescriptionEnglish { get; set; }

    public string? DescriptionMarathi { get; set; }

    [Required]
    public string CoverImageUrl { get; set; } = string.Empty;

    public DateTime EventDate { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;
}

public class UpdateAlbumDto : CreateAlbumDto
{
}

public class AddGalleryImageDto
{
    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? CaptionEnglish { get; set; }

    [MaxLength(250)]
    public string? CaptionMarathi { get; set; }

    public int DisplayOrder { get; set; } = 0;
}
