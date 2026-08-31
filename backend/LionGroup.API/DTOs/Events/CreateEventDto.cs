using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Events;

public class CreateEventDto
{
    [Required]
    [MaxLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TitleMarathi { get; set; } = string.Empty;

    [Required]
    public string DescriptionEnglish { get; set; } = string.Empty;

    [Required]
    public string DescriptionMarathi { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Venue { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    public DateTime StartDateTime { get; set; } = DateTime.UtcNow;

    public DateTime? EndDateTime { get; set; }

    public string? ChiefGuests { get; set; }

    public string? BannerImageUrl { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "Upcoming"; // Upcoming, Completed, Postponed

    public bool IsFeatured { get; set; } = false;
}

public class UpdateEventDto : CreateEventDto
{
}
