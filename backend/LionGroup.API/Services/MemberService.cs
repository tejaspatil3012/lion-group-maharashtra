using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

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
            .AsNoTracking()
            .Where(m => m.IsActive);

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(m => m.District.ToLower() == district.ToLower());
        }

        if (designationId.HasValue && designationId.Value > 0)
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
            .ToListAsync();

        return members.Select(MapToDto).ToList();
    }

    public async Task<MemberDto?> GetMemberByIdAsync(int id)
    {
        var member = await _context.Members
            .Include(m => m.Designation)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);

        return member == null ? null : MapToDto(member);
    }

    public async Task<List<MemberDto>> GetCoreLeadershipAsync()
    {
        var leaders = await _context.Members
            .Include(m => m.Designation)
            .AsNoTracking()
            .Where(m => m.IsActive && m.IsCoreLeader)
            .OrderBy(m => m.DisplayOrder)
            .ThenBy(m => m.FullNameEnglish)
            .ToListAsync();

        return leaders.Select(MapToDto).ToList();
    }

    public async Task<List<DesignationDto>> GetAllDesignationsAsync()
    {
        var designations = await _context.Designations
            .AsNoTracking()
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        return designations.Select(d => new DesignationDto
        {
            Id = d.Id,
            NameEnglish = d.NameEnglish,
            NameMarathi = d.NameMarathi,
            DisplayOrder = d.DisplayOrder,
            IsCoreLeader = d.IsCoreLeader
        }).ToList();
    }

    public async Task<MemberDto> CreateMemberAsync(CreateMemberDto dto)
    {
        var member = new Member
        {
            FullNameEnglish = dto.FullNameEnglish.Trim(),
            FullNameMarathi = dto.FullNameMarathi.Trim(),
            DesignationId = dto.DesignationId,
            MobileNumber = dto.MobileNumber?.Trim(),
            Email = dto.Email?.Trim(),
            District = dto.District.Trim(),
            Taluka = dto.Taluka?.Trim(),
            VillageOrCity = dto.VillageOrCity?.Trim(),
            PhotoUrl = dto.PhotoUrl,
            DisplayOrder = dto.DisplayOrder,
            IsCoreLeader = dto.IsCoreLeader,
            IsActive = dto.IsActive,
            JoinedDate = dto.JoinedDate ?? DateTime.UtcNow
        };

        await _context.Members.AddAsync(member);
        await _context.SaveChangesAsync();

        // Load designation navigation property
        await _context.Entry(member).Reference(m => m.Designation).LoadAsync();
        return MapToDto(member);
    }

    public async Task<MemberDto?> UpdateMemberAsync(int id, UpdateMemberDto dto)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return null;

        member.FullNameEnglish = dto.FullNameEnglish.Trim();
        member.FullNameMarathi = dto.FullNameMarathi.Trim();
        member.DesignationId = dto.DesignationId;
        member.MobileNumber = dto.MobileNumber?.Trim();
        member.Email = dto.Email?.Trim();
        member.District = dto.District.Trim();
        member.Taluka = dto.Taluka?.Trim();
        member.VillageOrCity = dto.VillageOrCity?.Trim();
        member.PhotoUrl = dto.PhotoUrl;
        member.DisplayOrder = dto.DisplayOrder;
        member.IsCoreLeader = dto.IsCoreLeader;
        member.IsActive = dto.IsActive;
        if (dto.JoinedDate.HasValue) member.JoinedDate = dto.JoinedDate.Value;

        await _context.SaveChangesAsync();
        await _context.Entry(member).Reference(m => m.Designation).LoadAsync();
        return MapToDto(member);
    }

    public async Task<bool> DeleteMemberAsync(int id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return false;

        _context.Members.Remove(member);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DesignationDto> CreateDesignationAsync(CreateDesignationDto dto)
    {
        var designation = new Designation
        {
            NameEnglish = dto.NameEnglish.Trim(),
            NameMarathi = dto.NameMarathi.Trim(),
            DisplayOrder = dto.DisplayOrder,
            IsCoreLeader = dto.IsCoreLeader
        };

        await _context.Designations.AddAsync(designation);
        await _context.SaveChangesAsync();

        return new DesignationDto
        {
            Id = designation.Id,
            NameEnglish = designation.NameEnglish,
            NameMarathi = designation.NameMarathi,
            DisplayOrder = designation.DisplayOrder,
            IsCoreLeader = designation.IsCoreLeader
        };
    }

    private static MemberDto MapToDto(Member m) => new()
    {
        Id = m.Id,
        FullNameEnglish = m.FullNameEnglish,
        FullNameMarathi = m.FullNameMarathi,
        DesignationId = m.DesignationId,
        DesignationEnglish = m.Designation?.NameEnglish ?? string.Empty,
        DesignationMarathi = m.Designation?.NameMarathi ?? string.Empty,
        MobileNumber = m.MobileNumber,
        Email = m.Email,
        District = m.District,
        Taluka = m.Taluka,
        VillageOrCity = m.VillageOrCity,
        PhotoUrl = m.PhotoUrl,
        DisplayOrder = m.DisplayOrder,
        IsCoreLeader = m.IsCoreLeader,
        JoinedDate = m.JoinedDate
    };
}
