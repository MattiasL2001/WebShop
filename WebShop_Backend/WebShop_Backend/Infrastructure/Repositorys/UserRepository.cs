using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class UserRepository : IUserRepository
    {

        private WebShopContext _dbContext;

        public UserRepository(WebShopContext context)
        {
            _dbContext = context;
        }

        public async Task<User> CreateUser(User user)
        {

            if (_dbContext.Users.Any(dbUser => dbUser.Email == user.Email))
            {
                return null;
            }

            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<HttpStatusCode> UserLogin(User user)
        {

            var validUser = await _dbContext.Users.Where(dbUser =>dbUser.Email == user.Email).FirstOrDefaultAsync();

            if (validUser == null)
            {
                return HttpStatusCode.NotFound;
            }

            if (validUser.Email == user.Email && validUser.Password != user.Password)
            {
                return HttpStatusCode.Unauthorized;
            }

            return HttpStatusCode.OK;
        }

        public async Task<User> GetUser(int id)
        {

            var user = await _dbContext.Users.FindAsync(id);

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<List<int>> GetBasket(int userId)
        {
            var validUser = await _dbContext.Users.FindAsync(userId);

            if (validUser == null)
            {
                return null;
            }

            return validUser.Basket;

        }

        public async Task<HashSet<int>> AddToBasket(int userId, int productId)
        {
            var validUser = await _dbContext.Users.FindAsync(userId);
            var validProduct = await _dbContext.Products.FindAsync(productId);

            if (validUser == null || validProduct == null)
            {
                return null;
            }

            validUser.Basket.Add(validProduct.Id);

            _dbContext.Update(validUser);
            _dbContext.SaveChanges();

            return validUser.Basket.ToHashSet();

        }

        public async Task<bool> RemoveFromBasket(int userId, int productId)
        {
            var validUser = await _dbContext.Users.FindAsync(userId);
            var validProduct = await _dbContext.Products.FindAsync(productId);

            if (validUser == null || validProduct == null)
            {
                return false;
            }

            validUser.Basket.Remove(validProduct.Id);

            _dbContext.SaveChanges();

            return true;

        }


    }
}
