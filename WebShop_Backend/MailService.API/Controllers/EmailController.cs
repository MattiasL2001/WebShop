using Microsoft.AspNetCore.Mvc;
using MailService.API.Dtos;
using MailService.API.Services;

namespace MailService.API.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _mailService;

        public EmailController(EmailService mailService)
        {
            _mailService = mailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] SendEmailDto dto)
        {
            await _mailService.SendEmail(dto.To, dto.Subject, dto.Html);
            return Ok();
        }
    }
}