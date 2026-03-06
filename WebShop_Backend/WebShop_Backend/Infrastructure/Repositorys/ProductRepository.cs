using Microsoft.EntityFrameworkCore;
using Dapper;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Entity;
using System.Text;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class ProductRepository : IProductRepository
    {
        private WebShopContext _dbContext;

        private readonly SqliteConnectionFactory _factory;

        public ProductRepository(WebShopContext dbContext, SqliteConnectionFactory factory) 
        {
            _dbContext = dbContext;
            _factory = factory;
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

        public async Task<List<Product>> GetProducts(
        int numberPerPage,
        int page,
        FilterDto filterDto)
        {
            if (numberPerPage <= 0 || page <= 0)
                return null;

            using var connection = _factory.Create();

            var sql = new StringBuilder();
            sql.Append("SELECT Id, Name, Description, Price, ProductType, Image, ProductColor, ProductGender ");
            sql.Append("FROM Products WHERE 1=1 ");

            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(filterDto?.Search))
            {
                sql.Append("AND (LOWER(Name) LIKE @Search OR LOWER(Description) LIKE @Search) ");
                parameters.Add("@Search", $"%{filterDto.Search.Trim().ToLower()}%");
            }

            if (filterDto?.Type != null)
            {
                sql.Append("AND ProductType = @Type ");
                parameters.Add("@Type", filterDto.Type);
            }

            if (filterDto?.Color != null)
            {
                sql.Append("AND ProductColor = @Color ");
                parameters.Add("@Color", filterDto.Color);
            }

            if (filterDto?.Gender != null)
            {
                sql.Append("AND ProductGender = @Gender ");
                parameters.Add("@Gender", filterDto.Gender);
            }

            if (filterDto?.SortBy == "price-lowest-first")
                sql.Append("ORDER BY Price ASC ");
            else if (filterDto?.SortBy == "price-highest-first")
                sql.Append("ORDER BY Price DESC ");
            else
                sql.Append("ORDER BY Id DESC ");

            sql.Append("LIMIT @Limit OFFSET @Offset");

            parameters.Add("@Limit", numberPerPage);
            parameters.Add("@Offset", (page - 1) * numberPerPage);

            var products = await connection.QueryAsync<Product>(sql.ToString(), parameters);

            return products.ToList();
        }

        //public async Task<List<Product>> GetProducts(int numberPerPage, int page, FilterDto filterDto)
        //{

        //    if (numberPerPage < 0 || page < 1) 
        //    {
        //        return null;
        //    }

        //    var products = await _dbContext.Products.ToListAsync();

        //    if (filterDto.Search != null)
        //    {
        //        products = products.Where(p => p.Name.ToLower().Contains(filterDto.Search.Trim().ToLower()) || p.Description.ToLower().Contains(filterDto.Search.Trim().ToLower())).ToList();
        //    }

        //    if (filterDto.Type != null) 
        //    {
        //      products = products.Where(p => (int)p.ProductType == filterDto.Type).ToList();
        //    }

        //    if (filterDto.Color != null)
        //    {
        //      products = products.Where(p => (int)p.ProductColor == filterDto.Color).ToList();
        //    }

        //    if (filterDto.Gender != null)
        //    {
        //      products = products.Where(p => (int)p.ProductGender == filterDto.Gender).ToList();
        //    }

        //    products = products.Skip((page - 1) * numberPerPage).Take(numberPerPage).ToList();

        //    products = filterDto.SortBy == "price-lowest-first" ? products.OrderBy(p => p.Price).ToList() : products;
        //    products = filterDto.SortBy == "price-highest-first" ? products.OrderByDescending(p => p.Price).ToList() : products;

        //    if (products.Count == 0)
        //    {
        //        return null;
        //    }

        //    return products;
        //}

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
