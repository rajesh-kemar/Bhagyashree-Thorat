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

        public async Task<IEnumerable<Vehicle>> GetBusyVehiclesAsync()
        {
            return await _context.Vehicles
                .Where(v => v.Status == "Busy")
                .ToListAsync();
        }

        public async Task<Vehicle> AddVehicleAsync(Vehicle vehicle)
        {
            // Ensure default status
            vehicle.Status = "Available";

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }


        public async Task<Vehicle?> GetVehicleByIdAsync(int id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return false;

            // ✅ Instead of deleting, mark inactive
            vehicle.Status = "Inactive";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkInactiveAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null || vehicle.Status == "Busy")
                return false; // Prevent disabling busy vehicles

            vehicle.Status = "Inactive";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkActiveAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return false;

            vehicle.Status = "Available";
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
