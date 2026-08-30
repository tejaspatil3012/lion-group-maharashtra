using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Events;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Services;

public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;

    public EventService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventDto>> GetEventsAsync(string? status = null, string? district = null)
    {
        var query = _context.Events.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            query = query.Where(e => e.Status.ToLower() == status.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(e => e.District.ToLower() == district.ToLower());
        }

        return await query
            .OrderByDescending(e => e.StartDateTime)
            .Select(e => new EventDto
            {
                Id = e.Id,
                TitleEnglish = e.TitleEnglish,
                TitleMarathi = e.TitleMarathi,
                DescriptionEnglish = e.DescriptionEnglish,
                DescriptionMarathi = e.DescriptionMarathi,
                Venue = e.Venue,
                District = e.District,
                StartDateTime = e.StartDateTime,
                EndDateTime = e.EndDateTime,
                ChiefGuests = e.ChiefGuests,
                BannerImageUrl = e.BannerImageUrl,
                Status = e.Status,
                IsFeatured = e.IsFeatured
            })
            .ToListAsync();
    }

    public async Task<EventDto?> GetEventByIdAsync(int id)
    {
        return await _context.Events
            .Where(e => e.Id == id)
            .AsNoTracking()
            .Select(e => new EventDto
            {
                Id = e.Id,
                TitleEnglish = e.TitleEnglish,
                TitleMarathi = e.TitleMarathi,
                DescriptionEnglish = e.DescriptionEnglish,
                DescriptionMarathi = e.DescriptionMarathi,
                Venue = e.Venue,
                District = e.District,
                StartDateTime = e.StartDateTime,
                EndDateTime = e.EndDateTime,
                ChiefGuests = e.ChiefGuests,
                BannerImageUrl = e.BannerImageUrl,
                Status = e.Status,
                IsFeatured = e.IsFeatured
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<EventDto>> GetUpcomingEventsAsync(int count = 3)
    {
        return await _context.Events
            .Where(e => e.Status == "Upcoming" || e.StartDateTime >= DateTime.UtcNow)
            .OrderBy(e => e.StartDateTime)
            .Take(count)
            .AsNoTracking()
            .Select(e => new EventDto
            {
                Id = e.Id,
                TitleEnglish = e.TitleEnglish,
                TitleMarathi = e.TitleMarathi,
                DescriptionEnglish = e.DescriptionEnglish,
                DescriptionMarathi = e.DescriptionMarathi,
                Venue = e.Venue,
                District = e.District,
                StartDateTime = e.StartDateTime,
                EndDateTime = e.EndDateTime,
                ChiefGuests = e.ChiefGuests,
                BannerImageUrl = e.BannerImageUrl,
                Status = e.Status,
                IsFeatured = e.IsFeatured
            })
            .ToListAsync();
    }
}
