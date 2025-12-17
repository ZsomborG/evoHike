using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrailsController(ITrailService trailService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trail>>> GetTrails()
        {
            var trails = await trailService.GetAllTrailsAsync();

            return Ok(trails);
        }
    }
}