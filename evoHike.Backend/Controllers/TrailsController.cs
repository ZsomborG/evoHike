using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrailsController(EvoHikeContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trail>>> GetTrails()
        {
            return await context.Trails.ToListAsync();
        }
    }
}