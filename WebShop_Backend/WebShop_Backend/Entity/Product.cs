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

        public int ProductAmount { get; set; }

        public string Image {  get; set; }

        public Type ProductType { get; set; }

        public Color ProductColor { get; set; }

        public Gender ProductGender { get; set; }

        public enum Type { Clothing, Accessories }

        public enum Color { White, Gray, Black, Red, Green, Yellow, Orange, Blue, Pink, Purpel, Brown }

        public enum Gender { Men, Woman }

    }
}
