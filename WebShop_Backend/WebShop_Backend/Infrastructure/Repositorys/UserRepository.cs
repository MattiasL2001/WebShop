using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class UserRepository : IUserRepository
    {
        private readonly WebShopContext _dbContext;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(WebShopContext context, ILogger<UserRepository> logger)
        {
            _dbContext = context;
            _logger = logger;
        }

        public async Task<User?> CreateUser(User user)
        {
            _logger.LogInformation("[DEBUG] Trying to create user: {Email}", user.Email);

            var exists = await _dbContext.Users
                .AnyAsync(dbUser => dbUser.Email == user.Email);

            if (exists)
            {
                _logger.LogWarning("[DEBUG] Duplicate email detected: {Email}", user.Email);
                return null;
            }

            user.Role = UserRole.Member;

            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("[DEBUG] User created successfully: {Email}", user.Email);
            return user;
        }

        public async Task<HttpStatusCode> UserLogin(User user)
        {
            _logger.LogInformation("[DEBUG] Login attempt for {Email}", user.Email);

            var validUser = await _dbContext.Users
                .FirstOrDefaultAsync(dbUser => dbUser.Email == user.Email);

            if (validUser == null)
            {
                _logger.LogWarning("[DEBUG] No user found for {Email}", user.Email);
                return HttpStatusCode.NotFound;
            }

            _logger.LogInformation("[DEBUG] User found for {Email}", user.Email);
            return HttpStatusCode.OK;
        }

        public async Task<User?> GetUser(int id)
        {
            _logger.LogInformation("[DEBUG] Fetching user by id {Id}", id);
            var user = await _dbContext.Users.FindAsync(id);

            if (user == null)
                _logger.LogWarning("[DEBUG] No user found with id {Id}", id);
            else
                _logger.LogInformation("[DEBUG] Found user {Email}", user.Email);

            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            _logger.LogInformation("[DEBUG] Fetching user by email '{Email}'", email);
            var found = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (found == null)
                _logger.LogWarning("[DEBUG] ❌ No match found for '{Email}'", email);
            else
                _logger.LogInformation("[DEBUG] ✅ Match found: '{Email}'", found.Email);

            return found;
        }

        public async Task<Entity.Claim?> GetClaims(string email)
        {
            _logger.LogInformation("[DEBUG] Getting claims for {Email}", email);
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                _logger.LogWarning("[DEBUG] No user found when retrieving claims for {Email}", email);
                return null;
            }

            var claim = new Claim
            {
                name = user.FirstName,
                email = user.Email,
                birthDate = user.BirthDate,
                role = user.Role
            };

            _logger.LogInformation("[DEBUG] Claims generated for {Email}", email);
            return claim;
        }

        public async Task<User?> ChangeUserPassword(string email, string newPasswordHash)
        {
            _logger.LogInformation("[DEBUG] Changing password for {Email}", email);
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                _logger.LogWarning("[DEBUG] Cannot change password, user not found: {Email}", email);
                return null;
            }

            user.Password = newPasswordHash;
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("[DEBUG] Password changed successfully for {Email}", email);
            return user;
        }

        public async Task<User?> DeleteUser(string email)
        {
            _logger.LogInformation("[DEBUG] Deleting user {Email}", email);
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                _logger.LogWarning("[DEBUG] Cannot delete, user not found: {Email}", email);
                return null;
            }

            var orders = await _dbContext.Orders
                .Where(o => o.Email == user.Email)
                .ToListAsync();

            _dbContext.Orders.RemoveRange(orders);

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("[DEBUG] User deleted successfully: {Email}", email);
            return user;
        }

    }
}
