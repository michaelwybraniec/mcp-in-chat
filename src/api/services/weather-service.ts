import { promises as fs } from 'fs';
import path from 'path';
import { Weather } from '../../types/index.js';

const WEATHER_FILE = path.join(process.cwd(), 'data', 'weather.json');

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
export class WeatherService {
  /**
   * Get weather forecast for a specific date and location
   */
  async getWeatherForecast(date: string, location: string): Promise<WeatherForecast | null> {
    try {
      const weatherData = await this.getAllWeatherData();
      const forecast = weatherData.find(w => 
        w.date === date && w.location.toLowerCase() === location.toLowerCase()
      );
      
      return forecast || null;
    } catch (error) {
      console.error('Error getting weather forecast:', error);
      throw new Error('Failed to get weather forecast');
    }
  }

  /**
   * Get weather forecast for a date range
   */
  async getWeatherForecastRange(
    startDate: string,
    endDate: string,
    location: string
  ): Promise<WeatherForecast[]> {
    try {
      const weatherData = await this.getAllWeatherData();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return weatherData.filter(w => {
        const forecastDate = new Date(w.date);
        return forecastDate >= start && 
               forecastDate <= end && 
               w.location.toLowerCase() === location.toLowerCase();
      });
    } catch (error) {
      console.error('Error getting weather forecast range:', error);
      throw new Error('Failed to get weather forecast range');
    }
  }

  /**
   * Check if weather is suitable for maintenance on a specific date
   */
  async isWeatherSuitableForMaintenance(date: string, location: string): Promise<boolean> {
    try {
      const forecast = await this.getWeatherForecast(date, location);
      return forecast ? forecast.maintenance_suitable : false;
    } catch (error) {
      console.error('Error checking weather suitability:', error);
      return false;
    }
  }

  /**
   * Get weather recommendation for maintenance scheduling
   */
  async getMaintenanceWeatherRecommendation(
    preferredDate: string,
    location: string,
    flexibilityDays: number = 7
  ): Promise<WeatherRecommendation> {
    try {
      const preferredForecast = await this.getWeatherForecast(preferredDate, location);
      
      if (!preferredForecast) {
        return {
          date: preferredDate,
          suitable: false,
          reason: 'No weather data available for this date'
        };
      }
      
      if (preferredForecast.maintenance_suitable) {
        return {
          date: preferredDate,
          suitable: true,
          reason: `Weather is suitable: ${preferredForecast.conditions}, ${preferredForecast.temperature.current}°C`
        };
      }
      
      // Find alternative dates within flexibility range
      const alternativeDates = await this.findSuitableDates(
        preferredDate,
        location,
        flexibilityDays
      );
      
      return {
        date: preferredDate,
        suitable: false,
        reason: `Weather unsuitable: ${preferredForecast.conditions}, ${preferredForecast.precipitation_chance}% chance of rain`,
        alternative_dates: alternativeDates
      };
    } catch (error) {
      console.error('Error getting weather recommendation:', error);
      return {
        date: preferredDate,
        suitable: false,
        reason: 'Unable to get weather recommendation'
      };
    }
  }

  /**
   * Get optimal maintenance dates for the next 30 days
   */
  async getOptimalMaintenanceDates(location: string, days: number = 30): Promise<string[]> {
    try {
      const today = new Date();
      const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const forecasts = await this.getWeatherForecastRange(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        location
      );
      
      return forecasts
        .filter(f => f.maintenance_suitable)
        .sort((a, b) => {
          // Prioritize sunny days with low wind
          const aScore = this.calculateWeatherScore(a);
          const bScore = this.calculateWeatherScore(b);
          return bScore - aScore;
        })
        .slice(0, 5) // Return top 5 optimal dates
        .map(f => f.date);
    } catch (error) {
      console.error('Error getting optimal maintenance dates:', error);
      return [];
    }
  }

  /**
   * Get weather alerts for a location
   */
  async getWeatherAlerts(location: string): Promise<Array<{
    type: 'warning' | 'alert' | 'info';
    message: string;
    date: string;
  }>> {
    try {
      const weatherData = await this.getAllWeatherData();
      const locationData = weatherData.filter(w => 
        w.location.toLowerCase() === location.toLowerCase()
      );
      
      const alerts: Array<{
        type: 'warning' | 'alert' | 'info';
        message: string;
        date: string;
      }> = [];
      
      locationData.forEach(forecast => {
        if (forecast.precipitation_chance > 80) {
          alerts.push({
            type: 'warning',
            message: `Heavy rain expected on ${forecast.date}`,
            date: forecast.date
          });
        }
        
        if (forecast.wind_speed > 30) {
          alerts.push({
            type: 'alert',
            message: `High winds expected on ${forecast.date}`,
            date: forecast.date
          });
        }
        
        if (forecast.temperature.current < 5) {
          alerts.push({
            type: 'info',
            message: `Cold weather on ${forecast.date} - consider indoor work`,
            date: forecast.date
          });
        }
      });
      
      return alerts;
    } catch (error) {
      console.error('Error getting weather alerts:', error);
      return [];
    }
  }

  /**
   * Get current weather conditions
   */
  async getCurrentWeather(location: string): Promise<WeatherForecast | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getWeatherForecast(today, location);
    } catch (error) {
      console.error('Error getting current weather:', error);
      return null;
    }
  }

  /**
   * Get weather summary for maintenance planning
   */
  async getWeatherSummary(location: string, days: number = 7): Promise<{
    suitable_days: number;
    unsuitable_days: number;
    average_temperature: number;
    rain_days: number;
    recommendations: string[];
  }> {
    try {
      const today = new Date();
      const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const forecasts = await this.getWeatherForecastRange(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        location
      );
      
      const suitableDays = forecasts.filter(f => f.maintenance_suitable).length;
      const unsuitableDays = forecasts.length - suitableDays;
      const averageTemperature = forecasts.reduce((sum, f) => sum + f.temperature.current, 0) / forecasts.length;
      const rainDays = forecasts.filter(f => f.precipitation_chance > 50).length;
      
      const recommendations: string[] = [];
      
      if (suitableDays === 0) {
        recommendations.push('No suitable weather days in the forecast period');
      } else if (suitableDays < days / 2) {
        recommendations.push('Limited suitable weather days - consider flexible scheduling');
      }
      
      if (rainDays > days / 2) {
        recommendations.push('High chance of rain - prioritize indoor work');
      }
      
      if (averageTemperature < 10) {
        recommendations.push('Cold weather expected - ensure proper heating for work areas');
      }
      
      return {
        suitable_days: suitableDays,
        unsuitable_days: unsuitableDays,
        average_temperature: Math.round(averageTemperature),
        rain_days: rainDays,
        recommendations
      };
    } catch (error) {
      console.error('Error getting weather summary:', error);
      return {
        suitable_days: 0,
        unsuitable_days: 0,
        average_temperature: 0,
        rain_days: 0,
        recommendations: ['Unable to get weather summary']
      };
    }
  }

  /**
   * Private helper methods
   */
  private async getAllWeatherData(): Promise<Weather[]> {
    try {
      const data = await fs.readFile(WEATHER_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading weather file:', error);
      throw new Error('Failed to read weather data');
    }
  }

  private async findSuitableDates(
    preferredDate: string,
    location: string,
    flexibilityDays: number
  ): Promise<string[]> {
    try {
      const preferred = new Date(preferredDate);
      const startDate = new Date(preferred.getTime() - flexibilityDays * 24 * 60 * 60 * 1000);
      const endDate = new Date(preferred.getTime() + flexibilityDays * 24 * 60 * 60 * 1000);
      
      const forecasts = await this.getWeatherForecastRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        location
      );
      
      return forecasts
        .filter(f => f.maintenance_suitable)
        .map(f => f.date)
        .sort();
    } catch (error) {
      console.error('Error finding suitable dates:', error);
      return [];
    }
  }

  private calculateWeatherScore(forecast: WeatherForecast): number {
    let score = 0;
    
    // Temperature score (prefer mild temperatures)
    const temp = forecast.temperature.current;
    if (temp >= 15 && temp <= 25) score += 30;
    else if (temp >= 10 && temp <= 30) score += 20;
    else if (temp >= 5 && temp <= 35) score += 10;
    
    // Precipitation score (prefer dry weather)
    const rainChance = forecast.precipitation_chance;
    if (rainChance < 10) score += 40;
    else if (rainChance < 30) score += 20;
    else if (rainChance < 50) score += 10;
    
    // Wind score (prefer calm weather)
    const windSpeed = forecast.wind_speed;
    if (windSpeed < 10) score += 30;
    else if (windSpeed < 20) score += 15;
    else if (windSpeed < 30) score += 5;
    
    return score;
  }
}

// Export singleton instance
export const weatherService = new WeatherService(); 