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

    public async Task<List<OpenWeatherForecast>> GetWeatherForecastAsync(string cityName, int forecastDays)
    {
        var geoOption = new GeocodingOptions(cityName) ; // itt hoz létre egy geoption nevu Geocoding Options peldanyt
        var geoResult = await _client.GetLocationDataAsync(geoOption);

        var location = geoResult.Locations[0]; // azért nulla mert a legpontosabb egyezés kell

        var weatherOption = new WeatherForecastOptions
        {
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            
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
        
        var forecast = new List<OpenWeatherForecast>();
        var now = DateTime.Now;

        if (response?.Hourly?.Time == null) 
        {
            return new List<OpenWeatherForecast>();
        }

        for (int i = 0; i < response.Hourly.Time.Length; i++)
        {
         
            DateTime apiTime = response.Hourly.Time[i].DateTime;

            
            if (apiTime >= now)
            {
                var item = OpenWeatherForecast.ToWeatherForecast(i, apiTime, response);
                forecast.Add(item);
            }
        }
        
        return forecast;
    }
}