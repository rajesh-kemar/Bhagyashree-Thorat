using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using TravelApi.Data;
using TravelApi.Models;

namespace TravelApi.Services
{
    public class TripService : ITripService
    {
        private readonly TravelContext _context;

        public TripService(TravelContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trip>> GetAllTripsAsync()
        {
            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        public async Task<Trip?> GetTripByIdAsync(int id)
        {
            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);
        }

        public async Task<IEnumerable<Trip>> GetTripsByDriverAsync(int driverId)
        {
            return await _context.Trips
                .Where(t => t.DriverId == driverId)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        public async Task<Trip> CreateTripAsync(Trip trip)
        {
            // 🔹 Get driver and vehicle from DB
            var driver = await _context.Drivers.FindAsync(trip.DriverId);
            var vehicle = await _context.Vehicles.FindAsync(trip.VehicleId);

            if (driver == null)
                throw new InvalidOperationException("Invalid driver ID.");

            if (vehicle == null)
                throw new InvalidOperationException("Invalid vehicle ID.");

            // 🔹 Mark them as Busy
            driver.Status = "Busy";
            vehicle.Status = "Busy";

            // 🔹 Initialize trip fields
            trip.StartTime = DateTime.Now;
            trip.Status = "InProgress";

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return trip;
        }

        public async Task<bool> CompleteTripAsync(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return false;

            // 🔹 Mark trip completed
            trip.Status = "Completed";
            trip.EndTime = DateTime.Now;

            // 🔹 Free up driver and vehicle
            if (trip.Driver != null)
                trip.Driver.Status = "Available";

            if (trip.Vehicle != null)
                trip.Vehicle.Status = "Available";

            //This will add safety so we never accidentally overwrite time:
            if (trip.EndTime == null)
                trip.EndTime = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DriverTripSummary?> GetDriverTripSummaryAsync(int driverId)
        {
            var result = await _context.DriverTripSummaries
                .FromSqlRaw("EXEC GetDriverTripSummary @DriverId = {0}", driverId)
                .AsNoTracking()
                .ToListAsync();

            return result.FirstOrDefault();
        }


    }
}
