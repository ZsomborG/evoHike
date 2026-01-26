namespace evoHike.Backend.Models;
using System.Text.Json.Serialization;

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
    
    public OpenWeatherForecast ToWeatherForecast(int index, DateTime forecastTime)
    {
        return new OpenWeatherForecast
        {
            ForecastDatetime = forecastTime,
            TemperatureC = HourlyTemperature![index],
            FeelsLikeC = HourlyApparentTemperature![index],
            WindSpeed_ms = (int)HourlyWindSpeed![index],
            HumidityPercent = HourlyRelativeHumidity![index],
            Pop = HourlyPrecipitation![index],
            WeatherCode = (int)HourlyWeatherCode![index]
        };
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
}