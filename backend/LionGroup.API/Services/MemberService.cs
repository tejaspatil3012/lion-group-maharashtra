using AutoMapper;
using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class MemberService : IMemberService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public MemberService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
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

        return _mapper.Map<List<MemberDto>>(members);
    }

    public async Task<MemberDto?> GetMemberByIdAsync(int id)
    {
        var member = await _context.Members
            .Include(m => m.Designation)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);

        return member == null ? null : _mapper.Map<MemberDto>(member);
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

        return _mapper.Map<List<MemberDto>>(leaders);
    }

    public async Task<List<DesignationDto>> GetAllDesignationsAsync()
    {
        var designations = await _context.Designations
            .AsNoTracking()
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        return _mapper.Map<List<DesignationDto>>(designations);
    }

    public async Task<MemberDto> CreateMemberAsync(CreateMemberDto dto)
    {
        var member = _mapper.Map<Member>(dto);

        await _context.Members.AddAsync(member);
        await _context.SaveChangesAsync();

        // Load designation navigation property
        await _context.Entry(member).Reference(m => m.Designation).LoadAsync();
        return _mapper.Map<MemberDto>(member);
    }

    public async Task<MemberDto?> UpdateMemberAsync(int id, UpdateMemberDto dto)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return null;

        _mapper.Map(dto, member);
        if (dto.JoinedDate.HasValue) member.JoinedDate = dto.JoinedDate.Value;

        await _context.SaveChangesAsync();
        await _context.Entry(member).Reference(m => m.Designation).LoadAsync();
        return _mapper.Map<MemberDto>(member);
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
        var designation = _mapper.Map<Designation>(dto);

        await _context.Designations.AddAsync(designation);
        await _context.SaveChangesAsync();

        return _mapper.Map<DesignationDto>(designation);
    }
}
