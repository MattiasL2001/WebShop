using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly WebShopContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthenticationRepository(WebShopContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<User> AuthenticateUser(string email, string password)
        {
            var hashedPassword = HashPassword(password);
            var authUser = await _dbContext.Users
                .Where(user => user.Email.ToLower() == email.ToLower() && user.Password == hashedPassword)
                .FirstOrDefaultAsync();

            return authUser;
        }

        public string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }

        public string GenerateJwtToken(ClaimsPrincipal principal)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtBearer:SigningKey"]));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JwtBearer:Issuer"],
                audience: _configuration["JwtBearer:Audience"],
                claims: principal.Claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
