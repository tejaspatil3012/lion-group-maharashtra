using System.ComponentModel.DataAnnotations;

namespace LionGroup.API.DTOs.Auth;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public bool Success { get; set; } = true;
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin";
    public DateTime ExpiresAt { get; set; }
    public string Message { get; set; } = "Login successful";
}
