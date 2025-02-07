using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using static WebShop_Backend.Entity.Product;

namespace WebShop_Backend.Dtos.Product
{
    public class ProductDto
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int ProductAmount { get; set; }

        public string Image { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Entity.Product.Type ProductType { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Color ProductColor { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Gender ProductGender { get; set; }

    }
}
