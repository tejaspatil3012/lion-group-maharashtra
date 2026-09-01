using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Membership;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembershipApplicationsController : ControllerBase
{
    private readonly IMembershipApplicationService _service;

    public MembershipApplicationsController(IMembershipApplicationService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitApplication([FromBody] CreateMembershipApplicationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _service.SubmitApplicationAsync(dto);
        return CreatedAtAction(nameof(GetApplicationById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllApplications([FromQuery] string? status)
    {
        var list = await _service.GetAllApplicationsAsync(status);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetApplicationById(int id)
    {
        var item = await _service.GetApplicationByIdAsync(id);
        if (item == null) return NotFound(new { message = $"Application with ID {id} not found." });
        return Ok(item);
    }

    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> ApproveApplication(int id, [FromBody] ApproveApplicationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        try
        {
            var member = await _service.ApproveApplicationAsync(id, dto);
            if (member == null) return NotFound(new { message = $"Application with ID {id} not found." });
            return Ok(new { message = "Membership application approved successfully!", member });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:int}/reject")]
    public async Task<IActionResult> RejectApplication(int id)
    {
        var success = await _service.RejectApplicationAsync(id);
        if (!success) return NotFound(new { message = $"Application with ID {id} not found." });
        return Ok(new { message = "Membership application rejected." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteApplication(int id)
    {
        var deleted = await _service.DeleteApplicationAsync(id);
        if (!deleted) return NotFound(new { message = $"Application with ID {id} not found." });
        return Ok(new { message = "Application deleted successfully." });
    }
}
