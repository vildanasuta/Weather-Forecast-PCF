import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import WeatherComponent from "../WeatherForecastComponent/WeatherComponent";

export class WeatherForecastComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _forecastData: any[] = [];

    constructor() {
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
        this._container = document.createElement('div');
        container.appendChild(this._container);
        const root = createRoot(this._container);
        this.fetchWeatherData().then((data) => {
            this._forecastData = data;
            this.renderWeatherComponent(root);
        });
    }

    /**
     * Render WeatherComponent
     */
    private renderWeatherComponent(root: any): void {
        root.render(
            React.createElement(WeatherComponent, { forecastData: this._forecastData })
        );
    }

    /**
     * Fetch weather data
     */
    private fetchWeatherData = async (): Promise<any[]> => {
        const cityName = 'London'; // Default city name
        const apiKey = "fa4bbd2f0856d97d3bd9894d1cd62bbe";
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                const data = await response.json();
                const filteredForecastData = data.list.filter((item: any) => {
                    return item.dt_txt.includes('12:00:00');
                });
                return filteredForecastData;
            }
        } catch (error) {
            console.error(`Error fetching weather forecast: ${error}`);
            return [];
        }
    };

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }
}
