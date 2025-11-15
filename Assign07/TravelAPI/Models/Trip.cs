using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelApi.Models
{
    public class Trip
    {
        public int TripId { get; set; }

        [ForeignKey("Vehicle")]
        public int VehicleId { get; set; }

        [ForeignKey("Driver")]
        public int DriverId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; }

        // Navigation properties (make nullable)
        public Vehicle? Vehicle { get; set; }
        public Driver? Driver { get; set; }
    }
}
