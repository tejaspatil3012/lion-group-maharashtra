using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Membership;
using LionGroup.API.DTOs.Members;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class MembershipApplicationService : IMembershipApplicationService
{
    private readonly ApplicationDbContext _context;

    public MembershipApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MembershipApplicationDto> SubmitApplicationAsync(CreateMembershipApplicationDto dto)
    {
        var app = new MembershipApplication
        {
            FullNameEnglish = dto.FullNameEnglish.Trim(),
            FullNameMarathi = dto.FullNameMarathi.Trim(),
            MobileNumber = dto.MobileNumber.Trim(),
            Email = dto.Email?.Trim(),
            District = dto.District.Trim(),
            Taluka = dto.Taluka?.Trim(),
            VillageOrCity = dto.VillageOrCity?.Trim(),
            PhotoUrl = dto.PhotoUrl?.Trim(),
            Occupation = dto.Occupation?.Trim(),
            Message = dto.Message?.Trim(),
            Status = "Pending",
            AppliedAt = DateTime.UtcNow
        };

        await _context.MembershipApplications.AddAsync(app);
        await _context.SaveChangesAsync();

        return MapToDto(app);
    }

    public async Task<List<MembershipApplicationDto>> GetAllApplicationsAsync(string? status = null)
    {
        var query = _context.MembershipApplications.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(a => a.Status.ToLower() == status.Trim().ToLower());
        }

        var list = await query
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return list.Select(MapToDto).ToList();
    }

    public async Task<MembershipApplicationDto?> GetApplicationByIdAsync(int id)
    {
        var app = await _context.MembershipApplications.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
        return app == null ? null : MapToDto(app);
    }

    public async Task<MemberDto?> ApproveApplicationAsync(int id, ApproveApplicationDto dto)
    {
        var app = await _context.MembershipApplications.FirstOrDefaultAsync(a => a.Id == id);
        if (app == null) return null;

        var designation = await _context.Designations.FindAsync(dto.DesignationId);
        if (designation == null)
        {
            throw new ArgumentException($"Designation with ID {dto.DesignationId} does not exist.");
        }

        // Create Member in Members Table
        var member = new Member
        {
            FullNameEnglish = app.FullNameEnglish,
            FullNameMarathi = app.FullNameMarathi,
            DesignationId = dto.DesignationId,
            MobileNumber = app.MobileNumber,
            Email = app.Email,
            District = app.District,
            Taluka = app.Taluka,
            VillageOrCity = app.VillageOrCity,
            PhotoUrl = app.PhotoUrl,
            DisplayOrder = dto.DisplayOrder > 0 ? dto.DisplayOrder : 50,
            IsCoreLeader = dto.IsCoreLeader,
            IsActive = true,
            JoinedDate = DateTime.UtcNow
        };

        await _context.Members.AddAsync(member);
        await _context.SaveChangesAsync();

        // Mark Application as Approved
        app.Status = "Approved";
        app.ReviewedAt = DateTime.UtcNow;
        app.ApprovedMemberId = member.Id;
        await _context.SaveChangesAsync();

        return new MemberDto
        {
            Id = member.Id,
            FullNameEnglish = member.FullNameEnglish,
            FullNameMarathi = member.FullNameMarathi,
            DesignationId = member.DesignationId,
            DesignationEnglish = designation.NameEnglish,
            DesignationMarathi = designation.NameMarathi,
            MobileNumber = member.MobileNumber,
            Email = member.Email,
            District = member.District,
            Taluka = member.Taluka,
            VillageOrCity = member.VillageOrCity,
            PhotoUrl = member.PhotoUrl,
            DisplayOrder = member.DisplayOrder,
            IsCoreLeader = member.IsCoreLeader,
            JoinedDate = member.JoinedDate
        };
    }

    public async Task<bool> RejectApplicationAsync(int id)
    {
        var app = await _context.MembershipApplications.FirstOrDefaultAsync(a => a.Id == id);
        if (app == null) return false;

        app.Status = "Rejected";
        app.ReviewedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteApplicationAsync(int id)
    {
        var app = await _context.MembershipApplications.FindAsync(id);
        if (app == null) return false;

        _context.MembershipApplications.Remove(app);
        await _context.SaveChangesAsync();
        return true;
    }

    private static MembershipApplicationDto MapToDto(MembershipApplication a) => new()
    {
        Id = a.Id,
        FullNameEnglish = a.FullNameEnglish,
        FullNameMarathi = a.FullNameMarathi,
        MobileNumber = a.MobileNumber,
        Email = a.Email,
        District = a.District,
        Taluka = a.Taluka,
        VillageOrCity = a.VillageOrCity,
        PhotoUrl = a.PhotoUrl,
        Occupation = a.Occupation,
        Message = a.Message,
        Status = a.Status,
        AppliedAt = a.AppliedAt,
        ReviewedAt = a.ReviewedAt,
        ApprovedMemberId = a.ApprovedMemberId
    };
}
