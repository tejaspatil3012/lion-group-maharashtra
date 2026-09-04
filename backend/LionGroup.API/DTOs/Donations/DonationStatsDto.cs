namespace LionGroup.API.DTOs.Donations;

public class DonationStatsDto
{
    public decimal TotalRaised { get; set; }
    public decimal ThisMonthRaised { get; set; }
    public int TotalDonorsCount { get; set; }
    public int PendingVerificationsCount { get; set; }
    public int ActiveCampaignsCount { get; set; }
}
