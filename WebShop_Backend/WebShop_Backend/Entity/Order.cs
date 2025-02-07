using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Entity
{
    public class Order
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

    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int OrderId { get; set; }
    }

}
