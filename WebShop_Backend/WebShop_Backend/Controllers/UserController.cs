using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Dtos.User;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using WebShop_Backend.Services;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private readonly IPasswordHasherService _passwordHasherService;

        public UserController(
            IUserRepository userRepository,
            IOrderRepository orderRepository,
            IMapper mapper,
            IPasswordHasherService passwordHasherService)
        {
            _userRepository = userRepository;
            _orderRepository = orderRepository;
            _mapper = mapper;
            _passwordHasherService = passwordHasherService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<RegisterUserDto>> RegisterUser(RegisterUserDto registerUserDto)
        {
            // Hashar lösenordet innan användaren sparas
            string hashedPassword = _passwordHasherService.HashPassword(registerUserDto.Password);

            var user = _mapper.Map<User>(registerUserDto);
            user.Password = hashedPassword;

            var registeredUser = await _userRepository.CreateUser(user);

            if (registeredUser == null)
            {
                return BadRequest("Could not register the user.");
            }

            registerUserDto = _mapper.Map<RegisterUserDto>(registeredUser);
            return CreatedAtAction("GetUser", new { firstName = registerUserDto.Firstname }, registerUserDto);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginUser(UserLoginDto userLoginDto)
        {
            var user = await _userRepository.GetUserByEmail(userLoginDto.Email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            bool isPasswordValid = _passwordHasherService.VerifyPassword(user.Password, userLoginDto.Password);
            if (!isPasswordValid)
            {
                Console.WriteLine(user.Password);
                Console.WriteLine(userLoginDto.Password);
                return Unauthorized("Invalid password.");
            }
            return Ok("Login successful.");
        }

        [Authorize]
        [HttpPut("{email}/change-password")]
        public async Task<IActionResult> ChangePassword(string email, string newPassword)
        {
            // Hämta användaren
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Hashar det nya lösenordet
            string hashedPassword = _passwordHasherService.HashPassword(newPassword);

            // Uppdaterar lösenordet i databasen
            await _userRepository.ChangeUserPassword(email, hashedPassword);
            return Ok("Password changed successfully.");
        }

        [HttpPost]
        [Route("logout")]
        public async Task<ActionResult> LogoutUser(UserLoginDto userLoginDto)
        {
            // Observera att logout inte brukar kräva användning av lösenord
            return Ok("Logout successful.");
        }

        [HttpPost]
        [Route("order")]
        public async Task<ActionResult> Order(OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            var orderStatus = await _orderRepository.AddOrder(order);

            if (orderStatus == HttpStatusCode.BadRequest)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpDelete("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount(string email)
        {
            var user = await _userRepository.DeleteUser(email);
            if (user == null)
            {
                return BadRequest("Could not delete the user.");
            }

            return Ok();
        }

        [HttpGet]
        [Route("user")]
        public async Task<ActionResult<UserDto>> GetUser(int userId)
        {
            var registeredUser = await _userRepository.GetUser(userId);

            if (registeredUser == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(registeredUser);
            return Ok(userDto);
        }

        [HttpGet]
        [Route("orders")]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            var orders = await _orderRepository.GetOrders();
            var orderDtos = _mapper.Map<List<OrderDto>>(orders);

            return Ok(orderDtos);
        }

        [HttpGet("{email}/orders")]
        public async Task<ActionResult<List<OrderDto>>> GetOrdersByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var orders = await _orderRepository.GetOrdersByEmail(email);

            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found for this email.");
            }

            var orderDtos = _mapper.Map<List<OrderDto>>(orders);
            return Ok(orderDtos);
        }

    }
}
