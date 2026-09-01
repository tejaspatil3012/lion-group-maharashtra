using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.About;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class AboutService : IAboutService
{
    private readonly ApplicationDbContext _context;

    public AboutService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AboutDto?> GetAboutDataAsync()
    {
        var org = await _context.OrganizationInfos.AsNoTracking().FirstOrDefaultAsync();
        if (org == null) return null;

        var coreLeaders = await _context.Members
            .Include(m => m.Designation)
            .AsNoTracking()
            .Where(m => m.IsActive && m.IsCoreLeader)
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FullNameEnglish = m.FullNameEnglish,
                FullNameMarathi = m.FullNameMarathi,
                DesignationId = m.DesignationId,
                DesignationEnglish = m.Designation.NameEnglish,
                DesignationMarathi = m.Designation.NameMarathi,
                MobileNumber = m.MobileNumber,
                Email = m.Email,
                District = m.District,
                Taluka = m.Taluka,
                VillageOrCity = m.VillageOrCity,
                PhotoUrl = m.PhotoUrl,
                DisplayOrder = m.DisplayOrder,
                IsCoreLeader = m.IsCoreLeader,
                JoinedDate = m.JoinedDate
            })
            .ToListAsync();

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
            PresidentPhotoUrl = org.PresidentPhotoUrl,
            PresidentMessageEnglish = org.PresidentMessageEnglish,
            PresidentMessageMarathi = org.PresidentMessageMarathi,
            HeadOfficeAddressEnglish = org.HeadOfficeAddressEnglish,
            HeadOfficeAddressMarathi = org.HeadOfficeAddressMarathi,
            PrimaryPhone = org.PrimaryPhone,
            EmergencyBloodHelpline = org.EmergencyBloodHelpline,
            PrimaryEmail = org.PrimaryEmail,
            TotalMembersCount = org.TotalMembersCount,
            TotalBloodUnitsDonated = org.TotalBloodUnitsDonated,
            TotalTreesPlanted = org.TotalTreesPlanted,
            TotalBeneficiariesServed = org.TotalBeneficiariesServed,
            CoreLeadership = coreLeaders
        };
    }

    public async Task<AboutDto> UpdateAboutDataAsync(UpdateAboutDto dto)
    {
        var org = await _context.OrganizationInfos.FirstOrDefaultAsync();
        if (org == null)
        {
            org = new OrganizationInfo();
            await _context.OrganizationInfos.AddAsync(org);
        }

        org.OrgNameEnglish = dto.OrgNameEnglish.Trim();
        org.OrgNameMarathi = dto.OrgNameMarathi.Trim();
        org.TaglineEnglish = dto.TaglineEnglish?.Trim();
        org.TaglineMarathi = dto.TaglineMarathi?.Trim();
        org.MissionEnglish = dto.MissionEnglish.Trim();
        org.MissionMarathi = dto.MissionMarathi.Trim();
        org.VisionEnglish = dto.VisionEnglish.Trim();
        org.VisionMarathi = dto.VisionMarathi.Trim();
        org.AboutHistoryEnglish = dto.AboutHistoryEnglish.Trim();
        org.AboutHistoryMarathi = dto.AboutHistoryMarathi.Trim();
        org.PresidentNameEnglish = dto.PresidentNameEnglish.Trim();
        org.PresidentNameMarathi = dto.PresidentNameMarathi.Trim();
        org.PresidentPhotoUrl = dto.PresidentPhotoUrl;
        org.PresidentMessageEnglish = dto.PresidentMessageEnglish.Trim();
        org.PresidentMessageMarathi = dto.PresidentMessageMarathi.Trim();
        org.HeadOfficeAddressEnglish = dto.HeadOfficeAddressEnglish.Trim();
        org.HeadOfficeAddressMarathi = dto.HeadOfficeAddressMarathi.Trim();
        org.PrimaryPhone = dto.PrimaryPhone.Trim();
        org.EmergencyBloodHelpline = dto.EmergencyBloodHelpline.Trim();
        org.PrimaryEmail = dto.PrimaryEmail.Trim();
        org.TotalMembersCount = dto.TotalMembersCount;
        org.TotalBloodUnitsDonated = dto.TotalBloodUnitsDonated;
        org.TotalTreesPlanted = dto.TotalTreesPlanted;
        org.TotalBeneficiariesServed = dto.TotalBeneficiariesServed;

        await _context.SaveChangesAsync();
        return (await GetAboutDataAsync())!;
    }
}
