import '../App.css';

import { useOpenWeather } from '../hooks/useOpenWeather';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

const getWeatherDescription = (code: number, t: TFunction): string => {
  const val = t(`weatherCodes.${code}`, { defaultValue: 'Ismeretlen' });
  return typeof val === 'string' ? val : 'Ismeretlen';
};

function Weather() {
  const { data: forecasts, loading, error, refetch } = useOpenWeather();
  const { t } = useTranslation();

  if (loading)
    return <div className="container-style">Időjárás adatok betöltése...</div>;

  if (error) return <div className="error-message">Hiba: {error}</div>;

  if (!forecasts || forecasts.length === 0) {
    return <div className="error-message">Nincs elérhető időjárás adat</div>;
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>{t('weatherForecast')}</h2>

        <button className="my-button" onClick={refetch}>
          {t('refresh')}
        </button>
      </div>

      <div className="table-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>{t('weatherTime')}</th>

              <th>{t('weatherTemperature')}</th>

              <th>{t('weatherFeelsLike')}</th>

              <th>{t('weatherWind')}</th>

              <th>{t('weatherVapor')}</th>

              <th>{t('weatherPrecipitation')}</th>

              <th>{t('weatherDescription')}</th>
            </tr>
          </thead>

          <tbody>
            {forecasts.map((item, index) => (
              <tr key={index} className="weather-row">
                <td className="time-cell">
                  {item.forecastDatetime
                    ? new Date(item.forecastDatetime).toLocaleString('hu-HU', {
                        month: 'short',

                        day: 'numeric',

                        hour: '2-digit',

                        minute: '2-digit',
                      })
                    : 'N/A'}
                </td>

                <td className="temp-cell">
                  <span className="temp-value">
                    {item.temperatureC ?? 'N/A'}°C
                  </span>
                </td>

                <td className="feels-like-cell">
                  {item.feelsLikeC ?? 'N/A'}°C
                </td>

                <td className="wind-cell">{item.windSpeed_ms ?? 'N/A'} m/s</td>

                <td className="humidity-cell">
                  {item.humidityPercent ?? 'N/A'}%
                </td>

                <td className="precipitation-cell">
                  <div className="precipitation-bar">
                    <span className="pop-value">{item.pop ?? 'N/A'}%</span>

                    {item.pop > 0 && (
                      <div
                        className="pop-bar"
                        style={{ width: `${Math.min(item.pop, 100)}%` }}></div>
                    )}
                  </div>
                </td>

                <td className="description-cell">
                  {item.weatherCode !== undefined
                    ? getWeatherDescription(item.weatherCode, t)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Weather;
