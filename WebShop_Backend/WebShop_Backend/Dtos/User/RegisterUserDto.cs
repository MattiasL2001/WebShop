namespace WebShop_Backend.Dtos.User
{
    public class RegisterUserDto
    {
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public DateTime BirthDate { get; set; }

    }
}
