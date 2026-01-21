namespace evoHike.Backend.Models;
using OpenMeteoSDK  = OpenMeteo.Weather.Forecast.ResponseModel.WeatherForecast;

public class OpenWeatherForecastResponse
{
    private OpenMeteoSDK _openMeteoSDK;

    public OpenWeatherForecastResponse(OpenMeteoSDK openMeteoSDK)
    {
        _openMeteoSDK = openMeteoSDK;
    }
    public bool IsValidForecast()
    {
        if (_openMeteoSDK.Hourly == null )
        {
            return false;
        }

        if (_openMeteoSDK.Hourly.Temperature_2m == null ||_openMeteoSDK.Hourly.Apparent_temperature == null || _openMeteoSDK.Hourly.Windspeed_10m == null || _openMeteoSDK.Hourly.Relativehumidity_2m == null || _openMeteoSDK.Hourly.Precipitation_probability == null || _openMeteoSDK.Hourly.Weathercode == null)
        {
            return false;
        }

        int count = _openMeteoSDK.Hourly.Time.Length;
        if (count == 0)
        {
            return false;
        }
        bool lengthsAreOk = 
            _openMeteoSDK.Hourly.Temperature_2m.Length == count &&
            _openMeteoSDK.Hourly.Relativehumidity_2m.Length == count &&
            _openMeteoSDK.Hourly.Apparent_temperature.Length == count &&
            _openMeteoSDK.Hourly.Windspeed_10m.Length == count &&
            _openMeteoSDK.Hourly.Precipitation_probability.Length == count &&
            _openMeteoSDK.Hourly.Weathercode.Length == count;

        return lengthsAreOk;
    }

    public OpenWeatherForecast ToWeatherForecast(DateTime apiTime, int index)
    {
        return new OpenWeatherForecast
        {
            ForecastDatetime = apiTime,
            TemperatureC = _openMeteoSDK.Hourly?.Temperature_2m![index],
            FeelsLikeC = _openMeteoSDK.Hourly?.Apparent_temperature![index],
            WindSpeed_ms = (int)_openMeteoSDK.Hourly?.Windspeed_10m![index],
            HumidityPercent = _openMeteoSDK.Hourly?.Relativehumidity_2m![index],
            Pop = _openMeteoSDK.Hourly?.Precipitation_probability![index],
            WeatherCode = _openMeteoSDK.Hourly?.Weathercode![index]
        };
    }
}