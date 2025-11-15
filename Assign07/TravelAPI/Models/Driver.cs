using System.Collections.Generic;

namespace TravelApi.Models
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string Name { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public int ExperienceYears { get; set; }
        public string Status { get; set; } = "Available";


        // Navigation property
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
