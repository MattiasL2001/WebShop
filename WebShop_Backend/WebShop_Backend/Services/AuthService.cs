using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Services;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Application.Services
{
    public sealed class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasherService _passwords;
        private readonly IJwtTokenService _jwt;

        public AuthService(IUserRepository users, IPasswordHasherService passwords, IJwtTokenService jwt)
        {
            _users = users;
            _passwords = passwords;
            _jwt = jwt;
        }

        public async Task<TokenDto> LoginBasicAsync(string email, string password, TimeSpan? lifetime = null)
        {
            var cleanedEmail = email?.Trim() ?? string.Empty;

            var user = await _users.GetUserByEmail(cleanedEmail);
            if (user is null)
                throw new UnauthorizedAccessException("Invalid credentials.");

            if (string.IsNullOrWhiteSpace(user.Password) ||
                !_passwords.VerifyPassword(user.Password!, password))
                throw new UnauthorizedAccessException("Invalid credentials.");

            var claim = new Claim
            {
                name = user.FirstName,
                email = user.Email,
                birthDate = user.BirthDate,
                role = user.Role
            };

            var ttl = lifetime ?? TimeSpan.FromHours(24);
            var token = _jwt.CreateToken(claim, ttl);

            return new TokenDto(token, "Bearer", (int)ttl.TotalSeconds);
        }
    }
}
