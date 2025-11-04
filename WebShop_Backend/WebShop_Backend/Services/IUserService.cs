using WebShop_Backend.Dtos.User;

namespace WebShop_Backend.Services
{
    public interface IUserService
    {
        Task<UserDto> RegisterAsync(RegisterUserDto input, CancellationToken ct = default);
        Task ChangePasswordAsync(string email, string oldPassword, string newPassword, CancellationToken ct = default);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    }
}
