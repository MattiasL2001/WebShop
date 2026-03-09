using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Column(TypeName = "TEXT COLLATE NOCASE")]
        public string? Email { get; set; }

        public DateTime? BirthDate { get; set; }

        public bool EmailVerified { get; set; } = false;

        public string? EmailVerificationToken { get; set; }

        public DateTime? EmailVerificationTokenExpiry { get; set; }

        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetTokenExpiry { get; set; }

        public DateTime? LastPasswordResetRequest { get; set; }
    }
}
