using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IAuthenticationRepository
    {
        public Task<User> AuthenticateUser(string authorizationHeader);
    }
}
