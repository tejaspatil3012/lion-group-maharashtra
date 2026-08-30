namespace LionGroup.API.Models;

public class ContactInquiry
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? District { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
