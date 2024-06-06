using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IUserRepository
    {
        public Task<User> CreateUser(User user);
        public Task<User> GetUser(int id);
        public Task<User> UserLogin(User user);
        public Task<List<int>> GetBasket(int userId);
        public Task<List<int>> AddToBasket(int userId, int productId);
        public Task<bool> RemoveFromBasket(int userId, int productId);


    }
}
