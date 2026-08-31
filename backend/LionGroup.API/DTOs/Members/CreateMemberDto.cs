using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Members;

public class CreateMemberDto
{
    [Required(ErrorMessage = "English full name is required")]
    [MaxLength(150)]
    public string FullNameEnglish { get; set; } = string.Empty;

    [Required(ErrorMessage = "Marathi full name is required")]
    [MaxLength(150)]
    public string FullNameMarathi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Designation is required")]
    public int DesignationId { get; set; }

    [MaxLength(20)]
    public string? MobileNumber { get; set; }

    [EmailAddress]
    [MaxLength(150)]
    public string? Email { get; set; }

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Taluka { get; set; }

    [MaxLength(100)]
    public string? VillageOrCity { get; set; }

    public string? PhotoUrl { get; set; }

    public int DisplayOrder { get; set; } = 0;

    public bool IsCoreLeader { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public DateTime? JoinedDate { get; set; }
}

public class UpdateMemberDto : CreateMemberDto
{
}

public class CreateDesignationDto
{
    [Required]
    [MaxLength(100)]
    public string NameEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string NameMarathi { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;

    public bool IsCoreLeader { get; set; } = false;
}
