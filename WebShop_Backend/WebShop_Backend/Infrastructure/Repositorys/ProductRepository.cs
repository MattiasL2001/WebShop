using Microsoft.EntityFrameworkCore;
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

        public async Task<List<Product>> GetAllProducts()
        {
            var products = await _dbContext.Products.ToListAsync();

            if (products.Count == 0)
            {
                return null;
            }

            return products;
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
