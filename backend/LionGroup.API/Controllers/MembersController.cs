using Microsoft.AspNetCore.Mvc;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MembersController(IMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers(string? district, int? designationId, bool? isCoreLeader)
    {
        var members = await _memberService.GetAllMembersAsync(district, designationId, isCoreLeader);
        return Ok(members);
    }

    [HttpGet("leadership")]
    public async Task<IActionResult> GetLeadership()
    {
        var leaders = await _memberService.GetCoreLeadershipAsync();
        return Ok(leaders);
    }

    [HttpGet("designations")]
    public async Task<IActionResult> GetDesignations()
    {
        var designations = await _memberService.GetAllDesignationsAsync();
        return Ok(designations);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMemberById(int id)
    {
        var member = await _memberService.GetMemberByIdAsync(id);
        if (member == null)
        {
            return NotFound(new { message = $"Member with ID {id} not found" });
        }
        return Ok(member);
    }
}
