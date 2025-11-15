using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApi.Data;
using TravelApi.Models;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly TravelContext _context;
        private readonly ITripService _tripService;

        public TripsController(TravelContext context, ITripService tripService)
        {
            _context = context;
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            var trips = await _tripService.GetAllTripsAsync();
            return Ok(trips);
        }

        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip(Trip trip)
        {
            try
            {
                var created = await _tripService.CreateTripAsync(trip);
                return CreatedAtAction(nameof(GetTrips), new { id = created.TripId }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteTrip(int id)
        {
            var success = await _tripService.CompleteTripAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("~/api/drivers/{id}/trips")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsByDriver(int id)
        {
            var trips = await _tripService.GetTripsByDriverAsync(id);
            if (!trips.Any()) return NotFound("No trips found for this driver");
            return Ok(trips);
        }

        [HttpGet("long")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetLongTrips()
        {
            // Fetch trips where EndTime is not null and duration > 8 hours
            var longTrips = await _context.Trips
                .Where(t => t.EndTime != null &&
                            EF.Functions.DateDiffHour(t.StartTime, t.EndTime) > 8)
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .ToListAsync();

            return Ok(longTrips);
        }

        [HttpGet("drivers/{driverId}/summary")]
        public async Task<ActionResult<DriverTripSummary>> GetDriverTripSummary(int driverId)
        {
            var summary = await _tripService.GetDriverTripSummaryAsync(driverId);
            if (summary == null)
                return NotFound("No summary data found for this driver");

            return Ok(summary);
        }

        //  EAGER Loading Example
        [HttpGet("eager-demo")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsEager()
        {
            var trips = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
            return Ok(trips);
        }

        //  LAZY Loading Example
        [HttpGet("lazy-demo")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsLazy()
        {
            var trips = await _context.Trips.ToListAsync();  // No Include()

            // Just to trigger lazy loading
            foreach (var t in trips)
            {
                var driverName = t.Driver?.Name; // triggers separate query per trip
                var vehicleNo = t.Vehicle?.NumberPlate;
            }

            return Ok(trips);
        }

    }
}
