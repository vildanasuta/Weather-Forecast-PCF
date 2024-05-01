import * as React from 'react';
import { Text, Image, Stack } from '@fluentui/react';
import { Card, CardPreview } from "@fluentui/react-card";
import './WeatherComponent.css';

interface WeatherComponentProps {
    forecastData: any[];
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ forecastData }) => {
    return (
        <div id="parentDiv">
            <h1 id="title">Weather Forecast App</h1>
            <h4 id="cityNameTitle">5 DAYS FORECAST FOR LONDON</h4>
            <div className="weather-component">
                {forecastData.map((dayForecast, index) => (
                    <Card key={index} id="card">
                        <CardPreview>
                            <Text id="day-of-week">{new Date(dayForecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</Text>
                            <Text id="date">{new Date(dayForecast.dt * 1000).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                            <Image src={dayForecast.weather[0]?.icon ? `http://openweathermap.org/img/wn/${dayForecast.weather[0].icon}.png` : ''} alt="Weather icon" id="weather-icon" />
                            <Text id="temperature">{typeof dayForecast.main.temp === 'number' ? (dayForecast.main.temp - 273.15).toFixed(0) : 'N/A'} °C</Text>
                            <Text id="weather-description">{dayForecast.weather[0].description}</Text>
                        </CardPreview>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WeatherComponent;
