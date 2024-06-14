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

        public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, IAuthenticationRepository authenticationRepository) : base(options, logger, encoder, clock)
        {
            _authenticationRepository = authenticationRepository;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (Request.Headers.ContainsKey("Authorization") == false)
            {
                return Task.FromResult(AuthenticateResult.Fail("Missing Authorization key"));
            }

            var authorizationHeader = Request.Headers["Authorization"].ToString();

            if (authorizationHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase) == false)
            {
                return Task.FromResult(AuthenticateResult.Fail("Authorization header does not start with 'Basic '"));
            }

            var authUser = _authenticationRepository.AuthenticateUser(authorizationHeader).Result;

            if (authUser == null)
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header format"));
            }

            var client = new AuthenticationClient
            {
                AuthenticationType = BasicAuthenticationDefaults.AuthenticationScheme,
                IsAuthenticated = true,
                Name = authUser.Email,
            };

            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(client, new[]
            {
                new Claim(ClaimTypes.Name, authUser.Email)
            }));

            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name)));

        }
    }
}
