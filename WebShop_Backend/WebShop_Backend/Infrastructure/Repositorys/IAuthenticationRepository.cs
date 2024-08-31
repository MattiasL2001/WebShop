using System.Security.Claims;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IAuthenticationRepository
    {
        Task<User> AuthenticateUser(string email, string password);
        string HashPassword(string password);
        string GenerateJwtToken(ClaimsPrincipal principal);
    }
}
