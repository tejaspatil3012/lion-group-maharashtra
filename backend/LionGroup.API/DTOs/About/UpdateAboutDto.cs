using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.About;

public class UpdateAboutDto
{
    [Required]
    [MaxLength(200)]
    public string OrgNameEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string OrgNameMarathi { get; set; } = string.Empty;

    public string? TaglineEnglish { get; set; }

    public string? TaglineMarathi { get; set; }

    [Required]
    public string MissionEnglish { get; set; } = string.Empty;

    [Required]
    public string MissionMarathi { get; set; } = string.Empty;

    [Required]
    public string VisionEnglish { get; set; } = string.Empty;

    [Required]
    public string VisionMarathi { get; set; } = string.Empty;

    [Required]
    public string AboutHistoryEnglish { get; set; } = string.Empty;

    [Required]
    public string AboutHistoryMarathi { get; set; } = string.Empty;

    [Required]
    public string PresidentNameEnglish { get; set; } = string.Empty;

    [Required]
    public string PresidentNameMarathi { get; set; } = string.Empty;

    public string? PresidentPhotoUrl { get; set; }

    [Required]
    public string PresidentMessageEnglish { get; set; } = string.Empty;

    [Required]
    public string PresidentMessageMarathi { get; set; } = string.Empty;

    [Required]
    public string HeadOfficeAddressEnglish { get; set; } = string.Empty;

    [Required]
    public string HeadOfficeAddressMarathi { get; set; } = string.Empty;

    [Required]
    public string PrimaryPhone { get; set; } = string.Empty;

    [Required]
    public string EmergencyBloodHelpline { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string PrimaryEmail { get; set; } = string.Empty;

    public int TotalMembersCount { get; set; }

    public int TotalBloodUnitsDonated { get; set; }

    public int TotalTreesPlanted { get; set; }

    public int TotalBeneficiariesServed { get; set; }
}
