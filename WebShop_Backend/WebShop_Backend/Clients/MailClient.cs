using System.Net.Http.Json;

namespace WebShop_Backend.Clients
{
    public class MailClient
    {
        private readonly HttpClient _httpClient;

        public MailClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        private record SendEmailRequest(string To, string Subject, string Html);

        public async Task SendVerificationEmail(string email, string link)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email must be provided.", nameof(email));

            if (string.IsNullOrWhiteSpace(link))
                throw new ArgumentException("Verification link must be provided.", nameof(link));

            var request = new SendEmailRequest(
                To: email,
                Subject: "Verify your email",
                Html: $"Click <a href='{link}'>Verify your email</a>"
            );

            var response = await _httpClient.PostAsJsonAsync("/api/email/send", request);

            response.EnsureSuccessStatusCode();
        }

        public async Task SendOrderConfirmationEmail(string email, int orderId, string html)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email must be provided.", nameof(email));

            var request = new SendEmailRequest(
                To: email,
                Subject: $"Order confirmation #{orderId}",
                Html: html
            );

            var response = await _httpClient.PostAsJsonAsync("/api/email/send", request);

            response.EnsureSuccessStatusCode();
        }
    }
}