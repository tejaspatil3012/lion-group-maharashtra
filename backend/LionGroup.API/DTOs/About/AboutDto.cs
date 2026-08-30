using LionGroup.API.DTOs.Members;

namespace LionGroup.API.DTOs.About;

public class AboutDto
{
    public string OrgNameEnglish { get; set; } = string.Empty;
    public string OrgNameMarathi { get; set; } = string.Empty;
    public string TaglineEnglish { get; set; } = string.Empty;
    public string TaglineMarathi { get; set; } = string.Empty;
    public string MissionEnglish { get; set; } = string.Empty;
    public string MissionMarathi { get; set; } = string.Empty;
    public string VisionEnglish { get; set; } = string.Empty;
    public string VisionMarathi { get; set; } = string.Empty;
    public string AboutHistoryEnglish { get; set; } = string.Empty;
    public string AboutHistoryMarathi { get; set; } = string.Empty;
    public string PresidentNameEnglish { get; set; } = string.Empty;
    public string PresidentNameMarathi { get; set; } = string.Empty;
    public string PresidentMessageEnglish { get; set; } = string.Empty;
    public string PresidentMessageMarathi { get; set; } = string.Empty;
    public string? PresidentPhotoUrl { get; set; }
    public int TotalMembersCount { get; set; }
    public int TotalBloodUnitsDonated { get; set; }
    public int TotalTreesPlanted { get; set; }
    public int TotalBeneficiariesServed { get; set; }
    public List<MemberDto> CoreLeadership { get; set; } = new();
}
