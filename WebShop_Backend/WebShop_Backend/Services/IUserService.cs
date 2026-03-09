using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Services
{
    public interface IUserService
    {
        Task<UserDto> RegisterAsync(RegisterUserDto input, CancellationToken ct = default);

        Task ChangePasswordAsync(string email, string oldPassword, string newPassword, CancellationToken ct = default);

        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);

        Task<bool> VerifyEmailAsync(string token, CancellationToken ct = default);

        Task GeneratePasswordResetAsync(User user, CancellationToken ct);
    }
}