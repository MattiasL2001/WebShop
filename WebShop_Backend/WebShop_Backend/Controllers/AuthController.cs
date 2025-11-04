using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using WebShop_Backend.Authentication.Basic.Attributes;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Services;

namespace WebShop_Backend.Controllers
{
    [Route("auth")]
    [ApiController]
    public class OAuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public OAuthController(IUserRepository userRepository, IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("token"), BasicAuthorization, Consumes("application/x-www-form-urlencoded")]
        public async Task<ActionResult> Token([FromForm(Name = "grant_type")] string grantType)
        {
            if (grantType != "client_credentials")
            {
                return BadRequest(new
                {
                    error = "invalid_grant",
                    error_description = "The grant type must be set as client_credentials"
                });
            }

            var header = Request.Headers.Authorization.ToString();
            var basic = header.Replace("Basic ", "", StringComparison.OrdinalIgnoreCase);
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(basic));
            var parts = decoded.Split(new[] { ':' }, 2);
            var email = (parts.Length > 0 ? parts[0] : string.Empty).Trim();

            var claim = await _userRepository.GetClaims(email);
            if (claim == null)
                return Unauthorized("Invalid client credentials.");

            var lifetime = TimeSpan.FromHours(24);
            var token = _jwtTokenService.CreateToken(claim, lifetime);

            return Ok(new
            {
                email,
                token,
                token_type = JwtBearerDefaults.AuthenticationScheme,
                expires_in = (int)lifetime.TotalSeconds
            });
        }
    }
}
