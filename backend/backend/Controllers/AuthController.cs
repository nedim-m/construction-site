using backend.Services;
using Microsoft.AspNetCore.Mvc;
using static backend.Models.AuthModel;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authService;

        public AuthController(IAuthServices authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await _authService.RegisterUserAsync(model);
            if (result) return Ok(new { message = "User created successfully" });
            return BadRequest(new { message = "User creation failed" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _authService.LoginUserAsync(model);
            if (token != null) return Ok(new { token });
            return Unauthorized(new { message = "Invalid credentials" });
        }

        //[HttpPost("addrole")]
        //public async Task<IActionResult> AddRole([FromBody] RoleModel model)
        //{
        //    var result = await _authService.CreateRoleAsync(model.RoleName);
        //    if (result) return Ok(new { message = "Role created successfully" });
        //    return BadRequest(new { message = "Role creation failed" });
        //}

        //[HttpPost("assignrole")]
        //public async Task<IActionResult> AssignRole([FromBody] AssignRoleModel model)
        //{
        //    var result = await _authService.AssignRoleAsync(model.Username, model.RoleName);
        //    if (result) return Ok(new { message = "Role assigned successfully" });
        //    return NotFound(new { message = "User not found" });
        //}
    }
}