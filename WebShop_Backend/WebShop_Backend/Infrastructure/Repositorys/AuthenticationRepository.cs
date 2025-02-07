using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Text;
using WebShop_Backend.Entity;
using WebShop_Backend.Services;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class AuthenticationRepository : IAuthenticationRepository
    {

        private readonly WebShopContext _dbContext;
        private readonly IPasswordHasherService _passwordHasherService;

        public AuthenticationRepository(WebShopContext dbContext, IPasswordHasherService passwordHasherService)
        {
            _dbContext = dbContext;
            _passwordHasherService = passwordHasherService;
        }

        public async Task<User> AuthenticateUser(string authorizationHeader)
        {
            var authBase64Decoded = Encoding.UTF8.GetString(Convert.FromBase64String(authorizationHeader.Replace("Basic ", "", StringComparison.OrdinalIgnoreCase)));

            var authSplit = authBase64Decoded.Split(new[] { ':' }, 2);

            if (authSplit.Length != 2)
            {
                return null;
            }

            var ClientId = authSplit[0];
            var ClientSecret = authSplit[1];

            var authUser = await _dbContext.Users.FirstOrDefaultAsync(user => user.Email == ClientId);

            if (authUser == null || !_passwordHasherService.VerifyPassword(authUser.Password, ClientSecret))
            {
                return null;
            }


            return authUser;

        }
    }
}