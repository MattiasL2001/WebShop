using System.Net.Mail;

namespace WebShop_Backend.Services
{
    public class MailService
    {
        private readonly int _port = 587;

        private readonly string _from = "test@webshop.com";

        private SmtpClient _mailClient;

        public MailService() 
        {
            SmtpClient _mailClient = new SmtpClient();
        }

        public async void ConfirmeOrder(string email, string name, string products)
        {
            MailMessage msg = new MailMessage(_from, email, "Order Confirmation", $"The order of {products} has been confiremd.");

            await _mailClient.SendMailAsync(msg);
        }

    }
}
