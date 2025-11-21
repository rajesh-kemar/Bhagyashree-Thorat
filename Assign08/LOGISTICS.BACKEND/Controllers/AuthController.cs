using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelApi.Data;
using TravelApi.Models;
using TravelApi.Services;


namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly TravelContext _context;
        private readonly TokenService _tokenService;


        public AuthController(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IConfiguration config,
    TravelContext context,
    TokenService tokenService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _context = context;
            _tokenService = tokenService;
        }


        // REGISTER — only Dispatcher can register new users
        //[Authorize(Roles = "Dispatcher")] 
        //[AllowAnonymous] // anyone can register

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.Username,
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.Phone
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            // If user requested Dispatcher, require a valid invite
            if (dto.Role == "Dispatcher")
            {
                if (string.IsNullOrWhiteSpace(dto.InviteCode))
                    return Forbid("Dispatcher registration requires an invite code.");

                var invite = await _context.DispatcherInvites
                    .FirstOrDefaultAsync(i => i.Code == dto.InviteCode);

                if (invite == null || invite.IsUsed || invite.ExpiresAt < DateTime.UtcNow)
                    return Forbid("Invalid or expired invite code.");

                await _userManager.AddToRoleAsync(user, "Dispatcher");

                invite.IsUsed = true;
                invite.UsedByUserId = user.Id;
                await _context.SaveChangesAsync();
            }
            else
            {
                // Default to Driver if anything else
                await _userManager.AddToRoleAsync(user, "Driver");

                // Create Driver profile
                var driver = new Driver
                {
                    Name = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    LicenseNumber = dto.LicenseNumber ?? string.Empty,
                    ExperienceYears = dto.ExperienceYears ?? 0,
                    Status = "Available",
                    UserId = user.Id
                };
                _context.Drivers.Add(driver);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Registration successful" });

        }




        //  LOGIN — returns JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null) return Unauthorized("Invalid credentials");

            var check = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!check) return Unauthorized("Invalid credentials");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            var token = _tokenService.CreateToken(user, role);

            return Ok(new { token, role });
        }



    }
}
