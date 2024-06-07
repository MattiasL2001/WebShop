using WebShop_Backend.Dtos.Product;

namespace WebShop_Backend.Dtos.User
{
    public class UserBasketDto
    {
        public HashSet<ProductDto> Basket { get; set; }

    }
}
