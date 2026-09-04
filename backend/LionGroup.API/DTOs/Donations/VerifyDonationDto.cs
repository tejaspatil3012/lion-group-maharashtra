using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Donations;

public class VerifyDonationDto
{
    [Required]
    public string Status { get; set; } = "Approved"; // Approved or Rejected

    [MaxLength(500)]
    public string? AdminNote { get; set; }
}
