using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface IWeatherService
    {
        Task<List<WeatherForecast>> GetWeatherForecastAsync();

        Task<string> GetWeatherInfoForDateAsync(DateTime date);
    }
}