using Microsoft.EntityFrameworkCore;
using System.Net;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Infrastructure.Repositorys
{
    public interface IOrderRepository
    {
        public Task<HttpStatusCode> AddOrder(Order order);

        public Task<List<Order>> GetOrders();
    }
}
