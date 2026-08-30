using Microsoft.AspNetCore.Mvc;
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
}
