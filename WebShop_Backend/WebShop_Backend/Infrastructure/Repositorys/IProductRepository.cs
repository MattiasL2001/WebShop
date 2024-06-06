using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IProductRepository
    {
        public Task<Product> CreateProduct(Product product);
        public Task<List<Product>> GetAllProducts();
        public Task<Product> GetProduct(int id);

    }
}
