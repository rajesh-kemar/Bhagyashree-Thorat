using TravelApi.Models;

namespace TravelApi.Services
{
    public interface ITripService
    {
        Task<IEnumerable<Trip>> GetAllTripsAsync();
        Task<IEnumerable<Trip>> GetTripsByDriverAsync(int driverId);
        Task<Trip?> GetTripByIdAsync(int id);
        Task<Trip> CreateTripAsync(Trip trip);
        Task<bool> CompleteTripAsync(int id);
    }
}
