using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Buffers.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebShop_Backend.Authentication.Basic.Attributes;
using WebShop_Backend.Authentication.JwtBearer;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;

namespace WebShop_Backend.Controllers
{
    [Route("auth")]
    [ApiController]
    public class OAuthController : ControllerBase
    {

        private readonly JwtBearerSettings _jwtBearerSettings;
        private readonly IUserRepository _userRepository;

        public OAuthController(IOptions<JwtBearerSettings> jwtBearerSettingsOptions, IUserRepository userRepository)
        {
            _jwtBearerSettings = jwtBearerSettingsOptions.Value;
            _userRepository = userRepository;
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

            string header = Request.Headers.Authorization;

            Console.WriteLine(header);

            var authBase64Decoded = Encoding.UTF8.GetString(Convert.FromBase64String(header.Replace("Basic ", "", StringComparison.OrdinalIgnoreCase)));
            var authSplit = authBase64Decoded.Split(new[] { ':' }, 2);
            string email = authSplit.First();

            WebShop_Backend.Entity.Claim claim = await _userRepository.GetClaims(email);

            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var expiry = now.Add(TimeSpan.FromHours(24));

            var jwtBearerAuthenticatedClient = new AuthenticationClient
            {
                IsAuthenticated = true,
                AuthenticationType = JwtBearerDefaults.AuthenticationScheme,
                Name = claim.name,
            };

            var rsa = RSA.Create();
            rsa.ImportFromPem(_jwtBearerSettings.PrivateKey.ToCharArray());


            var token = tokenHandler.WriteToken(tokenHandler.CreateToken(
                new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(jwtBearerAuthenticatedClient,
                    new List<System.Security.Claims.Claim>
                    {
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Name, claim.name),
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, claim.email),
                        new System.Security.Claims.Claim(JwtRegisteredClaimNames.Birthdate, claim.birthDate.ToString()),
                    }),
                    Expires = expiry,
                    Issuer = _jwtBearerSettings.Issuer,
                    Audience = _jwtBearerSettings.Audience,
                    SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials
                    (
                        new RsaSecurityKey(rsa),
                        SecurityAlgorithms.RsaSha256
                    ),
                    IssuedAt = now,
                    NotBefore = now,
                }));

            return Ok(new
            {
                access_token = token,
                token_type = JwtBearerDefaults.AuthenticationScheme,
                expires_in = expiry.Subtract(DateTime.UtcNow).TotalSeconds.ToString("0")
            });
        }
    }
}
