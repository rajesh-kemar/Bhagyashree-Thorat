using Microsoft.AspNetCore.Mvc;
using TravelApi.Models;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriversController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Driver>>> GetDrivers()
        {
            var drivers = await _driverService.GetAllDriversAsync();
            return Ok(drivers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriver(int id)
        {
            var driver = await _driverService.GetDriverByIdAsync(id);
            if (driver == null)
                return NotFound();

            return Ok(driver);
        }

        // ✅ FIXED: use service method instead of _context
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Driver>>> GetAvailableDrivers()
        {
            var availableDrivers = await _driverService.GetAvailableDriversAsync();
            return Ok(availableDrivers);
        }

        [HttpPost]
        public async Task<ActionResult<Driver>> AddDriver(Driver driver)
        {
            var created = await _driverService.AddDriverAsync(driver);
            return CreatedAtAction(nameof(GetDriver), new { id = created.DriverId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, Driver updatedDriver)
        {
            var success = await _driverService.UpdateDriverAsync(id, updatedDriver);
            if (!success)
                return BadRequest();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var success = await _driverService.DeleteDriverAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
