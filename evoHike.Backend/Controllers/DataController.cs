using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController(
        DataImportService _importService,
        IWebHostEnvironment _env
    ) : ControllerBase
    {
        [HttpPost("import")]
        public async Task<IActionResult> ImportData()
        {
            var trailsPath = Path.Combine(_env.ContentRootPath,
                "Data",
                "split_trails");
            var poisPath = Path.Combine(_env.ContentRootPath,
                "Data",
                "bukk_pois.geojson");

            var trailReport = await _importService.ImportTrailsAsync(trailsPath);
            var poiReport = await _importService.ImportPoisAsync(poisPath);

            return Ok(new
            {
                TrailImport = trailReport,
                PoiImport = poiReport
            });
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearData(
            [FromServices] evoHike.Backend.Data.EvoHikeContext db)
        {
            db.HikingTrails.RemoveRange(db.HikingTrails);
            db.PointsOfInterest.RemoveRange(db.PointsOfInterest);
            await db.SaveChangesAsync();
            return Ok("Database cleared.");
        }
    }
}