using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrailsController(ITrailService _trailService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteEntity>>> GetTrails()
        {
            try
            {
                var trails = await _trailService.GetAllTrailsAsync();
                return Ok(trails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}