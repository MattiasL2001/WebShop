using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Dtos.User;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<ActionResult<RegisterUserDto>> RegisterUser(RegisterUserDto registerUserDto)
        {

            var user = _mapper.Map<User>(registerUserDto);

            var registerdUser = await _userRepository.CreateUser(user);

            registerUserDto = _mapper.Map<RegisterUserDto>(registerdUser);

            return CreatedAtAction("GetUser", new { firstName = registerUserDto.Firstname }, registerUserDto);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginUser(UserLoginDto userLoginDto)
        {

            var user = _mapper.Map<User>(userLoginDto);

            var existingUser = await _userRepository.UserLogin(user);

            if (existingUser == null)
            {
                return NotFound();
            }

            return Redirect("https://localhost:7180/swagger/index.html");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser(int userId)
        {

            var registerdUser = await _userRepository.GetUser(userId);

            if (registerdUser == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(registerdUser);

            return Ok(userDto);
        }

        [HttpGet]
        [Route("basket")]
        public async Task<ActionResult<HashSet<int>>> GetBasket(int userId)
        {

            var userBasket = await _userRepository.GetBasket(userId);

            if (userBasket == null) 
            {  
                return NotFound(); 
            }

            return Ok(userBasket);
        }

        [HttpPatch]
        public async Task<ActionResult<HashSet<int>>> AddToBasket(UpdateBasketDto addToBasketDto)
        {

            var userBasket = await _userRepository.AddToBasket(addToBasketDto.UserId,addToBasketDto.ProductId);

            if (userBasket == null)
            {
                return NotFound();
            }

            return Ok(userBasket);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFromBasket(UpdateBasketDto updateBasketDto)
        {

            var userBasket = await _userRepository.RemoveFromBasket(updateBasketDto.UserId, updateBasketDto.ProductId);

            if (userBasket == false)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
