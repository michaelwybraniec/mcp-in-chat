import { Router, Request, Response } from 'express';
import { customerService } from '../services/customer-service.js';
import { weatherService } from '../services/weather-service.js';
import { aiPredictionService } from '../services/ai-prediction-service.js';
import { technicianService } from '../services/technician-service.js';
import { emailService } from '../services/email-service.js';
import { validateMaintenanceGet, validateMaintenancePost } from '../middleware/validation.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const router = Router();

/**
 * GET /api/maintenance
 * Get maintenance schedule for a customer
 */
router.get('/',
  authenticateApiKey,
  generalRateLimit,
  validateMaintenanceGet,
  async (req: Request, res: Response) => {
    try {
      const { customer_id } = req.query;
      
      if (!customer_id || typeof customer_id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid customer_id parameter',
          message: 'Customer ID is required as a query parameter'
        });
      }

      // Get customer information
      const customer = await customerService.getCustomerById(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
          message: `No customer found with ID: ${customer_id}`
        });
      }

      // Get AI predictions for maintenance
      const maintenancePrediction = await aiPredictionService.getMaintenancePrediction(customer_id);
      const failurePrediction = await aiPredictionService.getFailurePrediction(customer_id);
      const efficiencyAnalysis = await aiPredictionService.getEfficiencyAnalysis(customer_id);

      // Get predictive maintenance schedule
      const predictiveSchedule = await aiPredictionService.getPredictiveMaintenanceSchedule(customer_id);

      // Get weather recommendations
      const location = extractLocationFromAddress(customer.address);
      const weatherRecommendation = await weatherService.getMaintenanceWeatherRecommendation(
        predictiveSchedule.next_service_date,
        location,
        7
      );

      const response = {
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            boiler_model: customer.boiler_model,
            install_date: customer.install_date
          },
          maintenance_prediction: maintenancePrediction,
          failure_prediction: failurePrediction,
          efficiency_analysis: efficiencyAnalysis,
          predictive_schedule: predictiveSchedule,
          weather_recommendation: weatherRecommendation,
          recommendations: generateMaintenanceRecommendations(
            maintenancePrediction,
            failurePrediction,
            weatherRecommendation
          )
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in maintenance GET endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve maintenance information'
      });
    }
  }
);

/**
 * POST /api/maintenance
 * Schedule maintenance service
 */
router.post('/',
  authenticateApiKey,
  generalRateLimit,
  validateMaintenancePost,
  async (req: Request, res: Response) => {
    try {
      const { customer_id, service_date, service_type, notes } = req.body;

      // Get customer information
      const customer = await customerService.getCustomerById(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
          message: `No customer found with ID: ${customer_id}`
        });
      }

      // Check weather suitability
      const location = customer && customer.address ? extractLocationFromAddress(customer.address) : 'Unknown';
      const weatherSuitable = await weatherService.isWeatherSuitableForMaintenance(service_date, location);

      if (!weatherSuitable) {
        const weatherRecommendation = await weatherService.getMaintenanceWeatherRecommendation(
          service_date,
          location,
          7
        );

        return res.status(400).json({
          success: false,
          error: 'Weather unsuitable for maintenance',
          message: 'Selected date has unsuitable weather conditions',
          data: {
            weather_recommendation: weatherRecommendation,
            alternative_dates: weatherRecommendation.alternative_dates
          }
        });
      }

      // Find available technician
      const availableTechnicians = await technicianService.getAvailableTechnicians(
        service_date,
        location,
        ['Worcester Bosch', 'Vaillant', 'Ideal', 'Baxi', 'Glow-worm']
      );

      if (availableTechnicians.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No technicians available',
          message: 'No technicians available for the selected date and location'
        });
      }

      // Book the best technician
      const bestTechnician = availableTechnicians[0];
      const booking = await technicianService.bookTechnician(
        customer_id,
        bestTechnician.technician_id,
        service_date,
        bestTechnician.available_slots[0],
        service_type || 'annual_service',
        2
      );

      // Send confirmation email
      const emailResult = await emailService.sendMaintenanceReminder(
        customer.email,
        customer.name,
        service_date
      );

      // Get updated predictions
      const maintenancePrediction = await aiPredictionService.getMaintenancePrediction(customer_id);

      const response = {
        success: true,
        data: {
          booking: {
            booking_id: booking.booking_id,
            service_date: booking.service_date,
            service_time: booking.service_time,
            service_type: booking.service_type,
            technician_id: booking.technician_id,
            status: booking.status
          },
          technician: {
            id: bestTechnician.technician_id,
            rating: bestTechnician.rating,
            skills: bestTechnician.skills
          },
          email_sent: emailResult.success,
          maintenance_prediction: maintenancePrediction,
          weather_conditions: {
            suitable: weatherSuitable,
            location,
            date: service_date
          }
        },
        message: 'Maintenance service scheduled successfully',
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in maintenance POST endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to schedule maintenance service'
      });
    }
  }
);

/**
 * GET /api/maintenance/:customer_id/schedule
 * Get detailed maintenance schedule for a customer
 */
router.get('/:customer_id/schedule',
  authenticateApiKey,
  generalRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { customer_id } = req.params;

      // Get customer information
      const customer = await customerService.getCustomerById(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
          message: `No customer found with ID: ${customer_id}`
        });
      }

      // Get comprehensive maintenance data
      const [maintenancePrediction, failurePrediction, efficiencyAnalysis, predictiveSchedule] = await Promise.all([
        aiPredictionService.getMaintenancePrediction(customer_id),
        aiPredictionService.getFailurePrediction(customer_id),
        aiPredictionService.getEfficiencyAnalysis(customer_id),
        aiPredictionService.getPredictiveMaintenanceSchedule(customer_id)
      ]);

      // Get weather data for next 30 days
      const location = customer && customer.address ? extractLocationFromAddress(customer.address) : 'Unknown';
      const optimalDates = await weatherService.getOptimalMaintenanceDates(location, 30);
      const weatherAlerts = await weatherService.getWeatherAlerts(location);

      const response = {
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            boiler_model: customer.boiler_model
          },
          current_status: {
            maintenance_prediction: maintenancePrediction,
            failure_prediction: failurePrediction,
            efficiency_analysis: efficiencyAnalysis,
            predictive_schedule: predictiveSchedule
          },
          optimal_dates: optimalDates,
          weather_alerts: weatherAlerts,
          recommendations: generateDetailedRecommendations(
            maintenancePrediction,
            failurePrediction,
            efficiencyAnalysis,
            weatherAlerts
          )
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in maintenance schedule endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve maintenance schedule'
      });
    }
  }
);

/**
 * POST /api/maintenance/:customer_id/emergency
 * Schedule emergency maintenance service
 */
router.post('/:customer_id/emergency',
  authenticateApiKey,
  generalRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { customer_id } = req.params;
      const { issue_description, urgency_level } = req.body;

      // Get customer information
      const customer = await customerService.getCustomerById(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
          message: `No customer found with ID: ${customer_id}`
        });
      }

      // Find emergency technicians
      const location = customer && customer.address ? extractLocationFromAddress(customer.address) : 'Unknown';
      const emergencyTechnicians = await technicianService.getEmergencyTechnicians(location);

      if (emergencyTechnicians.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No emergency technicians available',
          message: 'No emergency technicians available in your area'
        });
      }

      // Get next available slot (today or tomorrow)
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let emergencyDate = today;
      let availableTechnicians = await technicianService.getAvailableTechnicians(today, location);
      
      if (availableTechnicians.length === 0) {
        emergencyDate = tomorrow;
        availableTechnicians = await technicianService.getAvailableTechnicians(tomorrow, location);
      }

      if (availableTechnicians.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No emergency slots available',
          message: 'No emergency slots available today or tomorrow'
        });
      }

      // Book emergency service
      const bestTechnician = availableTechnicians[0];
      const booking = await technicianService.bookTechnician(
        customer_id,
        bestTechnician.technician_id,
        emergencyDate,
        bestTechnician.available_slots[0],
        'emergency_service',
        4
      );

      // Send emergency notification
      const estimatedArrival = `${emergencyDate} at ${bestTechnician.available_slots[0]}`;
      const emailResult = await emailService.sendEmergencyServiceNotification(
        customer.email,
        estimatedArrival
      );

      const response = {
        success: true,
        data: {
          emergency_booking: {
            booking_id: booking.booking_id,
            service_date: booking.service_date,
            service_time: booking.service_time,
            technician_id: booking.technician_id,
            issue_description,
            urgency_level: urgency_level || 'high'
          },
          technician: {
            id: bestTechnician.technician_id,
            rating: bestTechnician.rating,
            specializations: bestTechnician.skills
          },
          notification_sent: emailResult.success,
          estimated_arrival: estimatedArrival
        },
        message: 'Emergency service scheduled successfully',
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in emergency maintenance endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to schedule emergency maintenance'
      });
    }
  }
);

/**
 * Helper functions
 */
function extractLocationFromAddress(address: string): string {
  // Extract city from address (simple implementation)
  const parts = address.split(',');
  if (parts.length >= 2) {
    return parts[1].trim();
  }
  return 'London'; // Default fallback
}

function generateMaintenanceRecommendations(
  maintenancePrediction: any,
  failurePrediction: any,
  weatherRecommendation: any
): string[] {
  const recommendations: string[] = [];

  if (maintenancePrediction?.risk_level === 'high') {
    recommendations.push('Schedule maintenance immediately - high risk detected');
  }

  if (failurePrediction?.failure_probability > 0.3) {
    recommendations.push('High failure probability - consider preventive maintenance');
  }

  if (!weatherRecommendation?.suitable) {
    recommendations.push('Weather unsuitable - consider alternative dates');
  }

  if (maintenancePrediction?.recommended_actions) {
    recommendations.push(...maintenancePrediction.recommended_actions);
  }

  return recommendations.slice(0, 5);
}

function generateDetailedRecommendations(
  maintenancePrediction: any,
  failurePrediction: any,
  efficiencyAnalysis: any,
  weatherAlerts: any[]
): string[] {
  const recommendations: string[] = [];

  if (maintenancePrediction?.risk_level === 'high') {
    recommendations.push('Immediate maintenance required - high risk level');
  }

  if (failurePrediction?.failure_probability > 0.2) {
    recommendations.push('Schedule preventive maintenance to avoid failure');
  }

  if (efficiencyAnalysis?.efficiency_trend === 'declining') {
    recommendations.push('Efficiency declining - schedule service to improve performance');
  }

  if (weatherAlerts.length > 0) {
    recommendations.push('Weather alerts active - consider indoor work or rescheduling');
  }

  if (maintenancePrediction?.recommended_actions) {
    recommendations.push(...maintenancePrediction.recommended_actions);
  }

  return recommendations.slice(0, 6);
}

export default router; 