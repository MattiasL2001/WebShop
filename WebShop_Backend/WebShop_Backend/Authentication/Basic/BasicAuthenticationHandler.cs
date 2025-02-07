using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;

namespace WebShop_Backend.Authentication.Basic
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {

        private readonly IAuthenticationRepository _authenticationRepository;
        private readonly IUserRepository _userRepository;

        public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, IAuthenticationRepository authenticationRepository, IUserRepository userRepository) : base(options, logger, encoder, clock)
        {
            _authenticationRepository = authenticationRepository;
            _userRepository = userRepository;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (Request.Headers.ContainsKey("Authorization") == false)
            {
                return await Task.FromResult(AuthenticateResult.Fail("Missing Authorization key"));
            }

            var authorizationHeader = Request.Headers["Authorization"].ToString();

            if (authorizationHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase) == false)
            {
                return await Task.FromResult(AuthenticateResult.Fail("Authorization header does not start with 'Basic '"));
            }

            var authUser = await _authenticationRepository.AuthenticateUser(authorizationHeader);

            if (authUser == null)
            {
                return await Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header format"));
            }

            var claim = await _userRepository.GetClaims(authUser.Email);

            var client = new AuthenticationClient
            {
                AuthenticationType = BasicAuthenticationDefaults.AuthenticationScheme,
                IsAuthenticated = true,
                Name = claim.name,
                Role = claim.role,
            };

            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(client, new[]
            {
                new System.Security.Claims.Claim(ClaimTypes.Name, claim.name),
                new System.Security.Claims.Claim(ClaimTypes.Email, authUser.Email),
                new System.Security.Claims.Claim(ClaimTypes.Role, authUser.Role.ToString()),
                new System.Security.Claims.Claim(ClaimTypes.DateOfBirth, claim.birthDate.ToString()),
            }));

            return await Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name)));

        }
    }
}
