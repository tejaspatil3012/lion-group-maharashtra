using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using LionGroup.API.DTOs.Auth;

namespace LionGroup.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var configuredUsername = _configuration["Jwt:AdminUsername"] ?? "admin";
        var configuredPassword = _configuration["Jwt:AdminPassword"] ?? "password1221";

        var inputUsername = dto.Username.Trim();
        var inputPassword = dto.Password.Trim();

        // Accept configured credentials or fallback PIN "1221"
        bool isUsernameValid = string.Equals(inputUsername, configuredUsername, StringComparison.OrdinalIgnoreCase) ||
                               string.Equals(inputUsername, "admin", StringComparison.OrdinalIgnoreCase) ||
                               string.IsNullOrWhiteSpace(inputUsername);

        bool isPasswordValid = inputPassword == configuredPassword || inputPassword == "1221";

        if (!isUsernameValid || !isPasswordValid)
        {
            _logger.LogWarning("Failed login attempt for username: {Username}", inputUsername);
            return Unauthorized(new { message = "Invalid username or password (चुकीचे युजरनेम किंवा पासवर्ड)." });
        }

        var keyString = _configuration["Jwt:Key"] ?? "LionGroupMaharashtraSuperSecretKeyForAdminAuthJwtTokens2026!";
        var issuer = _configuration["Jwt:Issuer"] ?? "LionGroup.API";
        var audience = _configuration["Jwt:Audience"] ?? "LionGroup.Web";
        var durationDays = int.TryParse(_configuration["Jwt:DurationDays"], out var days) ? days : 7;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.UtcNow.AddDays(durationDays);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, inputUsername.Length > 0 ? inputUsername : configuredUsername),
            new Claim(ClaimTypes.Name, inputUsername.Length > 0 ? inputUsername : configuredUsername),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtString = tokenHandler.WriteToken(token);

        _logger.LogInformation("Admin logged in successfully: {Username}", inputUsername);

        return Ok(new LoginResponseDto
        {
            Success = true,
            Token = jwtString,
            Username = inputUsername.Length > 0 ? inputUsername : configuredUsername,
            Role = "Admin",
            ExpiresAt = expiresAt,
            Message = "Login successful. Welcome back, Admin!"
        });
    }

    [HttpGet("verify")]
    [Authorize]
    public IActionResult VerifyToken()
    {
        var username = User.Identity?.Name ?? "Admin";
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Admin";

        return Ok(new
        {
            isAuthenticated = true,
            username = username,
            role = role,
            message = "Token is valid and active."
        });
    }
}
