using Microsoft.EntityFrameworkCore;
using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public class OrderRepository: IOrderRepository
    {

        private WebShopContext _dbContext;

        public OrderRepository(WebShopContext dbContext) { 
        
            _dbContext = dbContext;
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

            return HttpStatusCode.OK;
        }

        public async Task<List<Order>> GetOrders()
        {
            return await _dbContext.Orders.ToListAsync();
        }

    }
}
