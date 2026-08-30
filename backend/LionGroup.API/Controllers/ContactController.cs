using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Common;
using LionGroup.API.DTOs.Contact;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ContactInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetContactInfo()
    {
        var info = await _contactService.GetContactInfoAsync();
        return Ok(ApiResponse<ContactInfoDto>.Ok(info, "Contact information retrieved successfully"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitInquiry([FromBody] CreateInquiryDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<bool>.Fail("Invalid form submission", errors));
        }

        await _contactService.SubmitInquiryAsync(dto);
        return Ok(ApiResponse<bool>.Ok(true, "Your message has been received. Thank you for reaching out to Lion Group Maharashtra Rajya!"));
    }
}
