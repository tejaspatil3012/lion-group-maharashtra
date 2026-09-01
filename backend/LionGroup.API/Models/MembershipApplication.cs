using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LionGroup.API.Models;

[Table("MembershipApplications")]
public class MembershipApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string FullNameEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string FullNameMarathi { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string MobileNumber { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Email { get; set; }

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Taluka { get; set; }

    [MaxLength(100)]
    public string? VillageOrCity { get; set; }

    [MaxLength(500)]
    public string? PhotoUrl { get; set; }

    [MaxLength(150)]
    public string? Occupation { get; set; }

    [MaxLength(1000)]
    public string? Message { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }

    public int? ApprovedMemberId { get; set; }
}
