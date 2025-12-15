export interface OpenWeatherForecast {
  forecastDatetime: string;
  weatherCode: number;
  temperatureC: number;
  feelsLikeC: number;
  windSpeed_ms: number;
  humidityPercent: number;
  pop: number;
}
