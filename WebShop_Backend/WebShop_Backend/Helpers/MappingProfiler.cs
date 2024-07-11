using AutoMapper;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Helpers
{
    public class MappingProfiler : Profile
    {
        public MappingProfiler() 
        {
            CreateMap<User, UserDto>();
            CreateMap<RegisterUserDto, User>().ReverseMap();
            CreateMap<UserLoginDto, User>();

            CreateMap<OrderDto, Order>().ReverseMap(); 

            CreateMap<ProductDto, Product>().ReverseMap();
        }

    }
}
