using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure;
using WebShop_Backend.Clients;
using WebShop_Backend.Infrastructure.Repositorys;

namespace WebShop_Backend.Services
{
    public class UserService : IUserService
    {
        private readonly WebShopContext _db;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasherService _hasher;
        private readonly MailClient _mailClient;
        private readonly ILogger<UserService> _logger;

        public UserService(
            WebShopContext db,
            IUserRepository userRepository,
            IPasswordHasherService hasher,
            MailClient mailClient,
            ILogger<UserService> logger)
        {
            _db = db;
            _userRepository = userRepository;
            _hasher = hasher;
            _mailClient = mailClient;
            _logger = logger;
        }

        public async Task<UserDto> RegisterAsync(RegisterUserDto input, CancellationToken ct = default)
        {
            var normalizedEmail = NormalizeEmail(input.Email);

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 5)
                throw new InvalidOperationException("Password must be at least 5 characters long.");

            var exists = await _db.Users.AnyAsync(u => u.Email == normalizedEmail, ct);
            if (exists)
                throw new InvalidOperationException("Email is already registered.");

            var token = Guid.NewGuid().ToString();

            var user = new User
            {
                FirstName = input.Firstname?.Trim(),
                LastName = input.Lastname?.Trim(),
                Email = normalizedEmail,
                BirthDate = input.BirthDate,
                Role = UserRole.Member,
                Password = _hasher.HashPassword(input.Password),

                EmailVerified = false,
                EmailVerificationToken = token,
                EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            var link = $"https://localhost:7180/api/user/verify-email?token={token}";

            try
            {
                await _mailClient.SendVerificationEmail(user.Email!, link);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email");
            }

            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName!,
                LastName = user.LastName!,
                Email = user.Email!
            };
        }

        public async Task<bool> VerifyEmailAsync(string token, CancellationToken ct = default)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.EmailVerificationToken == token, ct);

            if (user == null)
                return false;

            if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
                return false;

            user.EmailVerified = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;

            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task GeneratePasswordResetAsync(User user, CancellationToken ct)
        {
            if (user.LastPasswordResetRequest.HasValue &&
                user.LastPasswordResetRequest.Value > DateTime.UtcNow.AddMinutes(-1))
            {
                throw new InvalidOperationException("Password reset requested too recently.");
            }

            var token = Guid.NewGuid().ToString();

            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            user.LastPasswordResetRequest = DateTime.UtcNow;

            await _userRepository.UpdateUser(user);

            var link = $"http://localhost:3000/reset-password?token={token}";

            await _mailClient.SendPasswordResetEmail(user.Email, link);
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