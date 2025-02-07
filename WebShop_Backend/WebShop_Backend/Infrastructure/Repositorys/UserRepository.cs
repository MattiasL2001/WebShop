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

            user.Role = UserRole.Member;
            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<HttpStatusCode> UserLogin(User user)
        {

            var validUser = await _dbContext.Users.Where(dbUser => dbUser.Email == user.Email).FirstOrDefaultAsync();

            if (validUser == null)
            {
                return HttpStatusCode.NotFound;
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

        public async Task<User> GetUserByEmail(string email)
        {

            var user = _dbContext.Users.Where(u => u.Email == email).FirstOrDefault();

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<Entity.Claim> GetClaims(string email)
        {

            User user = await GetUserByEmail(email);

            if (user == null) 
            {
                return null;
            }

            Claim claim = new Claim { name=user.FirstName, email=user.Email, birthDate=user.BirthDate, role=user.Role };

            return claim;

        }

        public async Task<User> ChangeUserPassword(string email, string newPasswordHash)
        {
            User user = await GetUserByEmail(email);

            if (user == null)
            {
                return null;
            }

            user.Password = newPasswordHash;
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> DeleteUser(string email)
        {
            User user = await GetUserByEmail(email);

            if (user == null)
            {
                return null;
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

    }
}