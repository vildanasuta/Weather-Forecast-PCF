import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './WeatherComponent.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

const WeatherComponent: React.FC = () => {
    const [cityName, setCityName] = React.useState<string>('London');
    const [forecastData, setForecastData] = React.useState<any[]>([]);
    const [cityNameAfterSearch, setCityNameAfterSearch] = React.useState<string>('London');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const fetchWeatherForecast = async () => {
        const apiKey = "fa4bbd2f0856d97d3bd9894d1cd62bbe";
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else {
                const data = await response.json();
                const filteredForecastData = data.list.filter((item: any) => {
                    // Since API endpoints return objects for 5 days each 3 hours as weather forecast
                    // I'm taking only data from noon (12:00:00) to make sure I have one forecast display
                    // for each of 5 days
                    return item.dt_txt.includes('12:00:00');
                });
                setForecastData(filteredForecastData);
                setCityNameAfterSearch(cityName);
            }
        } catch (error) {
            console.error(`Error fetching weather forecast: ${error}`);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        fetchWeatherForecast();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCityName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchWeatherForecast();
    };

    return (
        <div id="parentDiv">
            <h1 id="title">Weather Forecast App</h1>
            <form onSubmit={handleSubmit} id="form">
                <input type="text" value={cityName} onChange={handleInputChange} placeholder="Enter city name" id="searchField" />
                <Button variant="contained" type="submit" id="searchButton">Search</Button>
            </form>
            <h4 id="cityNameTitle">5 DAYS FORECAST FOR {cityNameAfterSearch.toUpperCase()}</h4>
            <div className="weather-component">
                {forecastData.map((dayForecast, index) => (
                    <Card key={index} id="card">
                        <React.Fragment>
                            <CardContent>
                                <div className="forecast-item">
                                    <p className="day-of-week">{new Date(dayForecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                    <p className="date">{new Date(dayForecast.dt * 1000).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                    <img
                                        src={dayForecast.weather[0]?.icon ? `http://openweathermap.org/img/wn/${dayForecast.weather[0].icon}.png` : ''}
                                        alt="Weather icon"
                                        className="weather-icon"
                                    />
                                    <p className="temperature">
                                        <span>{typeof dayForecast.main.temp === 'number' ? (dayForecast.main.temp - 273.15).toFixed(0) : 'N/A'}</span> °C
                                    </p>
                                    <p className="weather-description">{dayForecast.weather[0].description}</p>
                                </div>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                ))}
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="City not found. Please check your input."
            />
        </div>
    );
};

export default WeatherComponent;
