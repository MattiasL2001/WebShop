using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Entity;
using WebShop_Backend.Dtos;
using WebShop_Backend.Infrastructure.Repositorys;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserControler : ControllerBase
    {

        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserControler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<ActionResult<UserDto>> RegisterUser(User user)
        {

            var registerdUser = await _userRepository.CreateUser(user);

            var userDto = _mapper.Map<UserDto>(registerdUser);

            return CreatedAtAction("GetUser", new { id = userDto.Id }, userDto);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginUser(User user)
        {
            var existingUser = await _userRepository.UserLogin(user);

            if (existingUser == null)
            {
                return BadRequest();
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
        public async Task<ActionResult<HashSet<int>>> GetBasket(int user)
        {

            var userBasket = await _userRepository.GetBasket(user);

            if (userBasket == null) 
            {  
                return NotFound(); 
            }

            return Ok(userBasket);
        }

        [HttpPatch]
        public async Task<ActionResult<HashSet<int>>> AddToBasket(int userId, int productId)
        {

            var userBasket = await _userRepository.AddToBasket(userId,productId);

            if (userBasket == null)
            {
                return NotFound();
            }

            return Ok(userBasket);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFromBasket(int userId, int productId)
        {

            var userBasket = await _userRepository.RemoveFromBasket(userId, productId);

            if (userBasket == false)
            {
                return BadRequest();
            }

            return Ok();
        }

    }
}
