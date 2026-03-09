using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IUserRepository
    {
        Task<User?> CreateUser(User user);

        Task<User?> GetUser(int id);

        Task<User?> GetUserByEmail(string email);

        Task<User?> GetUserByResetToken(string token);

        Task<User?> UpdateUser(User user);

        Task<User?> ChangeUserPassword(string email, string newPasswordHash);

        Task<User?> DeleteUser(string email);

        Task<Entity.Claim?> GetClaims(string email);

        Task<HttpStatusCode> UserLogin(User user);
    }
}