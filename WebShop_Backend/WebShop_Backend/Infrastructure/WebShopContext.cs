using Microsoft.EntityFrameworkCore;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure
{
    public class WebShopContext : DbContext
    {
        public WebShopContext(DbContextOptions<WebShopContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<User> Users { get; set; }

    }
}
