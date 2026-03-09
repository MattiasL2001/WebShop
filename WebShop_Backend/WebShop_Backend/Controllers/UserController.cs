using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using WebShop_Backend.Clients;
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
        private readonly MailClient _mailClient;
        private readonly IUserService _users;
        private readonly IAuthService _auth;
        private readonly IOrderRepository _orders;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(
            MailClient mailClient,
            IUserService users,
            IAuthService auth,
            IOrderRepository orders,
            IProductRepository productRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _mailClient = mailClient;
            _users = users;
            _auth = auth;
            _orders = orders;
            _productRepository = productRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet("verify-email")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token, CancellationToken ct)
        {
            var success = await _users.VerifyEmailAsync(token, ct);

            if (!success)
                return BadRequest("Invalid or expired token.");

            return Ok("Email verified successfully.");
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

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto, CancellationToken ct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userRepository.GetUserByEmail(dto.Email);

            if (user != null)
            {
                try
                {
                    await _users.GeneratePasswordResetAsync(user, ct);
                }
                catch (InvalidOperationException)
                {
                    // Rate limit triggered
                    // Intentionally ignored to prevent account enumeration
                }
            }

            return Ok(new
            {
                message = "If an account with that email exists, a password reset link has been sent."
            });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken ct)
        {
            var user = await _userRepository.GetUserByResetToken(dto.Token);

            if (user == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired reset token.");

            await _users.ChangePasswordAsync(user.Email, user.Password, dto.NewPassword, ct);

            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            await _userRepository.UpdateUser(user);

            return Ok("Password updated successfully.");
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
            var registeredUser = await _userRepository.GetUser(userId);
            if (registeredUser == null) return NotFound();

            var userDto = _mapper.Map<UserDto>(registeredUser);
            return Ok(userDto);
        }

        [Authorize]
        [HttpPost("order")]
        public async Task<ActionResult> Order([FromBody] OrderDto orderDto, CancellationToken ct)
        {
            var email =
                User.FindFirst(ClaimTypes.Email)?.Value ??
                User.FindFirst("email")?.Value ??
                User.Identity?.Name;

            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized("You must be logged in to place an order.");

            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
                return Unauthorized("User account not found.");

            if (!user.EmailVerified)
                return BadRequest("You must verify your email before placing orders.");

            var order = _mapper.Map<Order>(orderDto);

            order.Email = user.Email;

            var status = await _orders.AddOrder(order);

            if (status == HttpStatusCode.BadRequest)
                return BadRequest("Failed to create order.");

            var products = new List<Product>();

            foreach (var item in order.Items)
            {
                var product = await _productRepository.GetProduct(item.ProductId);
                if (product != null)
                    products.Add(product);
            }

            var productLines = "";

            foreach (var item in order.Items)
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);

                if (product != null)
                {
                    productLines += $"<li>{product.Name} - ${product.Price} x {item.Quantity}</li>";
                }
            }

            decimal totalPrice = 0;

            foreach (var item in order.Items)
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);

                if (product != null)
                {
                    totalPrice += product.Price * item.Quantity;
                }
            }

            var html = $@"
            <h2>Thank you for your order!</h2>

            <p><strong>Order number:</strong> {order.Id}</p>

            <h3>Products</h3>
            <ul>
                {productLines}
            </ul>

            <p><strong>Total price:</strong> ${totalPrice}</p>

            <p>We will notify you when your order ships.</p>";

            await _mailClient.SendOrderConfirmationEmail(user.Email, order.Id, html);

            return Ok("Order placed successfully.");
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
