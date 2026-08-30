namespace LionGroup.API.DTOs.Activities;

public class ActivityDto
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SummaryEnglish { get; set; } = string.Empty;
    public string SummaryMarathi { get; set; } = string.Empty;
    public string DescriptionEnglish { get; set; } = string.Empty;
    public string DescriptionMarathi { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime ActivityDate { get; set; }
    public string? BannerImageUrl { get; set; }
    public int BeneficiariesCount { get; set; }
    public int VolunteersCount { get; set; }
    public bool IsFeatured { get; set; }
}
