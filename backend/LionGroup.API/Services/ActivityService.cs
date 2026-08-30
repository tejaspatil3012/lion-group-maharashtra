using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Activities;
using LionGroup.API.Interfaces;

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
        var query = _context.Activities.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
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
                                     a.Location.ToLower().Contains(s) ||
                                     a.District.ToLower().Contains(s));
        }

        return await query
            .OrderByDescending(a => a.ActivityDate)
            .Select(a => new ActivityDto
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
            })
            .ToListAsync();
    }

    public async Task<ActivityDto?> GetActivityByIdAsync(int id)
    {
        return await _context.Activities
            .Where(a => a.Id == id)
            .AsNoTracking()
            .Select(a => new ActivityDto
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
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<ActivityDto>> GetFeaturedActivitiesAsync(int count = 3)
    {
        return await _context.Activities
            .Where(a => a.IsFeatured)
            .OrderByDescending(a => a.ActivityDate)
            .Take(count)
            .AsNoTracking()
            .Select(a => new ActivityDto
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
            })
            .ToListAsync();
    }
}
