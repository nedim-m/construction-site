using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using static backend.Models.AuthModel;

namespace backend.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly string _keyString;
        private readonly string _issuer;
        private readonly string _audience;

        public AuthServices(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _keyString = Environment.GetEnvironmentVariable("JWT__Key")
         ?? throw new Exception("JWT Key is missing in environment variables!");

            _issuer = Environment.GetEnvironmentVariable("JWT__Issuer")
                ?? throw new Exception("JWT Issuer is missing in environment variables!");

            _audience = Environment.GetEnvironmentVariable("JWT__Audience")
                ?? throw new Exception("JWT Audience is missing in environment variables!");
        }

        public async Task<bool> RegisterUserAsync(RegisterModel model)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Dodaj korisnika u podrazumevanu rolu "User"
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }
                await _userManager.AddToRoleAsync(user, "User");
            }

            return result.Succeeded;
        }

        public async Task<string?> LoginUserAsync(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return null;

            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Proveri da li ključ postoji i da li je dovoljno dugačak
            var keyString = _keyString;
            if (string.IsNullOrEmpty(keyString) || keyString.Length < 32)
            {
                throw new Exception("JWT Key is too short! It must be at least 32 characters.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
                claims: authClaims
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
