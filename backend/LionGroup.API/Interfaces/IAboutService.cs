using LionGroup.API.DTOs.About;

namespace LionGroup.API.Interfaces;

public interface IAboutService
{
    Task<AboutDto?> GetAboutDataAsync();
    Task<AboutDto> UpdateAboutDataAsync(UpdateAboutDto dto);
}
