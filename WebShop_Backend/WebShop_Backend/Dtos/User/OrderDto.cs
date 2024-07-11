namespace WebShop_Backend.Dtos.User
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public List<int> ProductAmount { get; set; }

        public List<int> ProductIds { get; set; }

        public string ShippingAddress { get; set; }

        public string City { get; set; }

        public string Zip { get; set; }

        public string Country { get; set; }

        public string Phone { get; set; }

    }
}
