using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Entity
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }

        public UserRole? Role { get; set; }

        public string? Password { get; set; }

        public string? Email { get; set; }

        public DateTime? BirthDate { get; set; }
    }
}
