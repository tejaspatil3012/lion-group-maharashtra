using Microsoft.AspNetCore.Mvc;
using LionGroup.API.DTOs.Donations;
using LionGroup.API.Interfaces;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly IDonationService _donationService;

    public DonationsController(IDonationService donationService)
    {
        _donationService = donationService;
    }

    // --- Public Endpoints ---

    [HttpGet("campaigns")]
    public async Task<IActionResult> GetActiveCampaigns()
    {
        var campaigns = await _donationService.GetActiveCampaignsAsync();
        return Ok(campaigns);
    }

    [HttpGet("campaigns/{id:int}")]
    public async Task<IActionResult> GetCampaignById(int id)
    {
        var campaign = await _donationService.GetCampaignByIdAsync(id);
        if (campaign == null)
            return NotFound(new { message = $"Campaign with ID {id} not found." });

        return Ok(campaign);
    }

    [HttpGet("recent-donors")]
    public async Task<IActionResult> GetRecentDonors([FromQuery] int count = 50)
    {
        var donors = await _donationService.GetRecentPublicDonorsAsync(count);
        return Ok(donors);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitDonation([FromBody] CreateDonationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var donation = await _donationService.SubmitDonationAsync(dto);
        return CreatedAtAction(nameof(GetReceipt), new { receiptNumber = donation.ReceiptNumber }, donation);
    }

    [HttpGet("receipt/{receiptNumber}")]
    public async Task<IActionResult> GetReceipt(string receiptNumber)
    {
        var donation = await _donationService.GetReceiptAsync(receiptNumber);
        if (donation == null)
            return NotFound(new { message = $"Receipt with number {receiptNumber} not found." });

        return Ok(donation);
    }

    // --- Admin Endpoints ---

    [HttpGet("admin/campaigns")]
    public async Task<IActionResult> GetAllCampaigns()
    {
        var campaigns = await _donationService.GetAllCampaignsAsync();
        return Ok(campaigns);
    }

    [HttpPost("admin/campaigns")]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var campaign = await _donationService.CreateCampaignAsync(dto);
        return CreatedAtAction(nameof(GetCampaignById), new { id = campaign.Id }, campaign);
    }

    [HttpPut("admin/campaigns/{id:int}")]
    public async Task<IActionResult> UpdateCampaign(int id, [FromBody] CreateCampaignDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var campaign = await _donationService.UpdateCampaignAsync(id, dto);
        if (campaign == null)
            return NotFound(new { message = $"Campaign with ID {id} not found." });

        return Ok(campaign);
    }

    [HttpDelete("admin/campaigns/{id:int}")]
    public async Task<IActionResult> DeleteCampaign(int id)
    {
        var success = await _donationService.DeleteCampaignAsync(id);
        if (!success)
            return NotFound(new { message = $"Campaign with ID {id} not found." });

        return Ok(new { message = "Campaign deleted successfully." });
    }

    [HttpGet("admin/donations")]
    public async Task<IActionResult> GetDonations([FromQuery] string? status, [FromQuery] int? campaignId, [FromQuery] string? search)
    {
        var donations = await _donationService.GetDonationsAsync(status, campaignId, search);
        return Ok(donations);
    }

    [HttpPost("admin/donations/{id:int}/verify")]
    public async Task<IActionResult> VerifyDonation(int id, [FromBody] VerifyDonationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var donation = await _donationService.VerifyDonationAsync(id, dto);
        if (donation == null)
            return NotFound(new { message = $"Donation with ID {id} not found." });

        return Ok(donation);
    }

    [HttpGet("admin/stats")]
    public async Task<IActionResult> GetDonationStats()
    {
        var stats = await _donationService.GetStatsAsync();
        return Ok(stats);
    }
}
