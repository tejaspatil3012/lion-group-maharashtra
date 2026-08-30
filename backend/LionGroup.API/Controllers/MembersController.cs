using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Common;
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
    [ProducesResponseType(typeof(ApiResponse<List<MemberDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMembers([FromQuery] string? district, [FromQuery] int? designationId, [FromQuery] bool? isCoreLeader)
    {
        var members = await _memberService.GetAllMembersAsync(district, designationId, isCoreLeader);
        return Ok(ApiResponse<List<MemberDto>>.Ok(members, "Members retrieved successfully"));
    }

    [HttpGet("leadership")]
    [ProducesResponseType(typeof(ApiResponse<List<MemberDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeadership()
    {
        var leaders = await _memberService.GetCoreLeadershipAsync();
        return Ok(ApiResponse<List<MemberDto>>.Ok(leaders, "Leadership committee retrieved successfully"));
    }

    [HttpGet("designations")]
    [ProducesResponseType(typeof(ApiResponse<List<DesignationDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDesignations()
    {
        var designations = await _memberService.GetAllDesignationsAsync();
        return Ok(ApiResponse<List<DesignationDto>>.Ok(designations, "Designations retrieved successfully"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<MemberDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<MemberDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMemberById(int id)
    {
        var member = await _memberService.GetMemberByIdAsync(id);
        if (member == null)
        {
            return NotFound(ApiResponse<MemberDto>.Fail($"Member with ID {id} not found"));
        }
        return Ok(ApiResponse<MemberDto>.Ok(member, "Member retrieved successfully"));
    }
}
