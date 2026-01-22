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
        public async Task<ActionResult<IEnumerable<TrailDto>>> GetTrails()
        {
            try
            {
                var trails = await _trailService.GetAllTrailsAsync();
                var trailDtos = trails.Select(t => new TrailDto(t));

                return Ok(trailDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/pois")]
        public async Task<ActionResult<IEnumerable<PoiDto>>> GetNearbyPois(
            int id,
            [FromQuery] double distance = 1000)
        {
            try
            {
                var nearbyPois = await _trailService.GetPoisNearTrailAsync(id, distance);
                var poiDtos = nearbyPois.Select(p => new PoiDto(p));
                return Ok(poiDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}