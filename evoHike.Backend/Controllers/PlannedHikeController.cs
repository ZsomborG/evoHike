using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlannedHikesController(IPlannedHikeService _plannedHikeService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlannedHikeEntity>>> GetPlannedHikes()
        {
            try
            {
                var hikes = await _plannedHikeService.GetAllPlannedHikesAsync();
                return Ok(hikes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<PlannedHikeEntity>> PlanHike(PlannedHikeEntity plannedHike)
        {
            try
            {
                if (plannedHike.HikingTrailId == 0)
                {
                    return BadRequest("HikingTrailId is required.");
                }

                var createdHike = await _plannedHikeService.CreatePlannedHikeAsync(plannedHike);

                return CreatedAtAction(nameof(GetPlannedHikes), new { id = createdHike.Id }, createdHike);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(int id)
        {
            try
            {
                var isSuccess = await _plannedHikeService.MarkHikeAsCompletedAsync(id);

                if (!isSuccess)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}