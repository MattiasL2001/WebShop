using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Dtos;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using AutoMapper;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Dtos.User;
using WebShop_Backend.Services;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IMapper _mapper;
        private readonly IPasswordHasherService _passwordHasherService;

        public AdminController(IAdminRepository adminRepository, IMapper mapper, IPasswordHasherService passwordHasherService)
        {
            _adminRepository = adminRepository;
            _mapper = mapper;
            _passwordHasherService = passwordHasherService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminRepository.GetUsers();
            List<EditUserDto> usersDto = _mapper.Map<List<EditUserDto>>(users);
            return Ok(usersDto);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] EditUserDto createUserDto)
        {
            // Hashar lösenordet innan användaren sparas
            string hashedPassword = _passwordHasherService.HashPassword(createUserDto.Password);
            createUserDto.Password = hashedPassword;

            var user = _mapper.Map<User>(createUserDto);
            var createdUser = await _adminRepository.CreateUser(user);

            if (createdUser == null)
            {
                return BadRequest("User already exists.");
            }

            return Ok(_mapper.Map<EditUserDto>(createdUser));
        }

        // Hämta användare
        [HttpPut("users/{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] EditUserDto editedUserDto)
        {
            var user = await _adminRepository.GetUser(id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            _mapper.Map(editedUserDto, user);
            var updatedUser = await _adminRepository.EditUser(id);

            return Ok(_mapper.Map<EditUserDto>(updatedUser));
        }

        // Ta bort användare
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _adminRepository.DeleteUser(id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok("User deleted successfully.");
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _adminRepository.GetProducts();
            return Ok(products);
        }


        // Skapa produkt
        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto createProductDto)
        {
            var product = _mapper.Map<Product>(createProductDto);
            var createdProduct = await _adminRepository.CreateProduct(product);

            return Ok(_mapper.Map<ProductDto>(createdProduct));
        }

        // Redigera produkt
        [HttpPut("products/{id}")]
        public async Task<IActionResult> EditProduct(int id, [FromBody] ProductDto editProductDto)
        {
            var product = await _adminRepository.GetProduct(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            _mapper.Map(editProductDto, product);
            var updatedProduct = await _adminRepository.EditProduct(id);

            return Ok(_mapper.Map<ProductDto>(updatedProduct));
        }

        // Ta bort produkt
        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _adminRepository.DeleteProduct(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok("Product deleted successfully.");
        }
    }
}
