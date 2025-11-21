using Microsoft.EntityFrameworkCore;
using TravelApi.Data;
using TravelApi.Models;

namespace TravelApi.Services
{
    public class DriverService : IDriverService
    {
        private readonly TravelContext _context;

        public DriverService(TravelContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Driver>> GetAllDriversAsync()
        {
            return await _context.Drivers.ToListAsync();
        }

        public async Task<Driver?> GetDriverByIdAsync(int id)
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .FirstOrDefaultAsync(d => d.DriverId == id);
        }

        public async Task<IEnumerable<Driver>> GetAvailableDriversAsync()
        {
            return await _context.Drivers
                .Where(d => d.Status == "Available")
                .ToListAsync();
        }


        public async Task<Driver> AddDriverAsync(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            return driver;
        }

        public async Task<bool> UpdateDriverAsync(int id, Driver updatedDriver)
        {
            if (id != updatedDriver.DriverId)
                return false;

            _context.Entry(updatedDriver).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDriverAsync(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return false;

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Driver>> GetBusyDriversAsync()
        {
            return await _context.Drivers
                .Where(d => d.Status == "Busy")
                .ToListAsync();
        }


    }
}
