namespace evoHike.Backend.Models;
using System.Text.Json.Serialization;

public class OpenWeatherForecastDto
{
    public CurrentWeather? current { get; set; }

    public HourlyWeather? hourly { get; set; }
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

 }

public class OpenWeatherForecast
{
    public DateTime? ForecastDatetime { get; set; }
    public double? TemperatureC { get; set; }
    public double? FeelsLikeC { get; set; }

    public int? WindSpeed_ms { get; set; }
    public int? HumidityPercent { get; set; }
    public double? Pop { get; set; } 
}