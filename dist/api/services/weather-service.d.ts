export interface WeatherForecast {
    date: string;
    location: string;
    temperature: {
        min: number;
        max: number;
        current: number;
    };
    conditions: string;
    precipitation_chance: number;
    wind_speed: number;
    maintenance_suitable: boolean;
    notes: string;
}
export interface WeatherRecommendation {
    date: string;
    suitable: boolean;
    reason: string;
    alternative_dates?: string[];
}
/**
 * Mock Weather Service for demo purposes
 * Provides weather data for maintenance scheduling
 */
export declare class WeatherService {
    /**
     * Get weather forecast for a specific date and location
     */
    getWeatherForecast(date: string, location: string): Promise<WeatherForecast | null>;
    /**
     * Get weather forecast for a date range
     */
    getWeatherForecastRange(startDate: string, endDate: string, location: string): Promise<WeatherForecast[]>;
    /**
     * Check if weather is suitable for maintenance on a specific date
     */
    isWeatherSuitableForMaintenance(date: string, location: string): Promise<boolean>;
    /**
     * Get weather recommendation for maintenance scheduling
     */
    getMaintenanceWeatherRecommendation(preferredDate: string, location: string, flexibilityDays?: number): Promise<WeatherRecommendation>;
    /**
     * Get optimal maintenance dates for the next 30 days
     */
    getOptimalMaintenanceDates(location: string, days?: number): Promise<string[]>;
    /**
     * Get weather alerts for a location
     */
    getWeatherAlerts(location: string): Promise<Array<{
        type: 'warning' | 'alert' | 'info';
        message: string;
        date: string;
    }>>;
    /**
     * Get current weather conditions
     */
    getCurrentWeather(location: string): Promise<WeatherForecast | null>;
    /**
     * Get weather summary for maintenance planning
     */
    getWeatherSummary(location: string, days?: number): Promise<{
        suitable_days: number;
        unsuitable_days: number;
        average_temperature: number;
        rain_days: number;
        recommendations: string[];
    }>;
    /**
     * Private helper methods
     */
    private getAllWeatherData;
    private findSuitableDates;
    private calculateWeatherScore;
}
export declare const weatherService: WeatherService;
//# sourceMappingURL=weather-service.d.ts.map