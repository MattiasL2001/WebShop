using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Serialization;

namespace WebShop_Backend.Dtos.User
{
    public class EditUserDto
    {

        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }

        public string? Password { get; set; }

        public string Email { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime BirthDate { get; set; }

    }
}
