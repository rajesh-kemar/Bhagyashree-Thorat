using Microsoft.EntityFrameworkCore;

namespace TravelApi.Models
{
    [Keyless]
    public class DriverTripSummary
    {
        public int TotalTrips { get; set; }
        public int TotalHoursDriven { get; set; }
    }
}
