using WebShop_Backend.Entity;
using static WebShop_Backend.Entity.Product;

namespace WebShop_Backend.Dtos.Product
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int ProductAmount { get; set; }

        public string Image { get; set; }

        public Entity.Product.Type ProductType { get; set; }

        public Color ProductColor { get; set; }

        public Gender ProductGender { get; set; }

    }
}
