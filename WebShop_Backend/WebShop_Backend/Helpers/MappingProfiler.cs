using AutoMapper;
using WebShop_Backend.Dtos;
using WebShop_Backend.Entity;

namespace WebShop_Backend.Helpers
{
    public class MappingProfiler : Profile
    {
        public MappingProfiler() 
        {
            CreateMap<User, UserDto>();

            CreateMap<Product, ProductDto>();
        }

    }
}
