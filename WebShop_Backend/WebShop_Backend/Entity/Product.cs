using System.ComponentModel.DataAnnotations;

namespace WebShop_Backend.Entity
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal PriceTotal { get; set;}

        public int ProductAmount { get; set; }

    }
}
