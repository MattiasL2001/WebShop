using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Dtos.Product;
using WebShop_Backend.Entity;
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

            var productDto = _mapper.Map<ProductDto>(product);

            return Ok(productDto);

        }

        [HttpGet]
        [Route("products")]
        public async Task<ActionResult<List<Product>>> GetProducts(int numberPerPage, int page, int? type, int? color, int? gender, string? sortBy, string? search)
        {
            var filterDto = new FilterDto() { Type = type, Color = color, Gender = gender, SortBy = sortBy, Search = search };

            var products = await _productRepository.GetProducts(numberPerPage,page,filterDto);

            if (products == null)
            {
                return NotFound();
            }

            var productsDto = _mapper.Map<List<ProductDto>>(products);

            return Ok(productsDto);

        }

        [HttpGet]
        [Route("all")]
        public async Task<ActionResult<int>> GetNumberOfProducts()
        {

            var numberOfProducts = await _productRepository.GetNumberOfProducts();

            return Ok(numberOfProducts);

        }

    }
}
