using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IProductRepository
    {
        public Task<Product> CreateProduct(Product product);
        public Task<List<Product>> GetProducts(int numberPerPage, int page, FilterDto filterDto);
        public Task<Product> GetProduct(int id);
        public Task<int> GetNumberOfProducts();

    }
}
