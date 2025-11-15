using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApi.Data;
using TravelApi.Models;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _driverService;
        private readonly TravelContext _context;

        public DriversController(IDriverService driverService, TravelContext context)
        {
            _driverService = driverService; 
            _context = context; ;

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

        // use service method instead of _context
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

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteDriver(int id)
        //{
        //    var success = await _driverService.DeleteDriverAsync(id);
        //    if (!success)
        //        return NotFound();

        //    return NoContent();
        //}

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetDriverByUserId(string userId)
        {
            var driver = await _context.Drivers
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (driver == null)
                return NotFound("Driver not found");

            return Ok(driver); // Return full driver details now
        }


        [HttpGet("busy")]
        public async Task<ActionResult<IEnumerable<Driver>>> GetBusyDrivers()
        {
            var busyDrivers = await _driverService.GetBusyDriversAsync();
            return Ok(busyDrivers);
        }

        [HttpPut("{id}/inactive")]
        public async Task<IActionResult> SetDriverInactive(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return NotFound();

            if (driver.Status == "Busy")
                return BadRequest("Cannot set inactive while driver is on a trip.");

            driver.Status = "Inactive";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/active")]
        public async Task<IActionResult> SetDriverActive(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return NotFound();

            driver.Status = "Available";
            await _context.SaveChangesAsync();
            return NoContent();
        }



    }
}
