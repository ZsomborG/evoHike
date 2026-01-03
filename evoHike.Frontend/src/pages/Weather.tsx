import './App.css';

import { useOpenWeather } from '../hooks/useOpenWeather';

const getWeatherDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: 'Tiszta égbolt',
    1: 'Főként tiszta',
    2: 'Részben felhős',
    3: 'Borult',
    45: 'Köd',
    48: 'Zúzmarás köd',
    51: 'Szitálás: Könnyű',
    53: 'Szitálás: Mérsékelt',
    55: 'Szitálás: Sűrű',
    56: 'Ónos szitálás: Könnyű',
    57: 'Ónos szitálás: Sűrű',
    61: 'Eső: Gyenge',
    63: 'Eső: Mérsékelt',
    65: 'Eső: Erős',
    66: 'Ónos eső: Könnyű',
    67: 'Ónos eső: Erős',
    71: 'Havazás: Gyenge',
    73: 'Havazás: Mérsékelt',
    75: 'Havazás: Erős',
    77: 'Hódara',
    80: 'Zápor: Gyenge',
    81: 'Zápor: Mérsékelt',
    82: 'Zápor: Heves',
    85: 'Hózápor: Gyenge',
    86: 'Hózápor: Erős',
    95: 'Zivatar',
    96: 'Zivatar jégesővel (gyenge)',
    99: 'Zivatar jégesővel (erős)',
  };

  return descriptions[code] || 'Ismeretlen';
};

function Weather() {
  const { data: forecasts, loading, error, refetch } = useOpenWeather();

  if (loading)
    return <div className="container-style">Időjárás adatok betöltése...</div>;

  if (error) return <div className="error-message">Hiba: {error}</div>;

  if (!forecasts || forecasts.length === 0) {
    return <div className="error-message">Nincs elérhető időjárás adat</div>;
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>Időjárás előrejelzés</h2>

        <button className="my-button" onClick={refetch}>
          Frissítés
        </button>
      </div>

      <div className="table-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>Időpont</th>

              <th>Hőm.</th>

              <th>Hőérzet</th>

              <th>Szél</th>

              <th>Pára</th>

              <th>Csapadék</th>

              <th>Leírás</th>
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
                    ? getWeatherDescription(item.weatherCode)
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
