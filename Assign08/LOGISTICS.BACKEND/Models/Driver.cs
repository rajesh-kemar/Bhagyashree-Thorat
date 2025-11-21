using System.Collections.Generic;

namespace TravelApi.Models
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string Name { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int ExperienceYears { get; set; }
        public string Status { get; set; } = "Available";

        // Foreign key to AppUser
        public string? UserId { get; set; }
        public virtual AppUser? User { get; set; }

        // Navigation property
        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
