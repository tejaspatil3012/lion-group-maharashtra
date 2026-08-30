using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> GetHome()
    {
        var data = await _homeService.GetHomeDataAsync();
        return Ok(data);
    }
}
