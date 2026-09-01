using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Home;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Services;

public class HomeService : IHomeService
{
    private readonly ApplicationDbContext _context;
    private readonly IMemberService _memberService;
    private readonly IActivityService _activityService;
    private readonly IEventService _eventService;
    private readonly IGalleryService _galleryService;

    public HomeService(
        ApplicationDbContext context,
        IMemberService memberService,
        IActivityService activityService,
        IEventService eventService,
        IGalleryService galleryService)
    {
        _context = context;
        _memberService = memberService;
        _activityService = activityService;
        _eventService = eventService;
        _galleryService = galleryService;
    }

    public async Task<HomeDto> GetHomeDataAsync()
    {
        var org = await _context.OrganizationInfos.FirstOrDefaultAsync() ?? new Models.OrganizationInfo();
        var coreLeaders = await _memberService.GetCoreLeadershipAsync();
        var featuredActivities = await _activityService.GetFeaturedActivitiesAsync(3);
        var upcomingEvents = await _eventService.GetUpcomingEventsAsync(3);
        var recentGallery = await _galleryService.GetRecentImagesAsync(6);

        return new HomeDto
        {
            OrgNameEnglish = org.OrgNameEnglish,
            OrgNameMarathi = org.OrgNameMarathi,
            TaglineEnglish = org.TaglineEnglish,
            TaglineMarathi = org.TaglineMarathi,
            PresidentNameEnglish = org.PresidentNameEnglish,
            PresidentNameMarathi = org.PresidentNameMarathi,
            PresidentMessageEnglish = org.PresidentMessageEnglish,
            PresidentMessageMarathi = org.PresidentMessageMarathi,
            PresidentPhotoUrl = org.PresidentPhotoUrl,
            PrimaryPhone = org.PrimaryPhone,
            EmergencyBloodHelpline = org.EmergencyBloodHelpline,
            PrimaryEmail = org.PrimaryEmail,
            HeadOfficeAddressEnglish = org.HeadOfficeAddressEnglish,
            HeadOfficeAddressMarathi = org.HeadOfficeAddressMarathi,
            TotalMembersCount = org.TotalMembersCount,
            TotalBloodUnitsDonated = org.TotalBloodUnitsDonated,
            TotalTreesPlanted = org.TotalTreesPlanted,
            TotalBeneficiariesServed = org.TotalBeneficiariesServed,
            CoreLeadership = coreLeaders,
            FeaturedActivities = featuredActivities,
            UpcomingEvents = upcomingEvents,
            RecentGalleryImages = recentGallery
        };
    }
}
