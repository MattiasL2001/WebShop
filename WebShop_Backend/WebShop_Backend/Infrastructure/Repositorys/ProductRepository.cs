using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class ProductRepository : IProductRepository
    {
        private WebShopContext _dbContext;

        public ProductRepository(WebShopContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task<Product> CreateProduct(Product product)
        {
            if (product == null)
            {
                return null;
            }

            _dbContext.Add(product);
            _dbContext.SaveChanges();

            return product;
        }

        public async Task<List<Product>> GetProducts(int numberPerPage, int page, FilterDto filterDto)
        {

            if (numberPerPage < 0 || page < 1) 
            {
                return null;
            }

            var products = await _dbContext.Products.ToListAsync();

            if (filterDto.Search != null)
            {
                products = products.Where(p => p.Name.ToLower().Contains(filterDto.Search.Trim().ToLower()) || p.Description.ToLower().Contains(filterDto.Search.Trim().ToLower())).ToList();
            }

            if (filterDto.Type != null) 
            {
              products = products.Where(p => (int)p.ProductType == filterDto.Type).ToList();
            }

            if (filterDto.Color != null)
            {
              products = products.Where(p => (int)p.ProductColor == filterDto.Color).ToList();
            }

            if (filterDto.Gender != null)
            {
              products = products.Where(p => (int)p.ProductGender == filterDto.Gender).ToList();
            }

            products = products.Skip((page - 1) * numberPerPage).Take(numberPerPage).ToList();

            products = filterDto.SortBy == "price-lowest-first" ? products.OrderBy(p => p.Price).ToList() : products;
            products = filterDto.SortBy == "price-highest-first" ? products.OrderByDescending(p => p.Price).ToList() : products;

            if (products.Count == 0)
            {
                return null;
            }

            return products;
        }

        public async Task<int> GetNumberOfProducts()
        {
            return await _dbContext.Products.CountAsync();
        }

        public async Task<Product> GetProduct(int id) 
        {
            var product = await _dbContext.Products.FindAsync(id);
            
            if (product == null)
            {
                return null;
            }

            return product;
        }



    }
}
