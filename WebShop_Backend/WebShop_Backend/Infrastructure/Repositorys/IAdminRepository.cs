using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IAdminRepository
    {
        Task<User> CreateUser(User user);
        Task<List<User>> GetUsers();
        Task<User> GetUser(int id);
        Task<User> EditUser(int id);
        Task<User> ChangeUserPassword(string email, string newPasswordHash);
        Task<User> DeleteUser(int id);
        Task<User> GetUserByEmail(string email);
        Task<Entity.Claim> GetClaims(string email);
        Task<Product> CreateProduct(Product product);
        Task<List<Product>> GetProducts();
        Task<Product> GetProduct(int id);
        Task<Product> EditProduct(int id);
        Task<Product> DeleteProduct(int id);
    }
}
