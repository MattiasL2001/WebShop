using Microsoft.EntityFrameworkCore;
using System.Net;
using WebShop_Backend.Entity;
using WebShop_Backend.Services;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class OrderRepository: IOrderRepository
    {

        private WebShopContext _dbContext;
        private MailService _mailService;

        public OrderRepository(WebShopContext dbContext) { 
        
            _dbContext = dbContext;
            _mailService = new MailService();
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

            var orderdProducts = string.Join("\n",_dbContext.Products.Where(product => product.Id == order.Id));

            _mailService.ConfirmeOrder(order.Email, "testname", orderdProducts);

            return HttpStatusCode.OK;
        }

        public async Task<List<Order>> GetOrders()
        {
            return await _dbContext.Orders.ToListAsync();
        }

    }
}
