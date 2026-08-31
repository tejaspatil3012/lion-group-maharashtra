using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Members;
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

    // Admin CRUD Endpoints
    [HttpPost]
    public async Task<IActionResult> CreateMember([FromBody] CreateMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _memberService.CreateMemberAsync(dto);
        return CreatedAtAction(nameof(GetMemberById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateMember(int id, [FromBody] UpdateMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _memberService.UpdateMemberAsync(id, dto);
        if (updated == null) return NotFound(new { message = $"Member with ID {id} not found" });
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMember(int id)
    {
        var deleted = await _memberService.DeleteMemberAsync(id);
        if (!deleted) return NotFound(new { message = $"Member with ID {id} not found" });
        return Ok(new { message = "Member deleted successfully" });
    }

    [HttpPost("designations")]
    public async Task<IActionResult> CreateDesignation([FromBody] CreateDesignationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _memberService.CreateDesignationAsync(dto);
        return Ok(created);
    }
}
