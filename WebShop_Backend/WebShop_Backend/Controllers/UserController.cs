﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Dtos.User;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace WebShop_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;


        public UserController(IUserRepository userRepository, IOrderRepository orderRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _orderRepository = orderRepository;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<ActionResult<RegisterUserDto>> RegisterUser(RegisterUserDto registerUserDto)
        {

            var user = _mapper.Map<User>(registerUserDto);

            var registerdUser = await _userRepository.CreateUser(user);

            if (registerdUser == null)
            {
                return Unauthorized();
            }

            registerUserDto = _mapper.Map<RegisterUserDto>(registerdUser);

            return CreatedAtAction("GetUser", new { firstName = registerUserDto.Firstname }, registerUserDto);
        }

        
        [HttpPost]
        [Route("login")]
        [Authorize]
        public async Task<ActionResult> LoginUser(UserLoginDto userLoginDto)
        {

            var user = _mapper.Map<User>(userLoginDto);

            var loginStatus = await _userRepository.UserLogin(user);

            if (loginStatus == HttpStatusCode.NotFound)
            {
                return NotFound();
            }

            else if (loginStatus == HttpStatusCode.Unauthorized)
            {
                return Unauthorized();
            }

            return Ok();
        }

        [HttpPost]
        [Route("logout")]
        public async Task<ActionResult> LogoutUser(UserLoginDto userLoginDto)
        {

            var user = _mapper.Map<User>(userLoginDto);

            var loginStatus = await _userRepository.UserLogin(user);

            if (loginStatus == HttpStatusCode.NotFound)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost]
        [Route("order")]
        public async Task<ActionResult> Order(OrderDto orderDto)
        {

            var order = _mapper.Map<Order>(orderDto);

            var orderStatus = await _orderRepository.AddOrder(order);

            if (orderStatus == HttpStatusCode.BadRequest)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser(int userId)
        {

            var registerdUser = await _userRepository.GetUser(userId);

            if (registerdUser == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(registerdUser);

            return Ok(userDto);
        }

        [HttpGet]
        [Route("orders")]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {

            var orders = await _orderRepository.GetOrders();

            var orderDtos = _mapper.Map<List<OrderDto>>(orders);

            return Ok(orderDtos);
        }

        [HttpPatch]
        public async Task<ActionResult<HashSet<int>>> AddToBasket(UpdateBasketDto addToBasketDto)
        {

            var userBasket = await _userRepository.AddToBasket(addToBasketDto.UserId,addToBasketDto.ProductId);

            if (userBasket == null)
            {
                return NotFound();
            }

            return Ok(userBasket);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFromBasket(UpdateBasketDto updateBasketDto)
        {

            var userBasket = await _userRepository.RemoveFromBasket(updateBasketDto.UserId, updateBasketDto.ProductId);

            if (userBasket == false)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
