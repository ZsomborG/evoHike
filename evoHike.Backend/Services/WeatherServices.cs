using System.Runtime.InteropServices.JavaScript;
using OpenMeteo.Geocoding;
using OpenMeteo.Weather.Forecast.Options;

namespace evoHike.Backend.Services;
using evoHike.Backend.Models;
using OpenMeteo;

public class WeatherService
{
    private readonly OpenMeteoClient _client;

    public WeatherService(OpenMeteoClient client)
    {
        _client = client;
    }

    public async Task<List<OpenWeatherForecast>> GetWeatherForecastAsync(string cityName, int forecastDays , int startHour , int endHour ) //város alapján 
    {
        var geoOption = new GeocodingOptions(cityName) ; // 
        var geoResult = await _client.GetLocationDataAsync(geoOption);

        var location = geoResult.Locations[0]; // azért nulla mert a legpontosabb egyezés kell

        return await GetWeatherForecastAsync(location.Latitude, location.Longitude, forecastDays, startHour, endHour);
    }

    public async Task<List<OpenWeatherForecast>> GetWeatherForecastAsync(float lat, float longl, int forecastDays, // szél és hossz alapján
        int startHour, int endHour)
    {
        var weatherOption = new WeatherForecastOptions
        {
            Latitude = lat,
            Longitude = longl,
            
            Start_date = DateOnly.FromDateTime(DateTime.Now),
            End_date = DateOnly.FromDateTime(DateTime.Now.AddDays(forecastDays)),
            
            Hourly = new HourlyOptions
            {
                HourlyOptionsParameter.temperature_2m,
                HourlyOptionsParameter.relativehumidity_2m,
                HourlyOptionsParameter.apparent_temperature,
                HourlyOptionsParameter.windspeed_10m,
                HourlyOptionsParameter.precipitation_probability,
                HourlyOptionsParameter.weathercode
            }
                
        };

        var response = await _client.QueryWeatherApiAsync(weatherOption);
        
        var validator = new OpenWeatherForecastResponse(response);

        if (!validator.IsValidForecast())
        {
            return null;
        }
        var forecast = new List<OpenWeatherForecast>();

        for (int i = 0; i < response.Hourly.Time.Length; i++)
        {
         
            DateTime apiTime = response.Hourly.Time[i].DateTime; 

            
            if (apiTime.Hour >= startHour && apiTime.Hour <= endHour)
            {
                forecast.Add(validator.ToWeatherForecast(apiTime,i));
            }
            
        }
        
        return forecast;
    }
}