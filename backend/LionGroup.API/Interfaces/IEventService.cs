using LionGroup.API.DTOs.Events;

namespace LionGroup.API.Interfaces;

public interface IEventService
{
    Task<List<EventDto>> GetEventsAsync(string? status = null, string? district = null);
    Task<EventDto?> GetEventByIdAsync(int id);
    Task<List<EventDto>> GetUpcomingEventsAsync(int count = 3);

    // Admin CRUD
    Task<EventDto> CreateEventAsync(CreateEventDto dto);
    Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto);
    Task<bool> DeleteEventAsync(int id);
}
