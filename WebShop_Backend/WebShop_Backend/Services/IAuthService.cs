namespace WebShop_Backend.Services;

public interface IAuthService
{
    Task<TokenDto> LoginBasicAsync(string email, string password, TimeSpan? lifetime = null);
}

public sealed record TokenDto(string Token, string TokenType, int ExpiresInSeconds);
