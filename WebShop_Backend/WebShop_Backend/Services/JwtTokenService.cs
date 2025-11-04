using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using WebShop_Backend.Authentication.JwtBearer;
using WebShop_Backend.Services;
using DbClaim = WebShop_Backend.Entity.Claim;

namespace WebShop_Backend.Application.Services
{
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly JwtSecurityTokenHandler _handler = new();
        private readonly SigningCredentials _creds;
        private readonly string _issuer;
        private readonly string _audience;

        public JwtTokenService(IOptions<JwtBearerSettings> opts)
        {
            var s = opts.Value;
            _issuer = s.Issuer;
            _audience = s.Audience;

            var rsa = RSA.Create();
            rsa.ImportFromPem(s.PrivateKey.ToCharArray());
            _creds = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256);
        }

        public string CreateToken(DbClaim claim, TimeSpan? lifetime = null)
        {
            var now = DateTime.UtcNow;
            var exp = now.Add(lifetime ?? TimeSpan.FromHours(24));

            var identity = new ClaimsIdentity(
                authenticationType: JwtBearerDefaults.AuthenticationScheme,
                nameType: ClaimTypes.Name,
                roleType: ClaimTypes.Role);

            identity.AddClaim(new Claim("name", claim.name ?? string.Empty));
            identity.AddClaim(new Claim("email", claim.email ?? string.Empty));
            identity.AddClaim(new Claim("birthdate", claim.birthDate.ToString() ?? string.Empty));
            identity.AddClaim(new Claim("role", claim.role.ToString()));

            var token = _handler.CreateToken(new SecurityTokenDescriptor
            {
                Subject = identity,
                Issuer = _issuer,
                Audience = _audience,
                NotBefore = now,
                IssuedAt = now,
                Expires = exp,
                SigningCredentials = _creds
            });

            return _handler.WriteToken(token);
        }

    }
}
