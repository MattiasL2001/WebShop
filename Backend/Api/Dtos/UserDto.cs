using Api.Models;

namespace Api.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<Todo> Todos { get; set; } = new List<Todo>();

        public UserDto(int id, string username, List<Todo> todos)
        {
            Id = id;
            Username = username;
            Todos = todos;
        }
    }
}
