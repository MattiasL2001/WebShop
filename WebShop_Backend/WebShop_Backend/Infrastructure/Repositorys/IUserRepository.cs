using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IUserRepository
    {
        Task<User> CreateUser(User user);
        Task<User> GetUser(string email);
        Task ChangeUserPassword(string email, string newPasswordHash);
        Task<bool> DeleteUser(string email);
        Task<bool> IsEmailTaken(string username);
    }
}
