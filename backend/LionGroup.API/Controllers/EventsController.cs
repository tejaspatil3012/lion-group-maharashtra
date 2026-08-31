using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Events;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents(string? status, string? district)
    {
        var events = await _eventService.GetEventsAsync(status, district);
        return Ok(events);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcoming(int count = 3)
    {
        var upcoming = await _eventService.GetUpcomingEventsAsync(count);
        return Ok(upcoming);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEventById(int id)
    {
        var ev = await _eventService.GetEventByIdAsync(id);
        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {id} not found" });
        }
        return Ok(ev);
    }

    // Admin CRUD Endpoints
    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _eventService.CreateEventAsync(dto);
        return CreatedAtAction(nameof(GetEventById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateEvent(int id, [FromBody] UpdateEventDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _eventService.UpdateEventAsync(id, dto);
        if (updated == null) return NotFound(new { message = $"Event with ID {id} not found" });
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var deleted = await _eventService.DeleteEventAsync(id);
        if (!deleted) return NotFound(new { message = $"Event with ID {id} not found" });
        return Ok(new { message = "Event deleted successfully" });
    }
}
