using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Common;
using LionGroup.API.DTOs.Home;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly IHomeService _homeService;

    public HomeController(IHomeService homeService)
    {
        _homeService = homeService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<HomeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHomeData()
    {
        var data = await _homeService.GetHomeDataAsync();
        return Ok(ApiResponse<HomeDto>.Ok(data, "Home data retrieved successfully"));
    }
}
