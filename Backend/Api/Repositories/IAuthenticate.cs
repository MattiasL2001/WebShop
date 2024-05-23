using Api.Models;

namespace Api.Repositories
{
    public interface IAuthenticate
    {
        Task<User> Register(string username, string password);
        public string HashPassword(string password);
        Task<bool> IsUserNameTaken(string username);
        Task<User> ValidateCredentials(string username, string password);
        Task Logout();
        Task<User> DeleteAccount(User user);
    }
}
