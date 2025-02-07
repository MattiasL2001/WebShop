namespace WebShop_Backend.Entity
{
    public class Claim
    {
        public string email { get; set; }
        public string name { get; set; }
        public DateTime? birthDate { get; set; }
        public UserRole? role { get; set; }
    }
}
