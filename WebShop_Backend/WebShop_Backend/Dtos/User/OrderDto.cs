using System.ComponentModel.DataAnnotations;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Dtos.User
{
    public class OrderDto
    {
        [Key]
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public List<OrderItem> Items { get; set; } = new List<OrderItem>();

        public string ShippingAddress { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Zip { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
