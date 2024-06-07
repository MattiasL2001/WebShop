using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Entity
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; }
        
        public string LastName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public DateTime Birthdate { get; set; }

        //[ConcurrencyCheck]
        public List<int> Basket { get; set; } = new List<int>(); 

    }
}
