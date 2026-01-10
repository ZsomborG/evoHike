namespace evoHike.Backend.Services;
using evoHike.Backend.Models;
using System.Net.Http.Json;

public class WeatherService
{
    private readonly HttpClient _httpClient;

    public WeatherService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<OpenWeatherForecast>> GetWeatherForecastAsync()
    {
    
        string url = "https://api.open-meteo.com/v1/forecast?latitude=48.1031&longitude=20.7781&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability,weather_code&forecast_days=1";

        var response = await _httpClient.GetFromJsonAsync<OpenWeatherForecastDto>(url);
        
        var forecast = new List<OpenWeatherForecast>();
        var now = DateTime.Now; 

        if (response == null || !response.IsValid())
        {
            return new List<OpenWeatherForecast>();
        }
        {
            var hourlyData = response.hourly!;

            for (int i = 0; i < hourlyData.HourlyDateTime!.Length; i++)
            {
                DateTime apiTime = DateTime.Parse(hourlyData.HourlyDateTime[i]);
                if (apiTime >= now)
                {
                    forecast.Add(hourlyData.ToWeatherForecast(i, apiTime));
                }
            }
        }
        return forecast;
    }
}