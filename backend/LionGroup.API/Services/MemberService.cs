using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Services;

public class MemberService : IMemberService
{
    private readonly ApplicationDbContext _context;

    public MemberService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MemberDto>> GetAllMembersAsync(string? district = null, int? designationId = null, bool? isCoreLeader = null)
    {
        var query = _context.Members
            .Include(m => m.Designation)
            .Where(m => m.IsActive)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(m => m.District.ToLower() == district.ToLower());
        }

        if (designationId.HasValue)
        {
            query = query.Where(m => m.DesignationId == designationId.Value);
        }

        if (isCoreLeader.HasValue)
        {
            query = query.Where(m => m.IsCoreLeader == isCoreLeader.Value);
        }

        var members = await query
            .OrderBy(m => m.DisplayOrder)
            .ThenBy(m => m.FullNameEnglish)
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FullNameEnglish = m.FullNameEnglish,
                FullNameMarathi = m.FullNameMarathi,
                DesignationId = m.DesignationId,
                DesignationEnglish = m.Designation != null ? m.Designation.NameEnglish : string.Empty,
                DesignationMarathi = m.Designation != null ? m.Designation.NameMarathi : string.Empty,
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

        return members;
    }

    public async Task<MemberDto?> GetMemberByIdAsync(int id)
    {
        var member = await _context.Members
            .Include(m => m.Designation)
            .Where(m => m.Id == id && m.IsActive)
            .AsNoTracking()
            .Select(m => new MemberDto
            {
                Id = m.Id,
                FullNameEnglish = m.FullNameEnglish,
                FullNameMarathi = m.FullNameMarathi,
                DesignationId = m.DesignationId,
                DesignationEnglish = m.Designation != null ? m.Designation.NameEnglish : string.Empty,
                DesignationMarathi = m.Designation != null ? m.Designation.NameMarathi : string.Empty,
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
            .FirstOrDefaultAsync();

        return member;
    }

    public async Task<List<MemberDto>> GetCoreLeadershipAsync()
    {
        return await GetAllMembersAsync(isCoreLeader: true);
    }

    public async Task<List<DesignationDto>> GetAllDesignationsAsync()
    {
        return await _context.Designations
            .AsNoTracking()
            .OrderBy(d => d.DisplayOrder)
            .Select(d => new DesignationDto
            {
                Id = d.Id,
                NameEnglish = d.NameEnglish,
                NameMarathi = d.NameMarathi,
                DisplayOrder = d.DisplayOrder,
                IsCoreLeader = d.IsCoreLeader
            })
            .ToListAsync();
    }
}
