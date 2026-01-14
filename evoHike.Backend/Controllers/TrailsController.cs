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
                
                var trailDtos = trails.Select(t => new TrailDto
                {
                    Id = t.TrailID.ToString(),
                    Name = t.TrailName,
                    Location = !string.IsNullOrEmpty(t.StartLocation) 
                        ? $"{t.StartLocation} - {t.EndLocation}" 
                        : t.StartLocation,
                    Length = t.Length,
                    Difficulty = t.Difficulty,
                    ElevationGain = t.Elevation,
                    Rating = t.Rating,
                    ReviewCount = t.ReviewCount,
                    EstimatedDuration = t.EstimatedDuration,
                    CoverPhotoPath = t.CoverPhotoPath ?? "",
                    RouteLine = t.RouteLine
                });

                return Ok(trailDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/pois")]
        public async Task<ActionResult<IEnumerable<PoiDto>>> GetNearbyPois(int id, [FromQuery] double distance = 1000)
        {
            try
            {
                var pois = await _trailService.GetPoisNearTrailAsync(id, distance);
                var dtos = pois.Select(p => new PoiDto
                {
                    Id = p.POIID,
                    Name = p.POIName,
                    Type = p.POIType,
                    Location = p.Location
                });
                return Ok(dtos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}