using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.Models;

public class DonationCampaign
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleMarathi { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string SummaryEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string SummaryMarathi { get; set; } = string.Empty;

    [Required]
    public string DescriptionEnglish { get; set; } = string.Empty;

    [Required]
    public string DescriptionMarathi { get; set; } = string.Empty;

    public decimal TargetAmount { get; set; }

    public decimal RaisedAmount { get; set; } = 0;

    [MaxLength(500)]
    public string BannerImageUrl { get; set; } = string.Empty;

    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsFeatured { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Donation> Donations { get; set; } = new List<Donation>();
}
