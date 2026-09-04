namespace LionGroup.API.DTOs.Donations;

public class DonationDto
{
    public int Id { get; set; }
    public int? CampaignId { get; set; }
    public string? CampaignTitleEnglish { get; set; }
    public string? CampaignTitleMarathi { get; set; }
    public string DonorName { get; set; } = string.Empty;
    public string DonorMobile { get; set; } = string.Empty;
    public string DonorEmail { get; set; } = string.Empty;
    public string DonorPanNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string UtrNumber { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime DonatedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
}
