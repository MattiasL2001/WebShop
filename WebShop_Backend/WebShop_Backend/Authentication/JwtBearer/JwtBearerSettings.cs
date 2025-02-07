namespace WebShop_Backend.Authentication.JwtBearer
{
    public class JwtBearerSettings
    {
        public string Issuer { get; set; }

        public string Audience { get; set; }

        public string PrivateKey { get; set; }

        public string PublicKey { get; set; }
    }
}
