using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Contact;

public class ContactInfoDto
{
    public string OrgNameEnglish { get; set; } = string.Empty;
    public string OrgNameMarathi { get; set; } = string.Empty;
    public string PrimaryPhone { get; set; } = string.Empty;
    public string EmergencyBloodHelpline { get; set; } = string.Empty;
    public string PrimaryEmail { get; set; } = string.Empty;
    public string HeadOfficeAddressEnglish { get; set; } = string.Empty;
    public string HeadOfficeAddressMarathi { get; set; } = string.Empty;
}

public class CreateInquiryDto
{
    [Required(ErrorMessage = "Full name is required")]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mobile number is required")]
    [Phone(ErrorMessage = "Invalid phone number")]
    [MaxLength(20)]
    public string MobileNumber { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(150)]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Subject is required")]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required")]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? District { get; set; }
}
