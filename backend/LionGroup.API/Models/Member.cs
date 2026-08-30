namespace LionGroup.API.Models;

public class Member
{
    public int Id { get; set; }
    public string FullNameEnglish { get; set; } = string.Empty;
    public string FullNameMarathi { get; set; } = string.Empty;
    public int DesignationId { get; set; }
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }
    public string District { get; set; } = string.Empty;
    public string? Taluka { get; set; }
    public string? VillageOrCity { get; set; }
    public string? PhotoUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsCoreLeader { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;

    // Navigation
    public Designation? Designation { get; set; }
}
