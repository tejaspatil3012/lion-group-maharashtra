using Microsoft.EntityFrameworkCore;
using LionGroup.API.Data;
using LionGroup.API.DTOs.Donations;
using LionGroup.API.Interfaces;
using LionGroup.API.Models;

namespace LionGroup.API.Services;

public class DonationService : IDonationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DonationService> _logger;

    public DonationService(ApplicationDbContext context, ILogger<DonationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<CampaignDto>> GetActiveCampaignsAsync()
    {
        var campaigns = await _context.DonationCampaigns
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.IsFeatured)
            .ThenByDescending(c => c.CreatedAt)
            .Include(c => c.Donations)
            .ToListAsync();

        return campaigns.Select(MapCampaignToDto).ToList();
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(int id)
    {
        var campaign = await _context.DonationCampaigns
            .AsNoTracking()
            .Include(c => c.Donations)
            .FirstOrDefaultAsync(c => c.Id == id);

        return campaign == null ? null : MapCampaignToDto(campaign);
    }

    public async Task<List<DonationDto>> GetRecentPublicDonorsAsync(int count = 50)
    {
        var donations = await _context.Donations
            .AsNoTracking()
            .Include(d => d.Campaign)
            .Where(d => d.PaymentStatus == "Approved")
            .OrderByDescending(d => d.DonatedAt)
            .Take(count)
            .ToListAsync();

        return donations.Select(d =>
        {
            var dto = MapDonationToDto(d);
            if (d.IsAnonymous)
            {
                dto.DonorName = "वेलविशर (Well-wisher)";
                dto.DonorMobile = "";
                dto.DonorEmail = "";
            }
            return dto;
        }).ToList();
    }

    public async Task<DonationDto> SubmitDonationAsync(CreateDonationDto dto)
    {
        var randomSuffix = Random.Shared.Next(1000, 9999);
        var receiptNumber = $"LGM-DON-{DateTime.UtcNow:yyyyMMdd}-{randomSuffix}";

        // Ensure receipt number uniqueness
        while (await _context.Donations.AnyAsync(d => d.ReceiptNumber == receiptNumber))
        {
            randomSuffix = Random.Shared.Next(1000, 9999);
            receiptNumber = $"LGM-DON-{DateTime.UtcNow:yyyyMMdd}-{randomSuffix}";
        }

        var isCash = string.Equals(dto.PaymentMethod, "Cash", StringComparison.OrdinalIgnoreCase);

        var donation = new Donation
        {
            CampaignId = dto.CampaignId,
            DonorName = dto.DonorName.Trim(),
            DonorMobile = dto.DonorMobile.Trim(),
            DonorEmail = dto.DonorEmail?.Trim() ?? string.Empty,
            DonorPanNumber = dto.DonorPanNumber?.Trim().ToUpper() ?? string.Empty,
            City = dto.City?.Trim() ?? string.Empty,
            Amount = dto.Amount,
            PaymentMethod = dto.PaymentMethod ?? "UPI",
            UtrNumber = dto.UtrNumber?.Trim() ?? string.Empty,
            PaymentStatus = isCash ? "Approved" : "Pending",
            ReceiptNumber = receiptNumber,
            IsAnonymous = dto.IsAnonymous,
            Notes = dto.Notes?.Trim() ?? string.Empty,
            DonatedAt = DateTime.UtcNow,
            VerifiedAt = isCash ? DateTime.UtcNow : null
        };

        _context.Donations.Add(donation);

        // If direct approved (like cash recorded by admin), update campaign raised amount immediately
        if (donation.PaymentStatus == "Approved" && donation.CampaignId.HasValue)
        {
            var campaign = await _context.DonationCampaigns.FindAsync(donation.CampaignId.Value);
            if (campaign != null)
            {
                campaign.RaisedAmount += donation.Amount;
            }
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("New donation submitted: {Receipt} for amount {Amount} by {Donor}", receiptNumber, donation.Amount, donation.DonorName);

        // Re-fetch with campaign navigation for proper DTO mapping
        if (donation.CampaignId.HasValue)
        {
            await _context.Entry(donation).Reference(d => d.Campaign).LoadAsync();
        }

        return MapDonationToDto(donation);
    }

    public async Task<DonationDto?> GetReceiptAsync(string receiptNumber)
    {
        var donation = await _context.Donations
            .AsNoTracking()
            .Include(d => d.Campaign)
            .FirstOrDefaultAsync(d => d.ReceiptNumber == receiptNumber);

        return donation == null ? null : MapDonationToDto(donation);
    }

    public async Task<List<CampaignDto>> GetAllCampaignsAsync()
    {
        var campaigns = await _context.DonationCampaigns
            .AsNoTracking()
            .Include(c => c.Donations)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return campaigns.Select(MapCampaignToDto).ToList();
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto)
    {
        var campaign = new DonationCampaign
        {
            TitleEnglish = dto.TitleEnglish.Trim(),
            TitleMarathi = dto.TitleMarathi.Trim(),
            SummaryEnglish = dto.SummaryEnglish?.Trim() ?? string.Empty,
            SummaryMarathi = dto.SummaryMarathi?.Trim() ?? string.Empty,
            DescriptionEnglish = dto.DescriptionEnglish.Trim(),
            DescriptionMarathi = dto.DescriptionMarathi.Trim(),
            TargetAmount = dto.TargetAmount,
            RaisedAmount = 0,
            BannerImageUrl = dto.BannerImageUrl?.Trim() ?? string.Empty,
            StartDate = DateTime.UtcNow,
            EndDate = dto.EndDate,
            IsActive = dto.IsActive,
            IsFeatured = dto.IsFeatured,
            CreatedAt = DateTime.UtcNow
        };

        _context.DonationCampaigns.Add(campaign);
        await _context.SaveChangesAsync();

        return MapCampaignToDto(campaign);
    }

    public async Task<CampaignDto?> UpdateCampaignAsync(int id, CreateCampaignDto dto)
    {
        var campaign = await _context.DonationCampaigns.FindAsync(id);
        if (campaign == null) return null;

        campaign.TitleEnglish = dto.TitleEnglish.Trim();
        campaign.TitleMarathi = dto.TitleMarathi.Trim();
        campaign.SummaryEnglish = dto.SummaryEnglish?.Trim() ?? string.Empty;
        campaign.SummaryMarathi = dto.SummaryMarathi?.Trim() ?? string.Empty;
        campaign.DescriptionEnglish = dto.DescriptionEnglish.Trim();
        campaign.DescriptionMarathi = dto.DescriptionMarathi.Trim();
        campaign.TargetAmount = dto.TargetAmount;
        campaign.BannerImageUrl = dto.BannerImageUrl?.Trim() ?? string.Empty;
        campaign.EndDate = dto.EndDate;
        campaign.IsActive = dto.IsActive;
        campaign.IsFeatured = dto.IsFeatured;

        await _context.SaveChangesAsync();
        await _context.Entry(campaign).Collection(c => c.Donations).LoadAsync();

        return MapCampaignToDto(campaign);
    }

    public async Task<bool> DeleteCampaignAsync(int id)
    {
        var campaign = await _context.DonationCampaigns.FindAsync(id);
        if (campaign == null) return false;

        _context.DonationCampaigns.Remove(campaign);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<DonationDto>> GetDonationsAsync(string? status = null, int? campaignId = null, string? search = null)
    {
        var query = _context.Donations
            .AsNoTracking()
            .Include(d => d.Campaign)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(d => d.PaymentStatus == status);
        }

        if (campaignId.HasValue)
        {
            query = query.Where(d => d.CampaignId == campaignId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(d =>
                (d.DonorName != null && d.DonorName.ToLower().Contains(s)) ||
                (d.DonorMobile != null && d.DonorMobile.Contains(s)) ||
                (d.UtrNumber != null && d.UtrNumber.ToLower().Contains(s)) ||
                (d.ReceiptNumber != null && d.ReceiptNumber.ToLower().Contains(s)));
        }

        var donations = await query.OrderByDescending(d => d.DonatedAt).ToListAsync();
        return donations.Select(MapDonationToDto).ToList();
    }

    public async Task<DonationDto?> VerifyDonationAsync(int id, VerifyDonationDto dto)
    {
        var donation = await _context.Donations.Include(d => d.Campaign).FirstOrDefaultAsync(d => d.Id == id);
        if (donation == null) return null;

        var previousStatus = donation.PaymentStatus;
        var newStatus = dto.Status.Trim(); // "Approved" or "Rejected"

        donation.PaymentStatus = newStatus;
        donation.VerifiedAt = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(dto.AdminNote))
        {
            donation.Notes = string.IsNullOrWhiteSpace(donation.Notes) ? dto.AdminNote : $"{donation.Notes} | {dto.AdminNote}";
        }

        // If newly approved, increment campaign raised amount
        if (previousStatus != "Approved" && newStatus == "Approved" && donation.Campaign != null)
        {
            donation.Campaign.RaisedAmount += donation.Amount;
        }
        // If previously approved but now rejected, decrement campaign raised amount
        else if (previousStatus == "Approved" && newStatus == "Rejected" && donation.Campaign != null)
        {
            donation.Campaign.RaisedAmount = Math.Max(0, donation.Campaign.RaisedAmount - donation.Amount);
        }

        await _context.SaveChangesAsync();
        return MapDonationToDto(donation);
    }

    public async Task<DonationStatsDto> GetStatsAsync()
    {
        var approvedDonations = await _context.Donations
            .AsNoTracking()
            .Where(d => d.PaymentStatus == "Approved")
            .ToListAsync();

        var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalRaised = approvedDonations.Sum(d => d.Amount);
        var thisMonthRaised = approvedDonations.Where(d => d.DonatedAt >= firstDayOfMonth).Sum(d => d.Amount);
        var totalDonorsCount = approvedDonations.Select(d => d.DonorMobile).Distinct().Count();
        var pendingVerificationsCount = await _context.Donations.CountAsync(d => d.PaymentStatus == "Pending");
        var activeCampaignsCount = await _context.DonationCampaigns.CountAsync(c => c.IsActive);

        return new DonationStatsDto
        {
            TotalRaised = totalRaised,
            ThisMonthRaised = thisMonthRaised,
            TotalDonorsCount = totalDonorsCount,
            PendingVerificationsCount = pendingVerificationsCount,
            ActiveCampaignsCount = activeCampaignsCount
        };
    }

    private static CampaignDto MapCampaignToDto(DonationCampaign c)
    {
        var progress = c.TargetAmount > 0
            ? Math.Min(100.0, Math.Round((double)(c.RaisedAmount / c.TargetAmount) * 100, 1))
            : 0;

        return new CampaignDto
        {
            Id = c.Id,
            TitleEnglish = c.TitleEnglish,
            TitleMarathi = c.TitleMarathi,
            SummaryEnglish = c.SummaryEnglish,
            SummaryMarathi = c.SummaryMarathi,
            DescriptionEnglish = c.DescriptionEnglish,
            DescriptionMarathi = c.DescriptionMarathi,
            TargetAmount = c.TargetAmount,
            RaisedAmount = c.RaisedAmount,
            ProgressPercentage = progress,
            BannerImageUrl = c.BannerImageUrl,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive,
            IsFeatured = c.IsFeatured,
            DonorsCount = c.Donations?.Count(d => d.PaymentStatus == "Approved") ?? 0
        };
    }

    private static DonationDto MapDonationToDto(Donation d)
    {
        return new DonationDto
        {
            Id = d.Id,
            CampaignId = d.CampaignId,
            CampaignTitleEnglish = d.Campaign?.TitleEnglish,
            CampaignTitleMarathi = d.Campaign?.TitleMarathi,
            DonorName = d.DonorName,
            DonorMobile = d.DonorMobile,
            DonorEmail = d.DonorEmail,
            DonorPanNumber = d.DonorPanNumber,
            City = d.City,
            Amount = d.Amount,
            PaymentMethod = d.PaymentMethod,
            UtrNumber = d.UtrNumber,
            PaymentStatus = d.PaymentStatus,
            ReceiptNumber = d.ReceiptNumber,
            IsAnonymous = d.IsAnonymous,
            Notes = d.Notes,
            DonatedAt = d.DonatedAt,
            VerifiedAt = d.VerifiedAt
        };
    }
}
