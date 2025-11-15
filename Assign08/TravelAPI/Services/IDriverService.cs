using TravelApi.Models;

namespace TravelApi.Services
{
    public interface IDriverService
    {
        Task<IEnumerable<Driver>> GetAllDriversAsync();
        Task<Driver?> GetDriverByIdAsync(int id);
        Task<IEnumerable<Driver>> GetAvailableDriversAsync();
        Task<Driver> AddDriverAsync(Driver driver);
        Task<bool> UpdateDriverAsync(int id, Driver updatedDriver);
        Task<bool> DeleteDriverAsync(int id);
        Task<IEnumerable<Driver>> GetBusyDriversAsync();


    }
}
