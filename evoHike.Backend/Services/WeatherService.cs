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

        if (response?.hourly != null && response.hourly.HourlyDateTime != null)
        {
            for (int i = 0; i < response.hourly.HourlyDateTime.Length; i++)
            {
                DateTime apiTime = DateTime.Parse(response.hourly.HourlyDateTime[i]);
                if (apiTime >= now)
                {
                    var weatherItem = new OpenWeatherForecast
                    {
                        ForecastDatetime = apiTime,
                        TemperatureC = response.hourly.HourlyTemperature![i],
                        FeelsLikeC = response.hourly.HourlyApparentTemperature![i],
                        WindSpeed_ms = (int)response.hourly.HourlyWindSpeed![i],
                        HumidityPercent = response.hourly.HourlyRelativeHumidity![i],
                        Pop = response.hourly.HourlyPrecipitation![i],
                    };
                    
                    forecast.Add(weatherItem);
                }
            }
        }
            
        return forecast;
    }
}