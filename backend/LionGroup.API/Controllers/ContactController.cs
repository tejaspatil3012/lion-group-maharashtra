using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> GetContactInfo()
    {
        var info = await _contactService.GetContactInfoAsync();
        return Ok(info);
    }

    [HttpPost]
    public async Task<IActionResult> SubmitInquiry([FromBody] CreateInquiryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await _contactService.SubmitInquiryAsync(dto);
        return Ok(new { message = "Your message has been received successfully!" });
    }

    // Admin Inquiries Management
    [HttpGet("inquiries")]
    public async Task<IActionResult> GetAllInquiries()
    {
        var inquiries = await _contactService.GetAllInquiriesAsync();
        return Ok(inquiries);
    }

    [HttpDelete("inquiries/{id:int}")]
    public async Task<IActionResult> DeleteInquiry(int id)
    {
        var deleted = await _contactService.DeleteInquiryAsync(id);
        if (!deleted) return NotFound(new { message = $"Inquiry with ID {id} not found" });
        return Ok(new { message = "Inquiry deleted successfully" });
    }
}
