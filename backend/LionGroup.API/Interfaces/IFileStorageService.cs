namespace LionGroup.API.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string subFolder);
    void DeleteFile(string relativeFilePath);
}
