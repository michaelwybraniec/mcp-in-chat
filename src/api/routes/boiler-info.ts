import { Router, Request, Response } from 'express';
import { customerService } from '../services/customer-service.js';
import { boilerService } from '../services/boiler-service.js';
import { warrantyService } from '../services/warranty-service.js';
import { validateBoilerInfo } from '../middleware/validation.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const router = Router();

/**
 * GET /api/boiler-info
 * Get customer boiler information and warranty details
 */
router.get('/',
  authenticateApiKey,
  generalRateLimit,
  validateBoilerInfo,
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

      // Get boiler information
      const boiler = await boilerService.getBoilerByModel(customer.boiler_model);
      if (!boiler) {
        return res.status(404).json({
          success: false,
          error: 'Boiler information not found',
          message: `No boiler information found for model: ${customer.boiler_model}`
        });
      }

      // Get warranty information
      const warrantyInfo = await warrantyService.getWarrantyInfo(boiler.manufacturer, boiler.model);
      
      // Get warranty status for customer
      const warrantyStatus = await warrantyService.getWarrantyStatus(customer_id);

      // Get inventory information
      const inventory = await boilerService.getInventoryByModel(customer.boiler_model);

      // Calculate boiler age
      const installDate = new Date(customer.install_date);
      const today = new Date();
      const ageInYears = Math.floor((today.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

      // Prepare response
      const response = {
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            address: customer.address,
            phone: customer.phone
          },
          boiler: {
            model: boiler.model,
            manufacturer: boiler.manufacturer,
            efficiency: boiler.efficiency,
            fuel_type: boiler.fuel_type,
            output: boiler.output,
            features: boiler.features,
            install_date: customer.install_date,
            age_years: ageInYears
          },
          warranty: {
            info: warrantyInfo ? {
              duration: warrantyInfo.warranty_duration,
              coverage: warrantyInfo.coverage,
              conditions: warrantyInfo.conditions,
              contact: warrantyInfo.contact
            } : null,
            status: warrantyStatus ? {
              is_active: warrantyStatus.is_active,
              days_remaining: warrantyStatus.days_remaining,
              warranty_end: warrantyStatus.warranty_end,
              coverage_type: warrantyStatus.coverage_type
            } : null
          },
          inventory: inventory ? {
            available: inventory.quantity > 0,
            quantity: inventory.quantity,
            status: inventory.status,
            location: inventory.location
          } : null,
          recommendations: {
            maintenance_due: ageInYears >= 1,
            efficiency_rating: boiler.efficiency,
            upgrade_recommended: ageInYears > 8,
            next_service_date: calculateNextServiceDate(customer.install_date)
          }
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in boiler-info endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve boiler information'
      });
    }
  }
);

/**
 * GET /api/boiler-info/:customer_id/warranty
 * Get detailed warranty information for a customer
 */
router.get('/:customer_id/warranty',
  authenticateApiKey,
  generalRateLimit,
  async (req, res) => {
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

      // Get warranty status
      const warrantyStatus = await warrantyService.getWarrantyStatus(customer_id);
      if (!warrantyStatus) {
        return res.status(404).json({
          success: false,
          error: 'Warranty information not found',
          message: 'No warranty information available for this customer'
        });
      }

      // Get warranty extensions
      const warrantyInfo = await warrantyService.getWarrantyInfo('', customer.boiler_model);
      const extensions = warrantyInfo ? warrantyInfo.extensions : [];

      const response = {
        success: true,
        data: {
          customer_id,
          boiler_model: customer.boiler_model,
          warranty_status: warrantyStatus,
          available_extensions: extensions,
          recommendations: warrantyStatus ? this.generateWarrantyRecommendations(warrantyStatus, extensions) : []
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in warranty endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve warranty information'
      });
    }
  }
);

/**
 * GET /api/boiler-info/:customer_id/efficiency
 * Get efficiency analysis for a customer's boiler
 */
router.get('/:customer_id/efficiency',
  authenticateApiKey,
  generalRateLimit,
  async (req, res) => {
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

      // Get boiler information
      const boiler = await boilerService.getBoilerByModel(customer.boiler_model);
      if (!boiler) {
        return res.status(404).json({
          success: false,
          error: 'Boiler information not found',
          message: `No boiler information found for model: ${customer.boiler_model}`
        });
      }

      // Calculate efficiency metrics
      const currentEfficiency = parseInt(boiler.efficiency.replace('%', ''));
      const optimalEfficiency = boiler ? this.getOptimalEfficiency(boiler.model) : 0;
      const efficiencyGap = optimalEfficiency - currentEfficiency;
      const efficiencyPercentage = Math.round((currentEfficiency / optimalEfficiency) * 100);

      const response = {
        success: true,
        data: {
          customer_id,
          boiler_model: boiler.model,
          current_efficiency: `${currentEfficiency}%`,
          optimal_efficiency: `${optimalEfficiency}%`,
          efficiency_gap: `${efficiencyGap}%`,
          efficiency_percentage: `${efficiencyPercentage}%`,
          efficiency_rating: boiler ? this.getEfficiencyRating(currentEfficiency) : 'Unknown',
          recommendations: boiler ? this.generateEfficiencyRecommendations(currentEfficiency, optimalEfficiency) : [],
          potential_savings: boiler ? this.calculatePotentialSavings(efficiencyGap) : 0
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in efficiency endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve efficiency information'
      });
    }
  }
);

/**
 * Helper functions
 */
function calculateNextServiceDate(installDate: string): string {
  const install = new Date(installDate);
  const nextService = new Date(install.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year later
  return nextService.toISOString().split('T')[0];
}

function generateWarrantyRecommendations(
  warrantyStatus: any,
  extensions: any[]
): string[] {
  const recommendations: string[] = [];

  if (!warrantyStatus.is_active) {
    recommendations.push('Warranty has expired - consider extension');
  } else if (warrantyStatus.days_remaining < 30) {
    recommendations.push('Warranty expiring soon - consider renewal');
  }

  if (extensions.length > 0) {
    recommendations.push('Extended warranty options available');
  }

  if (warrantyStatus.days_remaining > 0) {
    recommendations.push('Ensure annual service to maintain warranty');
  }

  return recommendations;
}

function getOptimalEfficiency(boilerModel: string): number {
  const modelEfficiencies: { [key: string]: number } = {
    'Worcester Bosch 8000 Style': 94,
    'Vaillant ecoTEC plus': 92,
    'Ideal Logic+ Combi': 93,
    'Baxi 800': 91,
    'Glow-worm Energy': 90
  };
  
  return modelEfficiencies[boilerModel] || 90;
}

function getEfficiencyRating(efficiency: number): string {
  if (efficiency >= 90) return 'Excellent';
  if (efficiency >= 85) return 'Good';
  if (efficiency >= 80) return 'Fair';
  return 'Poor';
}

function generateEfficiencyRecommendations(currentEfficiency: number, optimalEfficiency: number): string[] {
  const recommendations: string[] = [];

  if (currentEfficiency < optimalEfficiency - 5) {
    recommendations.push('Schedule annual service to improve efficiency');
    recommendations.push('Check for system leaks or blockages');
  }

  if (currentEfficiency < optimalEfficiency - 10) {
    recommendations.push('Consider system upgrade or replacement');
    recommendations.push('Install smart controls for better efficiency');
  }

  if (currentEfficiency >= optimalEfficiency - 2) {
    recommendations.push('Efficiency is good - maintain regular service schedule');
  }

  return recommendations;
}

function calculatePotentialSavings(efficiencyGap: number): number {
  const annualHeatingCost = 1200; // Mock annual heating cost
  return Math.round((efficiencyGap / 100) * annualHeatingCost);
}

export default router; 