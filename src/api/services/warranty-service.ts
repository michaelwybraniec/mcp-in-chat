import { promises as fs } from 'fs';
import path from 'path';
import { Warranty } from '../../types/index.js';

const WARRANTIES_FILE = path.join(process.cwd(), 'data', 'warranties.json');

export interface WarrantyInfo {
  manufacturer: string;
  model: string;
  warranty_duration: string;
  coverage: string;
  conditions: string[];
  extensions: WarrantyExtension[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

export interface WarrantyExtension {
  type: string;
  duration: string;
  cost: number;
  conditions: string[];
}

export interface WarrantyStatus {
  customer_id: string;
  boiler_model: string;
  install_date: string;
  warranty_start: string;
  warranty_end: string;
  is_active: boolean;
  days_remaining: number;
  coverage_type: string;
  conditions_met: boolean;
}

/**
 * Mock Warranty Service for demo purposes
 * Provides warranty information and status checking
 */
export class WarrantyService {
  /**
   * Get warranty information for a specific boiler model
   */
  async getWarrantyInfo(manufacturer: string, model: string): Promise<WarrantyInfo | null> {
    try {
      const warranties = await this.getAllWarranties();
      const warranty = warranties.find(w => 
        w.manufacturer.toLowerCase() === manufacturer.toLowerCase() &&
        w.model.toLowerCase() === model.toLowerCase()
      );
      
      return warranty || null;
    } catch (error) {
      console.error('Error getting warranty info:', error);
      throw new Error('Failed to get warranty information');
    }
  }

  /**
   * Get warranty information by manufacturer
   */
  async getWarrantiesByManufacturer(manufacturer: string): Promise<WarrantyInfo[]> {
    try {
      const warranties = await this.getAllWarranties();
      return warranties.filter(w => 
        w.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
      );
    } catch (error) {
      console.error('Error getting warranties by manufacturer:', error);
      throw new Error('Failed to get warranties by manufacturer');
    }
  }

  /**
   * Get warranty status for a customer's boiler
   */
  async getWarrantyStatus(customerId: string): Promise<WarrantyStatus | null> {
    try {
      const { customerService } = await import('./customer-service.js');
      const customer = await customerService.getCustomerById(customerId);
      
      if (!customer) {
        return null;
      }
      
      const warrantyInfo = await this.getWarrantyInfo('', customer.boiler_model);
      if (!warrantyInfo) {
        return null;
      }
      
      const installDate = new Date(customer.install_date);
      const warrantyDuration = this.parseWarrantyDuration(warrantyInfo.warranty_duration);
      const warrantyEnd = new Date(installDate.getTime() + warrantyDuration * 24 * 60 * 60 * 1000);
      const today = new Date();
      const daysRemaining = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      
      return {
        customer_id: customerId,
        boiler_model: customer.boiler_model,
        install_date: customer.install_date,
        warranty_start: installDate.toISOString().split('T')[0],
        warranty_end: warrantyEnd.toISOString().split('T')[0],
        is_active: daysRemaining > 0,
        days_remaining: Math.max(0, daysRemaining),
        coverage_type: warrantyInfo.coverage,
        conditions_met: true // Mock: assume conditions are met
      };
    } catch (error) {
      console.error('Error getting warranty status:', error);
      throw new Error('Failed to get warranty status');
    }
  }

  /**
   * Check if warranty is still active
   */
  async isWarrantyActive(customerId: string): Promise<boolean> {
    try {
      const status = await this.getWarrantyStatus(customerId);
      return status ? status.is_active : false;
    } catch (error) {
      console.error('Error checking warranty status:', error);
      return false;
    }
  }

  /**
   * Get warranty extensions available for a boiler
   */
  async getWarrantyExtensions(manufacturer: string, model: string): Promise<WarrantyExtension[]> {
    try {
      const warrantyInfo = await this.getWarrantyInfo(manufacturer, model);
      return warrantyInfo ? warrantyInfo.extensions : [];
    } catch (error) {
      console.error('Error getting warranty extensions:', error);
      return [];
    }
  }

  /**
   * Calculate warranty extension cost
   */
  async calculateWarrantyExtensionCost(
    manufacturer: string,
    model: string,
    extensionType: string
  ): Promise<number | null> {
    try {
      const extensions = await this.getWarrantyExtensions(manufacturer, model);
      const extension = extensions.find(ext => ext.type.toLowerCase() === extensionType.toLowerCase());
      return extension ? extension.cost : null;
    } catch (error) {
      console.error('Error calculating warranty extension cost:', error);
      return null;
    }
  }

  /**
   * Get warranty contact information
   */
  async getWarrantyContact(manufacturer: string, model: string): Promise<{
    phone: string;
    email: string;
    website: string;
  } | null> {
    try {
      const warrantyInfo = await this.getWarrantyInfo(manufacturer, model);
      return warrantyInfo ? warrantyInfo.contact : null;
    } catch (error) {
      console.error('Error getting warranty contact:', error);
      return null;
    }
  }

  /**
   * Get all manufacturers with warranty information
   */
  async getManufacturers(): Promise<string[]> {
    try {
      const warranties = await this.getAllWarranties();
      const manufacturers = [...new Set(warranties.map(w => w.manufacturer))];
      return manufacturers.sort();
    } catch (error) {
      console.error('Error getting manufacturers:', error);
      return [];
    }
  }

  /**
   * Get warranty comparison for multiple models
   */
  async compareWarranties(models: Array<{ manufacturer: string; model: string }>): Promise<{
    [key: string]: WarrantyInfo | null;
  }> {
    try {
      const comparison: { [key: string]: WarrantyInfo | null } = {};
      
      for (const { manufacturer, model } of models) {
        const key = `${manufacturer} ${model}`;
        comparison[key] = await this.getWarrantyInfo(manufacturer, model);
      }
      
      return comparison;
    } catch (error) {
      console.error('Error comparing warranties:', error);
      throw new Error('Failed to compare warranties');
    }
  }

  /**
   * Get warranty recommendations based on customer needs
   */
  async getWarrantyRecommendations(criteria: {
    budget?: number;
    coverage_preference?: 'basic' | 'comprehensive' | 'premium';
    duration_preference?: 'short' | 'medium' | 'long';
  }): Promise<WarrantyInfo[]> {
    try {
      const warranties = await this.getAllWarranties();
      let recommendations = warranties;
      
      // Filter by budget if specified
      if (criteria.budget) {
        recommendations = recommendations.filter(w => {
          const minExtensionCost = Math.min(...w.extensions.map(ext => ext.cost));
          return minExtensionCost <= criteria.budget!;
        });
      }
      
      // Filter by coverage preference
      if (criteria.coverage_preference) {
        recommendations = recommendations.filter(w => {
          const coverage = w.coverage.toLowerCase();
          switch (criteria.coverage_preference) {
            case 'basic':
              return coverage.includes('parts');
            case 'comprehensive':
              return coverage.includes('parts and labour');
            case 'premium':
              return coverage.includes('parts and labour') && w.warranty_duration.includes('10');
            default:
              return true;
          }
        });
      }
      
      // Filter by duration preference
      if (criteria.duration_preference) {
        recommendations = recommendations.filter(w => {
          const duration = this.parseWarrantyDuration(w.warranty_duration);
          switch (criteria.duration_preference) {
            case 'short':
              return duration <= 365 * 5; // 5 years or less
            case 'medium':
              return duration > 365 * 5 && duration <= 365 * 10; // 5-10 years
            case 'long':
              return duration > 365 * 10; // More than 10 years
            default:
              return true;
          }
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error getting warranty recommendations:', error);
      return [];
    }
  }

  /**
   * Validate warranty claim eligibility
   */
  async validateWarrantyClaim(
    customerId: string,
    issue: string,
    serviceDate: string
  ): Promise<{
    eligible: boolean;
    reason: string;
    coverage_details: string;
    next_steps: string[];
  }> {
    try {
      const warrantyStatus = await this.getWarrantyStatus(customerId);
      
      if (!warrantyStatus) {
        return {
          eligible: false,
          reason: 'No warranty information found for customer',
          coverage_details: 'N/A',
          next_steps: ['Contact customer service for assistance']
        };
      }
      
      if (!warrantyStatus.is_active) {
        return {
          eligible: false,
          reason: 'Warranty has expired',
          coverage_details: warrantyStatus.coverage_type,
          next_steps: ['Consider warranty extension', 'Contact for paid service options']
        };
      }
      
      if (!warrantyStatus.conditions_met) {
        return {
          eligible: false,
          reason: 'Warranty conditions not met (e.g., annual service required)',
          coverage_details: warrantyStatus.coverage_type,
          next_steps: ['Schedule annual service', 'Provide service documentation']
        };
      }
      
      // Mock: assume all claims are eligible if warranty is active
      return {
        eligible: true,
        reason: 'Warranty claim approved',
        coverage_details: warrantyStatus.coverage_type,
        next_steps: [
          'Schedule technician visit',
          'Prepare boiler access',
          'Have installation documentation ready'
        ]
      };
    } catch (error) {
      console.error('Error validating warranty claim:', error);
      return {
        eligible: false,
        reason: 'Unable to validate warranty claim',
        coverage_details: 'N/A',
        next_steps: ['Contact customer service']
      };
    }
  }

  /**
   * Get warranty statistics
   */
  async getWarrantyStatistics(): Promise<{
    total_manufacturers: number;
    average_warranty_duration: string;
    most_common_coverage: string;
    extension_availability: number;
  }> {
    try {
      const warranties = await this.getAllWarranties();
      
      const totalManufacturers = new Set(warranties.map(w => w.manufacturer)).size;
      
      const durations = warranties.map(w => this.parseWarrantyDuration(w.warranty_duration));
      const averageDuration = Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length);
      const averageWarrantyDuration = `${Math.floor(averageDuration / 365)} years`;
      
      const coverageCounts: { [key: string]: number } = {};
      warranties.forEach(w => {
        coverageCounts[w.coverage] = (coverageCounts[w.coverage] || 0) + 1;
      });
      const mostCommonCoverage = Object.entries(coverageCounts)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      const extensionAvailability = warranties.filter(w => w.extensions.length > 0).length;
      
      return {
        total_manufacturers: totalManufacturers,
        average_warranty_duration: averageWarrantyDuration,
        most_common_coverage: mostCommonCoverage,
        extension_availability: extensionAvailability
      };
    } catch (error) {
      console.error('Error getting warranty statistics:', error);
      return {
        total_manufacturers: 0,
        average_warranty_duration: '0 years',
        most_common_coverage: 'N/A',
        extension_availability: 0
      };
    }
  }

  /**
   * Private helper methods
   */
  private async getAllWarranties(): Promise<Warranty[]> {
    try {
      const data = await fs.readFile(WARRANTIES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading warranties file:', error);
      throw new Error('Failed to read warranty data');
    }
  }

  private parseWarrantyDuration(duration: string): number {
    // Parse warranty duration string to days
    const match = duration.match(/(\d+)\s*(year|month|day)/i);
    if (!match) return 365; // Default to 1 year
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
      case 'year':
        return value * 365;
      case 'month':
        return value * 30;
      case 'day':
        return value;
      default:
        return 365;
    }
  }
}

// Export singleton instance
export const warrantyService = new WarrantyService(); 