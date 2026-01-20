using OpenMeteo.Weather.Forecast.ResponseModel;

namespace evoHike.Backend.Models;
using System.Text.Json.Serialization;
using OpenMeteoWeatherForecast = OpenMeteo.Weather.Forecast.ResponseModel.WeatherForecast;

public class OpenWeatherForecastDto
{
    public CurrentWeather? current { get; set; }

    public HourlyWeather? hourly { get; set; }
    //public bool IsValid()
    //{
    //   return hourly?.IsValidForecast() ?? false;
    //}
    
}

public class CurrentWeather
{
    public string? DateTime { get; set; }
    public string? currentTemperature { get; set; }
 }

 public class HourlyWeather
 {
    [JsonPropertyName("time")]
    public string[]? HourlyDateTime { get; set; }
    [JsonPropertyName("temperature_2m")]
    public double[]? HourlyTemperature { get; set; }
    [JsonPropertyName("relative_humidity_2m")]
    public int[]? HourlyRelativeHumidity { get; set; }
    [JsonPropertyName("apparent_temperature")]
    public double[]? HourlyApparentTemperature { get; set; }
    [JsonPropertyName("wind_speed_10m")]
    public double[]? HourlyWindSpeed { get; set; }
    [JsonPropertyName("precipitation_probability")]
    public double[]? HourlyPrecipitation { get; set; }
    [JsonPropertyName("weather_code")]
    public int[]? HourlyWeatherCode { get; set; }
    

 }

public class OpenWeatherForecast
{
    public DateTime? ForecastDatetime { get; set; }
    public double? TemperatureC { get; set; }
    public double? FeelsLikeC { get; set; }
    public int? WindSpeed_ms { get; set; }
    public int? HumidityPercent { get; set; }
    public double? Pop { get; set; } 
    public int? WeatherCode { get; set; }
    
    public static OpenWeatherForecast ToWeatherForecast(int index, DateTime forecastTime,OpenMeteoWeatherForecast forecast)
    {
        
        return new OpenWeatherForecast
        {
            ForecastDatetime = forecastTime,
            TemperatureC = forecast.Hourly?.Temperature_2m![index], // a 2m jelen esetben azt jelenti, hogy a talajtól lévő magasságába mennyi a C fok 
            FeelsLikeC = forecast.Hourly?.Apparent_temperature![index],
            WindSpeed_ms = (int)forecast.Hourly?.Windspeed_10m![index]!,
            HumidityPercent = forecast.Hourly?.Relativehumidity_2m![index],
            Pop = forecast.Hourly?.Precipitation_probability![index],
            WeatherCode = forecast.Hourly?.Weathercode![index]
        };
    }
    public static bool IsValidForecast(OpenMeteoWeatherForecast forecast)
    {
        if (forecast.Hourly == null )
        {
            return false;
        }

        if (forecast.Hourly.Temperature_2m == null ||forecast.Hourly.Apparent_temperature == null ||forecast.Hourly.Windspeed_10m == null || forecast.Hourly.Relativehumidity_2m == null || forecast.Hourly.Precipitation_probability == null || forecast.Hourly.Weathercode == null)
        {
            return false;
        }

        int count = forecast.Hourly.Time.Length;
        if (count == 0)
        {
            return false;
        }
        bool lengthsAreOk = 
            forecast.Hourly.Temperature_2m.Length == count &&
            forecast.Hourly.Relativehumidity_2m.Length == count &&
            forecast.Hourly.Apparent_temperature.Length == count &&
            forecast.Hourly.Windspeed_10m.Length == count &&
            forecast.Hourly.Precipitation_probability.Length == count &&
            forecast.Hourly.Weathercode.Length == count;

        return lengthsAreOk;
    }


}