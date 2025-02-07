using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Net;
using WebShop_Backend.Entity;
using WebShop_Backend.Services;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class OrderRepository: IOrderRepository
    {

        private WebShopContext _dbContext;
        private MailService _mailService;

        public OrderRepository(WebShopContext dbContext, IConfiguration configuration) { 
        
            _dbContext = dbContext;
            _mailService = new MailService(configuration);
        }
        public async Task<HttpStatusCode> AddOrder(Order order)
        {
            if (order.Items.Count == 0) // Kollar om det finns några produkter i ordern
            {
                return HttpStatusCode.BadRequest;
            }

            await _dbContext.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            var orderProductStrings = order.Items.Select(item =>
            {
                var product = _dbContext.Products.Find(item.ProductId);
                return product != null ? $"{product.Name} x{item.Quantity}" : null;
            }).Where(str => str != null); // Tar bort eventuella null-värden

            var orderProductString = string.Join('\n', orderProductStrings);

            //_mailService.ConfirmeOrder(order.Email, user.FirstName, orderProductString);

            return HttpStatusCode.OK;
        }

        public async Task<List<Order>> GetOrders()
        {
            return await _dbContext.Orders.ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByEmail(string email)
        {
            return await _dbContext.Orders
                .Where(o => o.Email == email)
                .Include(o => o.Items) // Inkluderar OrderItems
                .ToListAsync();
        }

    }
}
