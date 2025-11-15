using TravelApi.Models;

namespace TravelApi.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();
        Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync();
        Task<IEnumerable<Vehicle>> GetBusyVehiclesAsync();
        Task<Vehicle> AddVehicleAsync(Vehicle vehicle);
        Task<Vehicle?> GetVehicleByIdAsync(int id);
        Task<bool> DeleteVehicleAsync(int id);

        Task<bool> MarkInactiveAsync(int id);
        Task<bool> MarkActiveAsync(int id);
    }
}
