using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Services;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _users;
        private readonly IAuthService _auth;
        private readonly IOrderRepository _orders;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(
            IUserService users,
            IAuthService auth,
            IOrderRepository orders,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _users = users;
            _auth = auth;
            _orders = orders;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterUserDto dto, CancellationToken ct)
        {
            try
            {
                var created = await _users.RegisterAsync(dto, ct);
                return CreatedAtAction(nameof(GetUser), new { userId = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unexpected error: " + ex.Message });
            }
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login([FromBody] UserLoginDto dto, CancellationToken ct)
        {
            var token = await _auth.LoginBasicAsync(dto.Email, dto.Password);
            return Ok(token);
        }

        public record ChangePasswordDto(string OldPassword, string NewPassword);

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct)
        {
            var email =
                User.FindFirst(ClaimTypes.Email)?.Value ??
                User.FindFirst("email")?.Value ??
                User.Identity?.Name ??
                throw new UnauthorizedAccessException("Missing user email claim.");

            await _users.ChangePasswordAsync(email, dto.OldPassword, dto.NewPassword, ct);
            return NoContent();
        }


        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAccount([FromQuery] string? email)
        {
            var targetEmail = string.IsNullOrWhiteSpace(email)
                ? (User.FindFirst("email")?.Value ?? throw new UnauthorizedAccessException("Missing email claim."))
                : email;

            var deleted = await _userRepository.DeleteUser(targetEmail);
            if (deleted is null)
                return BadRequest("Could not delete the user.");

            return Ok();
        }

        [HttpGet("user")]
        public async Task<ActionResult<UserDto>> GetUser([FromQuery] int userId, CancellationToken ct)
        {
            var registeredUser = await (_orders as IUserRepository)!.GetUser(userId);
            if (registeredUser == null) return NotFound();

            var userDto = _mapper.Map<UserDto>(registeredUser);
            return Ok(userDto);
        }

        [HttpPost("order")]
        public async Task<ActionResult> Order([FromBody] OrderDto orderDto, CancellationToken ct)
        {
            var order = _mapper.Map<Order>(orderDto);
            var status = await _orders.AddOrder(order);
            if (status == HttpStatusCode.BadRequest) return BadRequest();
            return Ok();
        }

        [HttpGet("orders")]
        public async Task<ActionResult<List<OrderDto>>> GetOrders(CancellationToken ct)
        {
            var orders = await _orders.GetOrders();
            var dtos = _mapper.Map<List<OrderDto>>(orders);
            return Ok(dtos);
        }

        [HttpGet("{email}/orders")]
        public async Task<ActionResult<List<OrderDto>>> GetOrdersByEmail(string email, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(email)) return BadRequest("Email is required.");

            var orders = await _orders.GetOrdersByEmail(email);
            if (orders == null || !orders.Any()) return NotFound("No orders found for this email.");

            var dtos = _mapper.Map<List<OrderDto>>(orders);
            return Ok(dtos);
        }
    }
}
