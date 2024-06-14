using System.Security.Principal;

namespace WebShop_Backend.Entity
{
    public class AuthenticationClient : IIdentity
    {
        public string? AuthenticationType { get; set; }

        public bool IsAuthenticated { get; set; }

        public string? Name { get; set; }
    }
}
