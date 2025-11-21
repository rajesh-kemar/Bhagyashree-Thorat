namespace TravelApi.Models
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Dispatcher or Driver

        // Driver only
        public string? LicenseNumber { get; set; }
        public int? ExperienceYears { get; set; }

        // Dispatcher only
        public string? InviteCode { get; set; }
    }
}
