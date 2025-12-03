import './App.css';
import { Routes, Route } from 'react-router-dom';
import type { WeatherForecast } from './types/api';
import { useApi } from './hooks/useApi';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Weather from './Weather';

function App() {
  const {
    data: forecasts,
    loading,
    error,
    refetch,
  } = useApi<WeatherForecast[]>('/api/weatherforecast', { manual: true });

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Weather Forecast from C# Backend</h1>
              <Button onClick={refetch}>Click Here</Button>
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
                    {forecasts.map((forecast) => (
                      <tr key={forecast.date}>
                        <td>{new Date(forecast.date).toLocaleDateString()}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          }
        />
        <Route path="/weather" element={<Weather />} />
        <Route path="/routeplan" element={<div>Tervezés oldal</div>} />
        <Route path="/journal" element={<div>Túranapló oldal</div>} />
        <Route path="/social" element={<div>Közösség oldal</div>} />
        <Route path="/contact" element={<div>Kapcsolat oldal</div>} />
      </Routes>
    </div>
  );
}

export default App;
