using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TravelApi.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string NumberPlate { get; set; }
        public string Type { get; set; }
        public int Capacity { get; set; }
        public string Status { get; set; }

        // Navigation property

        [JsonIgnore]
        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
