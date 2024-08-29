using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationRepository _authenticationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        int tokenExpirationTimeMinutes = 15;

        public AuthController(IAuthenticationRepository authenticationRepository, IUserRepository userRepository, IConfiguration configuration)
        {
            _authenticationRepository = authenticationRepository;
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (await _userRepository.IsEmailTaken(registerUserDto.Email))
            {
                return Conflict("Email is already taken.");
            }

            var user = new User
            {
                FirstName = registerUserDto.Firstname,
                LastName = registerUserDto.Lastname,
                Email = registerUserDto.Email,
                Password = _authenticationRepository.HashPassword(registerUserDto.Password),
                BirthDate = registerUserDto.BirthDate,
                Role = UserRole.Member
            };

            var registeredUser = await _userRepository.CreateUser(user);

            if (registeredUser == null)
            {
                return StatusCode(500, "An error occurred while creating the user.");
            }

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var user = await _authenticationRepository.AuthenticateUser(userLoginDto.Email, userLoginDto.Password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.UserData, user.BirthDate.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var identity = new ClaimsIdentity(claims, "jwtToken");
            var principal = new ClaimsPrincipal(identity);

            var token = _authenticationRepository.GenerateJwtToken(principal);

            return Ok(new { Token = token });
        }

        [HttpPost("/refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            if (principal == null)
            {
                return Unauthorized("Invalid token");
            }

            var newToken = GenerateJwtToken(principal);
            return Ok(new { Token = newToken });
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }

        private string GenerateJwtToken(ClaimsPrincipal principal)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                principal.Claims,
                expires: DateTime.Now.AddMinutes(tokenExpirationTimeMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
