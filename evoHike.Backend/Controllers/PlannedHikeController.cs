using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlannedHikesController(EvoHikeContext _context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlannedHike>>> GetPlannedHikes()
        {
            return await _context.PlannedHikes
                .Include(ph => ph.Route)
                .OrderBy(ph => ph.PlannedStartDateTime)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<PlannedHike>> PlanHike(PlannedHike plannedHike)
        {
            if (plannedHike.RouteId == Guid.Empty)
            {
                return BadRequest("RouteId is required.");
            }

            plannedHike.Status = HikeStatus.Planned;
            _context.PlannedHikes.Add(plannedHike);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPlannedHikes), new { id = plannedHike.Id }, plannedHike);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(Guid id)
        {
            var hike = await _context.PlannedHikes.FindAsync(id);
            if (hike == null)
            {
                return NotFound();
            }

            hike.Status = HikeStatus.Completed;
            hike.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}