namespace LionGroup.API.DTOs.Donations;

public class CampaignDto
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string SummaryEnglish { get; set; } = string.Empty;
    public string SummaryMarathi { get; set; } = string.Empty;
    public string DescriptionEnglish { get; set; } = string.Empty;
    public string DescriptionMarathi { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public double ProgressPercentage { get; set; }
    public string BannerImageUrl { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public int DonorsCount { get; set; }
}
