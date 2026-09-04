using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Donations;

public class CreateDonationDto
{
    public int? CampaignId { get; set; }

    [Required]
    [MaxLength(150)]
    public string DonorName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string DonorMobile { get; set; } = string.Empty;

    [MaxLength(150)]
    [EmailAddress]
    public string? DonorEmail { get; set; }

    [MaxLength(20)]
    public string? DonorPanNumber { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [Required]
    [Range(10, 10000000)]
    public decimal Amount { get; set; }

    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "UPI"; // UPI, BankTransfer, Cash

    [MaxLength(100)]
    public string? UtrNumber { get; set; }

    public bool IsAnonymous { get; set; } = false;

    [MaxLength(500)]
    public string? Notes { get; set; }
}
