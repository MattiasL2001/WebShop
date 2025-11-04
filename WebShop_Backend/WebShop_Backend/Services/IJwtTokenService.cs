using DbClaim = WebShop_Backend.Entity.Claim;

namespace WebShop_Backend.Services
{
    public interface IJwtTokenService
    {
        string CreateToken(DbClaim claim, TimeSpan? lifetime = null);
    }
}
