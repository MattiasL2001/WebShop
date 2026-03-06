namespace MailService.API.Dtos
{
    public class SendEmailDto
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Html { get; set; }
    }
}