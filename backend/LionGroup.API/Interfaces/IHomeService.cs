using LionGroup.API.DTOs.Home;

namespace LionGroup.API.Interfaces;

public interface IHomeService
{
    Task<HomeDto> GetHomeDataAsync();
}
