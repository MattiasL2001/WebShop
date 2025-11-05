using Microsoft.EntityFrameworkCore;
using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class AdminRepository : IAdminRepository
    {
        private readonly WebShopContext _dbContext;

        public AdminRepository(WebShopContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> CreateUser(User user)
        {
            if (_dbContext.Users.Any(u => u.Email == user.Email))
            {
                return null;
            }

            user.Role = UserRole.Member;
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<List<User>> GetUsers()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User> GetUser(int id)
        {
            return await _dbContext.Users.FindAsync(id);
        }
        public async Task<User> EditUser(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null)
                return null;

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> ChangeUserPassword(string email, string newPasswordHash)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return null;

            user.Password = newPasswordHash;
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> DeleteUser(int id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return null;

            var orders = await _dbContext.Orders
                .Where(o => o.Email == user.Email)
                .ToListAsync();

            _dbContext.Orders.RemoveRange(orders);

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Entity.Claim> GetClaims(string email)
        {
            var user = await GetUserByEmail(email);
            if (user == null)
                return null;

            return new Claim
            {
                name = user.FirstName,
                email = user.Email,
                birthDate = user.BirthDate,
                role = user.Role
            };
        }

        public async Task<Product> CreateProduct(Product product)
        {
            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            return product;
        }

        public async Task<List<Product>> GetProducts()
        {
            return await _dbContext.Products.ToListAsync();
        }

        public async Task<Product> GetProduct(int id)
        {
            return await _dbContext.Products.FindAsync(id);
        }

        public async Task<Product> EditProduct(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null)
                return null;

            _dbContext.Products.Update(product);
            await _dbContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product> DeleteProduct(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null)
                return null;

            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();
            return product;
        }
    }
}
