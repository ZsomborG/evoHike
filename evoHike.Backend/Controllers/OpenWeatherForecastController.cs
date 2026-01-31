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

    [HttpGet("coords")]

    public async Task<ActionResult<List<OpenWeatherForecast>>> GetByCoords(float lat, float lon, int days = 1, int startHour = 0, int endHour = 24)
    {
        return await _weatherService.GetWeatherForecastAsync(lat, lon, days, startHour, endHour);
    }

    [HttpGet("city")]

    public async Task<ActionResult<List<OpenWeatherForecast>>> GetByCity(string city, int days = 1, int startHour = 0, int endHour = 24)
    {
        return await _weatherService.GetWeatherForecastAsync(city, days, startHour, endHour);
    }

}   
