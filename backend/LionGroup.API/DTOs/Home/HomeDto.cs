using LionGroup.API.DTOs.Activities;
using LionGroup.API.DTOs.Events;
using LionGroup.API.DTOs.Gallery;
using LionGroup.API.DTOs.Members;

namespace LionGroup.API.DTOs.Home;

public class HomeDto
{
    public string OrgNameEnglish { get; set; } = string.Empty;
    public string OrgNameMarathi { get; set; } = string.Empty;
    public string TaglineEnglish { get; set; } = string.Empty;
    public string TaglineMarathi { get; set; } = string.Empty;
    public string PresidentNameEnglish { get; set; } = string.Empty;
    public string PresidentNameMarathi { get; set; } = string.Empty;
    public string PresidentMessageEnglish { get; set; } = string.Empty;
    public string PresidentMessageMarathi { get; set; } = string.Empty;
    public string? PresidentPhotoUrl { get; set; }
    
    // Contact & Emergency
    public string PrimaryPhone { get; set; } = string.Empty;
    public string EmergencyBloodHelpline { get; set; } = string.Empty;
    public string PrimaryEmail { get; set; } = string.Empty;
    public string HeadOfficeAddressEnglish { get; set; } = string.Empty;
    public string HeadOfficeAddressMarathi { get; set; } = string.Empty;

    // Impact Counters
    public int TotalMembersCount { get; set; }
    public int TotalBloodUnitsDonated { get; set; }
    public int TotalTreesPlanted { get; set; }
    public int TotalBeneficiariesServed { get; set; }

    // Featured Highlights
    public List<MemberDto> CoreLeadership { get; set; } = new();
    public List<ActivityDto> FeaturedActivities { get; set; } = new();
    public List<EventDto> UpcomingEvents { get; set; } = new();
    public List<GalleryImageDto> RecentGalleryImages { get; set; } = new();
}
