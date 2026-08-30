using Microsoft.AspNetCore.Mvc;
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
}
