import { useState } from 'react';
import './App.css';
import Button from './components/Button'
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

type WeatherForecast = {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
};

function App() {
    const [forecasts, setForecasts] = useState<WeatherForecast[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        setForecasts(null);
        const start = Date.now();

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/weatherforecast`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data: WeatherForecast[] = await response.json();
            setForecasts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 2000 - elapsed);
            if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

            setLoading(false);
        }
    };
    return (
        <div className="App">
            <h1>Weather Forecast from C# Backend</h1>
            <Button onClick={()=>handleClick()}>Click Here</Button>
            {loading && <LoadingSpinner/>}
            {!loading && error && (
                <ErrorMessage>{error}</ErrorMessage>
            )}

            {!loading && forecasts && (
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
        </div>
    );
}
export default App;