using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Common;
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
    [ProducesResponseType(typeof(ApiResponse<List<EventDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEvents([FromQuery] string? status, [FromQuery] string? district)
    {
        var events = await _eventService.GetEventsAsync(status, district);
        return Ok(ApiResponse<List<EventDto>>.Ok(events, "Events retrieved successfully"));
    }

    [HttpGet("upcoming")]
    [ProducesResponseType(typeof(ApiResponse<List<EventDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUpcoming([FromQuery] int count = 3)
    {
        var upcoming = await _eventService.GetUpcomingEventsAsync(count);
        return Ok(ApiResponse<List<EventDto>>.Ok(upcoming, "Upcoming events retrieved successfully"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<EventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<EventDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEventById(int id)
    {
        var ev = await _eventService.GetEventByIdAsync(id);
        if (ev == null)
        {
            return NotFound(ApiResponse<EventDto>.Fail($"Event with ID {id} not found"));
        }
        return Ok(ApiResponse<EventDto>.Ok(ev, "Event retrieved successfully"));
    }
}
