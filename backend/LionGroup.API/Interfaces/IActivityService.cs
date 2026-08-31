using LionGroup.API.DTOs.Activities;

namespace LionGroup.API.Interfaces;

public interface IActivityService
{
    Task<List<ActivityDto>> GetActivitiesAsync(string? category = null, string? district = null, string? search = null);
    Task<ActivityDto?> GetActivityByIdAsync(int id);
    Task<List<ActivityDto>> GetFeaturedActivitiesAsync(int count = 3);

    // Admin CRUD
    Task<ActivityDto> CreateActivityAsync(CreateActivityDto dto);
    Task<ActivityDto?> UpdateActivityAsync(int id, UpdateActivityDto dto);
    Task<bool> DeleteActivityAsync(int id);
}
