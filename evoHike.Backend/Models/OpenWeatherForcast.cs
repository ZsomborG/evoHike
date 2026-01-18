namespace evoHike.Backend.Models;
using System.Text.Json.Serialization;
using OpenMeteo.Weather;

public class OpenWeatherForecastDto
{
    public CurrentWeather? current { get; set; }

    public HourlyWeather? hourly { get; set; }
    public bool IsValid()
    {
        return hourly?.IsValidForecast() ?? false;
    }
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
    
    public bool IsValidForecast()
    {
        if (HourlyDateTime == null || HourlyTemperature == null || HourlyRelativeHumidity == null ||
            HourlyApparentTemperature == null || HourlyWindSpeed == null || HourlyPrecipitation == null ||
            HourlyWeatherCode == null)
        {
            return false;
        }

        int length = HourlyDateTime.Length;
        return HourlyTemperature.Length == length &&
               HourlyRelativeHumidity.Length == length &&
               HourlyApparentTemperature.Length == length &&
               HourlyWindSpeed.Length == length &&
               HourlyPrecipitation.Length == length &&
               HourlyWeatherCode.Length == length &&
               length > 0;
    }
    
    

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
    
    public static OpenWeatherForecast ToWeatherForecast(int index, DateTime forecastTime,OpenMeteo.Weather.Forecast.ResponseModel.WeatherForecast forecast)
    {
        
        return new OpenWeatherForecast
        {
            ForecastDatetime = forecastTime,
            TemperatureC = forecast.Hourly?.Temperature_2m![index],
            FeelsLikeC = forecast.Hourly?.Apparent_temperature![index],
            WindSpeed_ms = (int)forecast.Hourly?.Windspeed_10m![index]!,
            HumidityPercent = forecast.Hourly?.Relativehumidity_2m![index],
            Pop = forecast.Hourly?.Precipitation_probability![index],
            WeatherCode = forecast.Hourly?.Weathercode![index]
        };
    }
}