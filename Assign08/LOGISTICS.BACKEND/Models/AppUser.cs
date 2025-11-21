using Microsoft.AspNetCore.Identity;

namespace TravelApi.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; }
        // Phone, Email already come from IdentityUser
        // Password is handled internally — no need to store manually
    }
}
