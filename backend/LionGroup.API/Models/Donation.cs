using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.Models;

public class Donation
{
    public int Id { get; set; }

    public int? CampaignId { get; set; }

    [Required]
    [MaxLength(150)]
    public string DonorName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string DonorMobile { get; set; } = string.Empty;

    [MaxLength(150)]
    public string DonorEmail { get; set; } = string.Empty;

    [MaxLength(20)]
    public string DonorPanNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "UPI"; // UPI, BankTransfer, Cash

    [MaxLength(100)]
    public string UtrNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Approved, Rejected

    [Required]
    [MaxLength(50)]
    public string ReceiptNumber { get; set; } = string.Empty;

    public bool IsAnonymous { get; set; } = false;

    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;

    public DateTime DonatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? VerifiedAt { get; set; }

    // Navigation property
    public DonationCampaign? Campaign { get; set; }
}
