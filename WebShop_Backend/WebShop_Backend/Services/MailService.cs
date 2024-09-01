using MailKit.Net.Smtp;
using MimeKit;

namespace WebShop_Backend.Services
{
    public class MailService
    {

        private readonly IConfiguration _configuration;

        private readonly string _emailServer;

        private readonly int _port;

        private readonly string _fromEmail;

        private readonly string _password;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _emailServer = _configuration.GetValue<string>("MailCredentials:EmailServer");
            _port = _configuration.GetValue<int>("MailCredentials:Port");
            _fromEmail = _configuration.GetValue<string>("MailCredentials:Email");
            _password = _configuration.GetValue<string>("MailCredentials:Password");
        }

        public void ConfirmeOrder(string toEmail, string name, string products)
        {

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("WebShop", _fromEmail));
            message.To.Add(new MailboxAddress(name, toEmail));
            message.Subject = "Youre order have ben confiremd";

            message.Body = new TextPart("plain") 
            { 
                Text = 
                $"""
                Hello {name}

                This is your receipt:
                {products}
                """ 
            };

            using (var client = new SmtpClient()) 
            {
                client.Connect(_emailServer, _port);
                client.Authenticate(_fromEmail, _password);
                client.Send(message);
                client.Disconnect(true);
            }
            
            

        }
    }
}
