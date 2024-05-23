
namespace Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; }
        public List<Todo> Todos { get; set; } = new List<Todo>();


        public User() { }

        public User(int id, string userName, string passwordHash, List<Todo> todos)
        {
            Id = id;
            UserName = userName;
            PasswordHash = passwordHash;
            Todos = todos;
        }
    }
}
