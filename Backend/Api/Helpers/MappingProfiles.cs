using Api.Models;
using Api.Dtos;
using AutoMapper;

namespace Api.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>();
            CreateMap<Todo, TodoDto>();
        }
    }
}
