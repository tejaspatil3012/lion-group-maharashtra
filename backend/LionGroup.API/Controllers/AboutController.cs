using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.About;
using LionGroup.API.DTOs.Common;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly IAboutService _aboutService;

    public AboutController(IAboutService aboutService)
    {
        _aboutService = aboutService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<AboutDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAboutData()
    {
        var data = await _aboutService.GetAboutDataAsync();
        return Ok(ApiResponse<AboutDto>.Ok(data, "About data retrieved successfully"));
    }
}
