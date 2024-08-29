using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class UserRepository : IUserRepository
    {
        private readonly WebShopContext _dbContext;

        public UserRepository(WebShopContext context)
        {
            _dbContext = context;
        }

        public async Task<User> GetUser(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> IsEmailTaken(string email)
        {
            return await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User> CreateUser(User user)
        {
            if (await IsEmailTaken(user.Email))
            {
                return null;
            }

            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task ChangeUserPassword(string email, string newPassword)
        {
            var user = await GetUser(email);
            if (user != null)
            {
                user.Password = newPassword;
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<bool> DeleteUser(string email)
        {
            var user = await GetUser(email);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
