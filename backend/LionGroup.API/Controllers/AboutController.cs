using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.About;
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

    // Admin Update Endpoint
    [HttpPut]
    public async Task<IActionResult> UpdateAbout([FromBody] UpdateAboutDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _aboutService.UpdateAboutDataAsync(dto);
        return Ok(updated);
    }
}
