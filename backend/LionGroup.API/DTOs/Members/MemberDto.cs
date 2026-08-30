namespace LionGroup.API.DTOs.Members;

public class DesignationDto
{
    public int Id { get; set; }
    public string NameEnglish { get; set; } = string.Empty;
    public string NameMarathi { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsCoreLeader { get; set; }
}

public class MemberDto
{
    public int Id { get; set; }
    public string FullNameEnglish { get; set; } = string.Empty;
    public string FullNameMarathi { get; set; } = string.Empty;
    public int DesignationId { get; set; }
    public string DesignationEnglish { get; set; } = string.Empty;
    public string DesignationMarathi { get; set; } = string.Empty;
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }
    public string District { get; set; } = string.Empty;
    public string? Taluka { get; set; }
    public string? VillageOrCity { get; set; }
    public string? PhotoUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsCoreLeader { get; set; }
    public DateTime JoinedDate { get; set; }
}
