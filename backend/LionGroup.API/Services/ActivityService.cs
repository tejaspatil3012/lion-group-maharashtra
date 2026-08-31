using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Activities;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class ActivityService : IActivityService
{
    private readonly ApplicationDbContext _context;

    public ActivityService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ActivityDto>> GetActivitiesAsync(string? category = null, string? district = null, string? search = null)
    {
        var query = _context.Activities.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(a => a.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(a => a.District.ToLower() == district.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(a => a.TitleEnglish.ToLower().Contains(s) ||
                                     a.TitleMarathi.Contains(search) ||
                                     a.SummaryEnglish.ToLower().Contains(s) ||
                                     a.SummaryMarathi.Contains(search));
        }

        var activities = await query
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync();

        return activities.Select(MapToDto).ToList();
    }

    public async Task<ActivityDto?> GetActivityByIdAsync(int id)
    {
        var activity = await _context.Activities.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
        return activity == null ? null : MapToDto(activity);
    }

    public async Task<List<ActivityDto>> GetFeaturedActivitiesAsync(int count = 3)
    {
        var activities = await _context.Activities
            .AsNoTracking()
            .Where(a => a.IsFeatured)
            .OrderByDescending(a => a.ActivityDate)
            .Take(count)
            .ToListAsync();

        return activities.Select(MapToDto).ToList();
    }

    public async Task<ActivityDto> CreateActivityAsync(CreateActivityDto dto)
    {
        var activity = new Activity
        {
            TitleEnglish = dto.TitleEnglish.Trim(),
            TitleMarathi = dto.TitleMarathi.Trim(),
            Category = dto.Category.Trim(),
            SummaryEnglish = dto.SummaryEnglish.Trim(),
            SummaryMarathi = dto.SummaryMarathi.Trim(),
            DescriptionEnglish = dto.DescriptionEnglish.Trim(),
            DescriptionMarathi = dto.DescriptionMarathi.Trim(),
            Location = dto.Location.Trim(),
            District = dto.District.Trim(),
            ActivityDate = dto.ActivityDate,
            BannerImageUrl = dto.BannerImageUrl,
            BeneficiariesCount = dto.BeneficiariesCount,
            VolunteersCount = dto.VolunteersCount,
            IsFeatured = dto.IsFeatured,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Activities.AddAsync(activity);
        await _context.SaveChangesAsync();
        return MapToDto(activity);
    }

    public async Task<ActivityDto?> UpdateActivityAsync(int id, UpdateActivityDto dto)
    {
        var activity = await _context.Activities.FindAsync(id);
        if (activity == null) return null;

        activity.TitleEnglish = dto.TitleEnglish.Trim();
        activity.TitleMarathi = dto.TitleMarathi.Trim();
        activity.Category = dto.Category.Trim();
        activity.SummaryEnglish = dto.SummaryEnglish.Trim();
        activity.SummaryMarathi = dto.SummaryMarathi.Trim();
        activity.DescriptionEnglish = dto.DescriptionEnglish.Trim();
        activity.DescriptionMarathi = dto.DescriptionMarathi.Trim();
        activity.Location = dto.Location.Trim();
        activity.District = dto.District.Trim();
        activity.ActivityDate = dto.ActivityDate;
        activity.BannerImageUrl = dto.BannerImageUrl;
        activity.BeneficiariesCount = dto.BeneficiariesCount;
        activity.VolunteersCount = dto.VolunteersCount;
        activity.IsFeatured = dto.IsFeatured;

        await _context.SaveChangesAsync();
        return MapToDto(activity);
    }

    public async Task<bool> DeleteActivityAsync(int id)
    {
        var activity = await _context.Activities.FindAsync(id);
        if (activity == null) return false;

        _context.Activities.Remove(activity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ActivityDto MapToDto(Activity a) => new()
    {
        Id = a.Id,
        TitleEnglish = a.TitleEnglish,
        TitleMarathi = a.TitleMarathi,
        Category = a.Category,
        SummaryEnglish = a.SummaryEnglish,
        SummaryMarathi = a.SummaryMarathi,
        DescriptionEnglish = a.DescriptionEnglish,
        DescriptionMarathi = a.DescriptionMarathi,
        Location = a.Location,
        District = a.District,
        ActivityDate = a.ActivityDate,
        BannerImageUrl = a.BannerImageUrl,
        BeneficiariesCount = a.BeneficiariesCount,
        VolunteersCount = a.VolunteersCount,
        IsFeatured = a.IsFeatured
    };
}
