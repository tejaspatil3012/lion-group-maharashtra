using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Activities;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities(string? category, string? district, string? search)
    {
        var activities = await _activityService.GetActivitiesAsync(category, district, search);
        return Ok(activities);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured(int count = 3)
    {
        var featured = await _activityService.GetFeaturedActivitiesAsync(count);
        return Ok(featured);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetActivityById(int id)
    {
        var activity = await _activityService.GetActivityByIdAsync(id);
        if (activity == null)
        {
            return NotFound(new { message = $"Activity with ID {id} not found" });
        }
        return Ok(activity);
    }

    // Admin CRUD Endpoints
    [HttpPost]
    public async Task<IActionResult> CreateActivity([FromBody] CreateActivityDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _activityService.CreateActivityAsync(dto);
        return CreatedAtAction(nameof(GetActivityById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateActivity(int id, [FromBody] UpdateActivityDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _activityService.UpdateActivityAsync(id, dto);
        if (updated == null) return NotFound(new { message = $"Activity with ID {id} not found" });
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteActivity(int id)
    {
        var deleted = await _activityService.DeleteActivityAsync(id);
        if (!deleted) return NotFound(new { message = $"Activity with ID {id} not found" });
        return Ok(new { message = "Activity deleted successfully" });
    }
}
