using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using TravelApi.Data;
using TravelApi.Models;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly TravelContext _context;
    private readonly UserManager<AppUser> _userManager;

    public AdminController(TravelContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // Only a Dispatcher can mint a Dispatcher invite
    [Authorize(Roles = "Dispatcher")]
    [HttpPost("dispatcher-invites")]
    public async Task<IActionResult> CreateDispatcherInvite([FromQuery] int daysValid = 7)
    {
        var me = await _userManager.GetUserAsync(User);
        var invite = new DispatcherInvite
        {
            CreatedByUserId = me!.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(daysValid)
        };

        _context.DispatcherInvites.Add(invite);
        await _context.SaveChangesAsync();

        return Ok(new { code = invite.Code, expiresAt = invite.ExpiresAt });
    }
}
