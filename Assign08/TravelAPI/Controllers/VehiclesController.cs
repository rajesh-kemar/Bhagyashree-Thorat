using Microsoft.AspNetCore.Mvc;
using TravelApi.Models;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // GET: api/vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAllVehicles()
        {
            var vehicles = await _vehicleService.GetAllVehiclesAsync();
            return Ok(vehicles);
        }

        // GET: api/vehicles/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAvailableVehicles()
        {
            var vehicles = await _vehicleService.GetAvailableVehiclesAsync();
            return Ok(vehicles);
        }


        [HttpGet("busy")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetBusyVehicles()
        {
            var busyVehicles = await _vehicleService.GetBusyVehiclesAsync();
            return Ok(busyVehicles);
        }


        [HttpPost]
        public async Task<IActionResult> AddVehicle([FromBody] Vehicle vehicle)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdVehicle = await _vehicleService.AddVehicleAsync(vehicle);
            return Ok(createdVehicle);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);

            if (vehicle == null)
                return NotFound();

            await _vehicleService.DeleteVehicleAsync(id);
            return NoContent();
        }

        [HttpPut("{id}/inactive")]
        public async Task<IActionResult> MarkInactive(int id)
        {
            var result = await _vehicleService.MarkInactiveAsync(id);
            if (!result)
                return BadRequest("Vehicle cannot be marked inactive (it may be Busy)");
            return Ok(new { message = "Vehicle marked as Inactive" });
        }

        [HttpPut("{id}/active")]
        public async Task<IActionResult> MarkActive(int id)
        {
            var result = await _vehicleService.MarkActiveAsync(id);
            if (!result)
                return NotFound("Vehicle not found");
            return Ok(new { message = "Vehicle marked as Active" });
        }



    }
}
