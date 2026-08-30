using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.About;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Services;

public class AboutService : IAboutService
{
    private readonly ApplicationDbContext _context;
    private readonly IMemberService _memberService;

    public AboutService(ApplicationDbContext context, IMemberService memberService)
    {
        _context = context;
        _memberService = memberService;
    }

    public async Task<AboutDto> GetAboutDataAsync()
    {
        var org = await _context.OrganizationInfos.FirstOrDefaultAsync() ?? new Models.OrganizationInfo();
        var coreLeaders = await _memberService.GetCoreLeadershipAsync();

        return new AboutDto
        {
            OrgNameEnglish = org.OrgNameEnglish,
            OrgNameMarathi = org.OrgNameMarathi,
            TaglineEnglish = org.TaglineEnglish,
            TaglineMarathi = org.TaglineMarathi,
            MissionEnglish = org.MissionEnglish,
            MissionMarathi = org.MissionMarathi,
            VisionEnglish = org.VisionEnglish,
            VisionMarathi = org.VisionMarathi,
            AboutHistoryEnglish = org.AboutHistoryEnglish,
            AboutHistoryMarathi = org.AboutHistoryMarathi,
            PresidentNameEnglish = org.PresidentNameEnglish,
            PresidentNameMarathi = org.PresidentNameMarathi,
            PresidentMessageEnglish = org.PresidentMessageEnglish,
            PresidentMessageMarathi = org.PresidentMessageMarathi,
            PresidentPhotoUrl = org.PresidentPhotoUrl,
            TotalMembersCount = org.TotalMembersCount,
            TotalBloodUnitsDonated = org.TotalBloodUnitsDonated,
            TotalTreesPlanted = org.TotalTreesPlanted,
            TotalBeneficiariesServed = org.TotalBeneficiariesServed,
            CoreLeadership = coreLeaders
        };
    }
}
