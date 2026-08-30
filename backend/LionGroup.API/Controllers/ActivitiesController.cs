using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Activities;
using LionGroup.API.DTOs.Common;
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
    [ProducesResponseType(typeof(ApiResponse<List<ActivityDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivities([FromQuery] string? category, [FromQuery] string? district, [FromQuery] string? search)
    {
        var activities = await _activityService.GetActivitiesAsync(category, district, search);
        return Ok(ApiResponse<List<ActivityDto>>.Ok(activities, "Activities retrieved successfully"));
    }

    [HttpGet("featured")]
    [ProducesResponseType(typeof(ApiResponse<List<ActivityDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 3)
    {
        var featured = await _activityService.GetFeaturedActivitiesAsync(count);
        return Ok(ApiResponse<List<ActivityDto>>.Ok(featured, "Featured activities retrieved successfully"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ActivityDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ActivityDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetActivityById(int id)
    {
        var activity = await _activityService.GetActivityByIdAsync(id);
        if (activity == null)
        {
            return NotFound(ApiResponse<ActivityDto>.Fail($"Activity with ID {id} not found"));
        }
        return Ok(ApiResponse<ActivityDto>.Ok(activity, "Activity retrieved successfully"));
    }
}
