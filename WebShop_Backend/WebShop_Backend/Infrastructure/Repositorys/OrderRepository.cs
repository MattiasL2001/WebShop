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

            if (order.ProductIds.Count == 0)
            {
                return HttpStatusCode.BadRequest;
            }

            if (order.ProductAmount.Count == 0) 
            {
                return HttpStatusCode.BadRequest;
            }

            await _dbContext.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            var orderName = _dbContext.Users.Where(user => user.Email == order.Email).First();

            var orderProductStrings = order.ProductIds.Zip(order.ProductAmount, (productId,productAmount) =>
            {
                var product = _dbContext.Products.Find(productId);

                return $"{product.Name} x{productAmount}";

            });

            var orderProductString = String.Join('\n',orderProductStrings);

            //_mailService.ConfirmeOrder(order.Email, orderName.FirstName, orderProductString);

            return HttpStatusCode.OK;
        }

        public async Task<List<Order>> GetOrders()
        {
            return await _dbContext.Orders.ToListAsync();
        }

    }
}
