using TravelApi.Models;

namespace TravelApi.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();
        Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync();
    }
}
