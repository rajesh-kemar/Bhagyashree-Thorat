using Microsoft.EntityFrameworkCore;
using TravelApi.Data;
using TravelApi.Models;

namespace TravelApi.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly TravelContext _context;

        public VehicleService(TravelContext context)
        {
            _context = context;
        }

        // Return all vehicles
        public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // Return available (not in active trips)
        public async Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync()
        {
            var activeVehicleIds = await _context.Trips
                .Where(t => t.Status == "InProgress")
                .Select(t => t.VehicleId)
                .ToListAsync();

            return await _context.Vehicles
                .Where(v => !activeVehicleIds.Contains(v.VehicleId))
                .ToListAsync();
        }
    }
}
