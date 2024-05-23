using Api.Dtos;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IAuthenticate _authenticate;
        private readonly IConfiguration _configuration;
        private int passwordMinimumLength = 5;
        private int tokenExpirationTimeMinutes = 15;

        public AuthenticateController(IAuthenticate authenticate, IConfiguration configuration)
        {
            _authenticate = authenticate;
            _configuration = configuration;
        }

        [HttpPost("/register")]
        public async Task<ActionResult<UserDto>> Register(UserRegistration user)
        {
            if (await _authenticate.IsUserNameTaken(user.Username))
            {
                Console.WriteLine($"{user.Username} is taken!");
                return Conflict("Username already exists!");
            }
            if (user.Password.Length < passwordMinimumLength)
            {
                Console.WriteLine("Bad password!");
                return Conflict("Password needs to include at least 5 characters!");
            }

            var userObj = await _authenticate.Register(user.Username, user.Password);
            return Ok(userObj);
        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] UserAuthenticationDto userDto)
        {
            if (ModelState.IsValid)
            {
                var user = await _authenticate.ValidateCredentials(userDto.UserName, userDto.Password);

                if (user == null)
                {
                    return Unauthorized("Could not find a user with matching credentials");
                }

                var claims = new[]
                {
            new Claim(ClaimTypes.Name, user.UserName),
            // Add more claims as needed based on your user data
        };

                var identity = new ClaimsIdentity(claims, "jwt");
                var principal = new ClaimsPrincipal(identity);

                var token = GenerateJwtToken(principal);

                // Return the token to the client
                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid username or password!");
        }



        [HttpPost("/logout")]
        public async Task<IActionResult> Logout()
        {
            await _authenticate.Logout();
            return Ok("Logout successful");
        }

        [HttpDelete("/delete")]
        public async Task<IActionResult> DeleteUser(UserAuthenticationDto userDto)
        {
            var user = await _authenticate.ValidateCredentials(userDto.UserName, userDto.Password);

            if (user == null)
            {
                return Unauthorized("Could not find a user with matching credentials");
            }

            _authenticate.DeleteAccount(user);
            return Ok(user);
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


        [HttpPost("/refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            var principal = GetPrincipalFromExpiredToken(refreshTokenDto.Token);
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
                ValidateLifetime = false // disable lifetime validation as we want to refresh tokens
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

    }
}
