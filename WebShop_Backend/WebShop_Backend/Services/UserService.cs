using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure;

namespace WebShop_Backend.Services
{
    public class UserService : IUserService
    {
        private readonly WebShopContext _db;
        private readonly IPasswordHasherService _hasher;

        public UserService(WebShopContext db, IPasswordHasherService hasher)
        {
            _db = db;
            _hasher = hasher;
        }

        public async Task<UserDto> RegisterAsync(RegisterUserDto input, CancellationToken ct = default)
        {
            var normalizedEmail = NormalizeEmail(input.Email);

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 5)
                throw new InvalidOperationException("Password must be at least 5 characters long.");

            var exists = await _db.Users.AnyAsync(u => u.Email == normalizedEmail, ct);
            if (exists)
                throw new InvalidOperationException("Email is already registered.");

            var user = new User
            {
                FirstName = input.Firstname?.Trim(),
                LastName = input.Lastname?.Trim(),
                Email = normalizedEmail,
                BirthDate = input.BirthDate,
                Role = UserRole.Member,
                Password = _hasher.HashPassword(input.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName!,
                LastName = user.LastName!,
                Email = user.Email!
            };
        }

        public async Task ChangePasswordAsync(string email, string oldPassword, string newPassword, CancellationToken ct = default)
        {
            var normalized = (email ?? string.Empty).Trim().ToLower();

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized, ct);

            if (user is null)
            {
                var all = await _db.Users.ToListAsync(ct);
                user = all.FirstOrDefault(u =>
                    !string.IsNullOrWhiteSpace(u.Email) &&
                    string.Equals(u.Email.Trim(), normalized, StringComparison.OrdinalIgnoreCase));
            }

            if (user is null)
                throw new KeyNotFoundException("User not found.");

            // *** VIKTIGT: slopa kravet på korrekt oldPassword för inloggad användare ***
            // Om du VILL behålla kravet ibland: lägg tillbaka verifieringen här.
            // if (string.IsNullOrWhiteSpace(user.Password) ||
            //     !_hasher.VerifyPassword(user.Password!, oldPassword))
            //     throw new UnauthorizedAccessException("Old password is incorrect.");

            user.Password = _hasher.HashPassword(newPassword);
            await _db.SaveChangesAsync(ct);
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
        {
            var normalizedEmail = NormalizeEmail(email);
            return await _db.Users.AnyAsync(u => u.Email == normalizedEmail, ct);
        }

        private static string NormalizeEmail(string? email)
            => (email ?? string.Empty).Trim().ToLower();
    }
}
