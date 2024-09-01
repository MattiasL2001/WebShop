using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IUserRepository
    {
        Task<User> CreateUser(User user);
        Task<User> GetUser(int id);
        Task ChangeUserPassword(string email, string newPasswordHash);
        Task<bool> DeleteUser(string email);
        Task<User> GetUserByEmail(string email);
        public Task<HttpStatusCode> UserLogin(User user);
    }
}
