namespace LionGroup.API.DTOs.Events;

public class EventDto
{
    public int Id { get; set; }
    public string TitleEnglish { get; set; } = string.Empty;
    public string TitleMarathi { get; set; } = string.Empty;
    public string DescriptionEnglish { get; set; } = string.Empty;
    public string DescriptionMarathi { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime StartDateTime { get; set; }
    public DateTime? EndDateTime { get; set; }
    public string? ChiefGuests { get; set; }
    public string? BannerImageUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
}
