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
            CreateMap<User, RegisterUserDto>();
            CreateMap<RegisterUserDto, User>();
            CreateMap<UserLoginDto, User>();


            CreateMap<ProductDto, Product>();
        }

    }
}
