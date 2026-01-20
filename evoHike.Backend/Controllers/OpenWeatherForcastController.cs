using evoHike.Backend.Models;
using evoHike.Backend.Services; 
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpenWeatherForecastController : ControllerBase
{
   
    private readonly WeatherService _weatherService;

    public OpenWeatherForecastController(WeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet(Name = "GetOpenWeatherForecast")]

    public async Task<ActionResult<List<OpenWeatherForecast>>> Get(string? city = null, float? lat = null, float? lon = null, int days = 1, int startHour = 0, int endHour = 24)
    {
        
        if (!string.IsNullOrEmpty(city))
        {
            return await _weatherService.GetWeatherForecastAsync(city, days, startHour, endHour);
        }

        if (lat.HasValue && lon.HasValue)
        {
            return await _weatherService.GetWeatherForecastAsync(lat.Value, lon.Value, days, startHour, endHour);
        }
        
        return BadRequest("Adj meg egy várost vagy koordinátákat!");
    }
}
