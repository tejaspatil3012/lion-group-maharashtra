using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> GetAbout()
    {
        var data = await _aboutService.GetAboutDataAsync();
        return Ok(data);
    }
}
