namespace WebShop_Backend.Dtos.Product
{
    public class FilterDto
    {
        public int? Type { get; set; }

        public int? Color { get; set; }

        public int? Gender { get; set; }

        public string? SortBy { get; set; }

        public string? Search { get; set; }
    }
}
