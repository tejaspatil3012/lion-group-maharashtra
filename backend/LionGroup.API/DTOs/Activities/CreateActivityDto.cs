using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Activities;

public class CreateActivityDto
{
    [Required]
    [MaxLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleMarathi { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = "BloodDonation"; // BloodDonation, TreePlantation, HealthCamp, FoodDistribution, Education, Youth

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

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    public DateTime ActivityDate { get; set; } = DateTime.UtcNow;

    public string? BannerImageUrl { get; set; }

    public int BeneficiariesCount { get; set; } = 0;

    public int VolunteersCount { get; set; } = 0;

    public bool IsFeatured { get; set; } = false;
}

public class UpdateActivityDto : CreateActivityDto
{
}
