using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Security.Cryptography;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet("{email}")]
        public async Task<ActionResult<UserDto>> GetUser(string email)
        {
            var registeredUser = await _userRepository.GetUser(email);

            if (registeredUser == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(registeredUser);

            return Ok(userDto);
        }

        [HttpPut("{email}/change-password")]
        public async Task<ActionResult> ChangePassword(string email, [FromQuery] string newPassword)
        {
            var user = await _userRepository.GetUser(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            string hashedPassword = HashPassword(newPassword);
            await _userRepository.ChangeUserPassword(email, hashedPassword);
            return Ok("Password updated successfully.");
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);

                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }

        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAccount(string email)
        {
            var result = await _userRepository.DeleteUser(email);
            if (!result)
            {
                return BadRequest("Could not delete the user.");
            }

            return NoContent();
        }
    }
}
