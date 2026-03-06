using MailKit.Net.Smtp;
using MimeKit;

namespace MailService.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _emailServer;
        private readonly int _port;
        private readonly string _fromEmail;
        private readonly string _password;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _emailServer = _configuration["MailCredentials:EmailServer"];
            _port = int.Parse(_configuration["MailCredentials:Port"]);
            _fromEmail = _configuration["MailCredentials:Email"];
            _password = _configuration["MailCredentials:Password"];
        }

        public async Task SendEmail(string toEmail, string subject, string html)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("WebShop", _fromEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = html
            };

            using var client = new SmtpClient();

            //await client.ConnectAsync(_emailServer, _port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.ConnectAsync(_emailServer, _port, MailKit.Security.SecureSocketOptions.None);
            //await client.AuthenticateAsync(_fromEmail, _password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}