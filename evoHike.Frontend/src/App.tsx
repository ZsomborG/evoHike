import './App.css';
import type { WeatherForecast } from './types/api';
import { useApi } from './hooks/useApi';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useTranslation } from 'react-i18next';

function App() {
  const {
    data: forecasts,
    loading,
    error,
    refetch,
  } = useApi<WeatherForecast[]>('/api/weatherforecast', { manual: true });
  const { t } = useTranslation();
  return (
    <div className="App">
      <h1>Weather Forecast from C# Backend</h1>
      <Button onClick={refetch}>{t('clickHere')}</Button>
      {loading && <LoadingSpinner />}
      {!loading && error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && Array.isArray(forecasts) && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp. (C)</th>
              <th>Temp. (F)</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((forecasts) => (
              <tr key={forecasts.date}>
                <td>{new Date(forecasts.date).toLocaleDateString()}</td>
                <td>{forecasts.temperatureC}</td>
                <td>{forecasts.temperatureF}</td>
                <td>{forecasts.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default App;
