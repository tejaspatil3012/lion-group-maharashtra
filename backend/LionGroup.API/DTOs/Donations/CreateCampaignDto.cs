using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Donations;

public class CreateCampaignDto
{
    [Required]
    [MaxLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleMarathi { get; set; } = string.Empty;

    [MaxLength(500)]
    public string SummaryEnglish { get; set; } = string.Empty;

    [MaxLength(500)]
    public string SummaryMarathi { get; set; } = string.Empty;

    [Required]
    public string DescriptionEnglish { get; set; } = string.Empty;

    [Required]
    public string DescriptionMarathi { get; set; } = string.Empty;

    [Required]
    [Range(100, 100000000)]
    public decimal TargetAmount { get; set; }

    [MaxLength(500)]
    public string BannerImageUrl { get; set; } = string.Empty;

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsFeatured { get; set; } = false;
}
