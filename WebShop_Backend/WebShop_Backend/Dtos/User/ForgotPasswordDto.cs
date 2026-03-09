using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Dtos.User
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}