using evoHike.Backend.Models;

public class OpenWeatherForecastDto
{
    public CurrentWeather? current { get; set; }

    public HourlyWeather? hourly { get; set; }
    public bool IsValid()
    {
        return hourly?.IsValidForecast() ?? false;
    }
}