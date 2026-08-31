using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Events;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

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
        var query = _context.Events.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(e => e.Status.ToLower() == status.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(e => e.District.ToLower() == district.ToLower());
        }

        var events = await query
            .OrderByDescending(e => e.StartDateTime)
            .ToListAsync();

        return events.Select(MapToDto).ToList();
    }

    public async Task<EventDto?> GetEventByIdAsync(int id)
    {
        var ev = await _context.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        return ev == null ? null : MapToDto(ev);
    }

    public async Task<List<EventDto>> GetUpcomingEventsAsync(int count = 3)
    {
        var events = await _context.Events
            .AsNoTracking()
            .Where(e => e.Status == "Upcoming" || e.StartDateTime >= DateTime.UtcNow)
            .OrderBy(e => e.StartDateTime)
            .Take(count)
            .ToListAsync();

        return events.Select(MapToDto).ToList();
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto dto)
    {
        var ev = new Event
        {
            TitleEnglish = dto.TitleEnglish.Trim(),
            TitleMarathi = dto.TitleMarathi.Trim(),
            DescriptionEnglish = dto.DescriptionEnglish.Trim(),
            DescriptionMarathi = dto.DescriptionMarathi.Trim(),
            Venue = dto.Venue.Trim(),
            District = dto.District.Trim(),
            StartDateTime = dto.StartDateTime,
            EndDateTime = dto.EndDateTime,
            ChiefGuests = dto.ChiefGuests?.Trim(),
            BannerImageUrl = dto.BannerImageUrl,
            Status = dto.Status.Trim(),
            IsFeatured = dto.IsFeatured,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Events.AddAsync(ev);
        await _context.SaveChangesAsync();
        return MapToDto(ev);
    }

    public async Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return null;

        ev.TitleEnglish = dto.TitleEnglish.Trim();
        ev.TitleMarathi = dto.TitleMarathi.Trim();
        ev.DescriptionEnglish = dto.DescriptionEnglish.Trim();
        ev.DescriptionMarathi = dto.DescriptionMarathi.Trim();
        ev.Venue = dto.Venue.Trim();
        ev.District = dto.District.Trim();
        ev.StartDateTime = dto.StartDateTime;
        ev.EndDateTime = dto.EndDateTime;
        ev.ChiefGuests = dto.ChiefGuests?.Trim();
        ev.BannerImageUrl = dto.BannerImageUrl;
        ev.Status = dto.Status.Trim();
        ev.IsFeatured = dto.IsFeatured;

        await _context.SaveChangesAsync();
        return MapToDto(ev);
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return true;
    }

    private static EventDto MapToDto(Event e) => new()
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
    };
}
