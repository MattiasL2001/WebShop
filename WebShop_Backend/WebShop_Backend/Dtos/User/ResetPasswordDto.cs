using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Dtos.User
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}