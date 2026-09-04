using LionGroup.API.DTOs.Donations;

namespace LionGroup.API.Interfaces;

public interface IDonationService
{
    // Public Campaigns
    Task<List<CampaignDto>> GetActiveCampaignsAsync();
    Task<CampaignDto?> GetCampaignByIdAsync(int id);
    Task<List<DonationDto>> GetRecentPublicDonorsAsync(int count = 50);

    // Public Donation Submission & Receipt
    Task<DonationDto> SubmitDonationAsync(CreateDonationDto dto);
    Task<DonationDto?> GetReceiptAsync(string receiptNumber);

    // Admin Campaigns CRUD
    Task<List<CampaignDto>> GetAllCampaignsAsync();
    Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto);
    Task<CampaignDto?> UpdateCampaignAsync(int id, CreateCampaignDto dto);
    Task<bool> DeleteCampaignAsync(int id);

    // Admin Donations Ledger
    Task<List<DonationDto>> GetDonationsAsync(string? status = null, int? campaignId = null, string? search = null);
    Task<DonationDto?> VerifyDonationAsync(int id, VerifyDonationDto dto);
    Task<DonationStatsDto> GetStatsAsync();
}
