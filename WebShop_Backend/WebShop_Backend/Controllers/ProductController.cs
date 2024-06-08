using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Entity;
using WebShop_Backend.Helpers;
using WebShop_Backend.Infrastructure.Repositorys;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {

        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductController(IProductRepository productRepository, IMapper mapper)
        {
            _mapper = mapper;
            _productRepository = productRepository;
        }

        [HttpPost]
        public async Task<ActionResult> CreateProduct(ProductDto productDto)
        {

            var product = _mapper.Map<Product>(productDto);

            var newProduct = await _productRepository.CreateProduct(product);

            return CreatedAtAction("GetProduct", new { id = newProduct.Id }, newProduct);

        }

        [HttpGet]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _productRepository.GetProduct(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);

        }

        [HttpGet]
        [Route("all")]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            var products = await _productRepository.GetAllProducts();

            if (products == null)
            {
                return NotFound();
            }

            return Ok(products);

        }

    }
}
