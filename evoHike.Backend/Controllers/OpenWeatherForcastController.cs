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

    public async Task<List<OpenWeatherForecast>> Get()
    {
        return await _weatherService.GetWeatherForecastAsync("Eger",3);
    }
}
