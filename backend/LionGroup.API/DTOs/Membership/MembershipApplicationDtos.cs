using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Membership;

public class CreateMembershipApplicationDto
{
    [Required(ErrorMessage = "Full Name in English is required.")]
    [MaxLength(150)]
    public string FullNameEnglish { get; set; } = string.Empty;

    [Required(ErrorMessage = "Full Name in Marathi is required.")]
    [MaxLength(150)]
    public string FullNameMarathi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mobile Number is required.")]
    [MaxLength(20)]
    public string MobileNumber { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(150)]
    public string? Email { get; set; }

    [Required(ErrorMessage = "District is required.")]
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
}

public class MembershipApplicationDto
{
    public int Id { get; set; }
    public string FullNameEnglish { get; set; } = string.Empty;
    public string FullNameMarathi { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string District { get; set; } = string.Empty;
    public string? Taluka { get; set; }
    public string? VillageOrCity { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Occupation { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime AppliedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public int? ApprovedMemberId { get; set; }
}

public class ApproveApplicationDto
{
    [Required]
    public int DesignationId { get; set; }

    public bool IsCoreLeader { get; set; } = false;

    public int DisplayOrder { get; set; } = 50;
}
