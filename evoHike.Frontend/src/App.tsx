import { useState, useEffect } from 'react';
import './App.css';

type WeatherForecast = {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
};

function App() {
    const [forecasts, setForecasts] = useState<WeatherForecast[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7275/weatherforecast');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: WeatherForecast[] = await response.json();
                setForecasts(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <h1>Weather Forecast from C# Backend</h1>
            {loading && <p>Loading data from API...</p>}
            {error && <p>Error fetching data: {error}</p>}
            {forecasts && (
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