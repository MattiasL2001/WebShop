using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace WebShop_Backend.Services
{
    public interface IPasswordHasherService
    {
        string HashPassword(string password);
        bool VerifyPassword(string hashedPassword, string inputPassword);
    }

    public class PasswordHasherService : IPasswordHasherService
    {
        private const int SaltSize = 16; // Storlek för salt (128 bitar)
        private const int KeySize = 32; // Storlek för hash (256 bitar)
        private const int Iterations = 100000; // Antal iterationer för PBKDF2

        public string HashPassword(string password)
        {
            // Generera ett slumpmässigt salt
            byte[] salt = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hasha lösenordet med saltet
            byte[] hash = KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: Iterations,
                numBytesRequested: KeySize);

            // Kombinera salt och hash som en sträng
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        public bool VerifyPassword(string hashedPassword, string inputPassword)
        {
            // Dela upp lagrat värde i salt och hash
            var parts = hashedPassword.Split(':');
            if (parts.Length != 2) return false;

            byte[] salt = Convert.FromBase64String(parts[0]);
            byte[] storedHash = Convert.FromBase64String(parts[1]);

            // Hasha det inkommande lösenordet med samma salt
            byte[] inputHash = KeyDerivation.Pbkdf2(
                password: inputPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: Iterations,
                numBytesRequested: KeySize);

            // Jämför hashar (säker jämförelse för att undvika timing-attacker)
            return CryptographicOperations.FixedTimeEquals(storedHash, inputHash);
        }
    }
}
