using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlannedHikesController(IPlannedHikeService _plannedHikeService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlannedHikeEntity>>> GetPlannedHikes([FromQuery] HikeStatus? status)
        {
            try
            {
                var hikes = await _plannedHikeService.GetAllPlannedHikesAsync(status);
                return Ok(hikes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("checklist-options")]
        public ActionResult<List<string>> GetChecklistOptions()
        {
            return Ok(ChecklistData.StandardItems);
        }

        [HttpPost]
        public async Task<ActionResult<PlannedHikeEntity>> PlanHike([FromBody] PlanHikeRequest request)
        {
            try
            {
                if (request.RouteId == 0)
                {
                    return BadRequest("RouteId is required.");
                }

                var createdHike = await _plannedHikeService.CreatePlannedHikeAsync(request);

                return CreatedAtAction(nameof(GetPlannedHikes), new { id = createdHike.Id }, createdHike);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
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