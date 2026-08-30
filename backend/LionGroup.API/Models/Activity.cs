namespace LionGroup.API.Models;

public class Activity
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string Category { get; set; } = "Social"; // BloodDonation, TreePlantation, HealthCamp, FoodDistribution, Social, Event
    public string SummaryEnglish { get; set; } = string.Empty;
    public string SummaryMarathi { get; set; } = string.Empty;
    public string DescriptionEnglish { get; set; } = string.Empty;
    public string DescriptionMarathi { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime ActivityDate { get; set; } = DateTime.UtcNow;
    public string? BannerImageUrl { get; set; }
    public int BeneficiariesCount { get; set; } = 0;
    public int VolunteersCount { get; set; } = 0;
    public bool IsFeatured { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
