namespace LionGroup.API.Models;

public class OrganizationInfo
{
    public int Id { get; set; }
    public string OrgNameEnglish { get; set; } = "LION GROUP MAHARASHTRA RAJYA";
    public string OrgNameMarathi { get; set; } = "लायन ग्रुप महाराष्ट्र राज्य";
    public string TaglineEnglish { get; set; } = "Dedicated to Social Service, Unity & Community Empowerment";
    public string TaglineMarathi { get; set; } = "समाजसेवा, एकता आणि लोककल्याण यासाठी कटिबद्ध";
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
    public string PrimaryPhone { get; set; } = string.Empty;
    public string EmergencyBloodHelpline { get; set; } = string.Empty;
    public string PrimaryEmail { get; set; } = string.Empty;
    public string HeadOfficeAddressEnglish { get; set; } = string.Empty;
    public string HeadOfficeAddressMarathi { get; set; } = string.Empty;
    public int TotalMembersCount { get; set; } = 1500;
    public int TotalBloodUnitsDonated { get; set; } = 3850;
    public int TotalTreesPlanted { get; set; } = 12500;
    public int TotalBeneficiariesServed { get; set; } = 45000;
}
