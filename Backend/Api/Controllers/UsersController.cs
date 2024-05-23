using Api.Dtos;
using Api.Models;
using Api.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthenticate _authenticate;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;
        private int passwordMinimumLength = 5;

        public UsersController(IUserRepository userRepository, IAuthenticate authenticate,
            IMapper mapper, ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _authenticate = authenticate;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("/users/GetUsers")]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            List<User> users = await _userRepository.GetUsers();
            users.ForEach(user =>
            {
                Console.WriteLine(user.UserName);
            });
            List<UserDto> usersDto = _mapper.Map<List<UserDto>>(users);
            return Ok(usersDto);
        }

        [HttpGet("/users/{username}")]
        public async Task<ActionResult<UserDto>> GetUser(string username)
        {
            User user = await _userRepository.GetUser(username);
            if (user == null) { return BadRequest("Could not find user: " + username); }
            UserDto userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpPut("/users/{username}/changepassword")]
        public async Task<IActionResult> ChangePassword(UserAuthenticationDto userDto, string newPassword)
        {
            var user = await _authenticate.ValidateCredentials(userDto.UserName, userDto.Password);

            if (user == null)
            {
                return Unauthorized("Could not find a user with matching credentials");
            }

            if (newPassword.Length < passwordMinimumLength)
            {
                Console.WriteLine("Bad password!");
                return Conflict("Password needs to include at minimum 5 characters!");
            }

            var newPasswordHash = _authenticate.HashPassword(newPassword);
            await _userRepository.ChangeUserPassword(userDto.UserName, newPasswordHash);
            return Ok("Password changed successfully");
        }

        [HttpGet("/users/{username}/GetTodos")]
        public async Task<ActionResult<List<TodoDto>>> GetUserTodos(string username)
        {
            List<Todo> todos = await _userRepository.GetUserTodos(username);
            List<TodoDto> todosDto = _mapper.Map<List<TodoDto>>(todos);
            return Ok(todosDto);
        }

        [HttpGet("/users/{username}/GetTodo")]
        public async Task<ActionResult<TodoDto>> GetTodo(int userId, int todoId)
        {
            Todo todo = await _userRepository.GetTodo(userId, todoId);
            if (todo == null) { return null; }
            return Ok(todo);
        }

        [HttpPost("/users/{username}/PostTodo")]
        public async Task<ActionResult<TodoDto>> PostTodo(TodoDto todoDto)
        {
            var todo = new Todo
            {
                Priority = todoDto.Priority,
                Completed = todoDto.Completed,
                Title = todoDto.Title,
            };
            var user = await _userRepository.GetUser(todoDto.UserId);
            if (user == null) { return  NotFound("User not found!"); }
            var createdTodo = await _userRepository.AddTodo(todo, todoDto.UserId);
            return Ok(createdTodo);
        }
        [HttpPut("/users/{username}/PutTodo")]
        public async Task<ActionResult<TodoDto>> PutTodo(TodoDto todoDto)
        {
            var updatedTodo = await _userRepository.UpdateTodo(todoDto);

            if (updatedTodo == null) { return BadRequest(); }

            return Ok(todoDto);
        }


        [HttpDelete("/users/{username}/DeleteTodo/{todoId}")]
        public async Task<IActionResult> DeleteTodo(int todoId, string username)
        {
            var todo = await _userRepository.DeleteTodo(username, todoId);
            if (todo == null) { return NotFound(); }
            return Ok(todo);
        }

    }
}
