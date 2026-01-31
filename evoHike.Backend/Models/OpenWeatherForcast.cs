namespace evoHike.Backend.Models;

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