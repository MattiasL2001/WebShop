using Api.Dtos;
using Api.Models;

namespace Api.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetUsers();
        Task<User> GetUser(int id);
        Task<User> GetUser(string username);
        Task<User> AddUser(string userName, string password);
        Task<User> ChangeUserPassword(string username, string newPassword);
        Task<List<Todo>> GetUserTodos(string username);
        Task<List<Todo>> AddTodo(Todo todo, int id);
        Task<Todo> GetTodo(int userId, int todoId);
        Task<Todo> UpdateTodo(TodoDto todoDto);
        Task<Todo> DeleteTodo(string username, int todoId);
    }
}
