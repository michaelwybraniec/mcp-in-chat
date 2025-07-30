import { promises as fs } from 'fs';
import path from 'path';
import { Maintenance } from '../../types/index.js';

const MAINTENANCE_FILE = path.join(process.cwd(), 'data', 'maintenance.json');

export interface MaintenancePrediction {
  customer_id: string;
  boiler_model: string;
  next_service_optimal: string;
  risk_level: 'low' | 'medium' | 'high';
  recommended_actions: string[];
  efficiency_prediction: string;
  confidence_score: number;
  factors: string[];
  estimated_cost: number;
}

export interface FailurePrediction {
  customer_id: string;
  boiler_model: string;
  failure_probability: number;
  estimated_failure_date: string;
  risk_factors: string[];
  recommended_preventive_actions: string[];
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface EfficiencyAnalysis {
  customer_id: string;
  boiler_model: string;
  current_efficiency: number;
  optimal_efficiency: number;
  efficiency_trend: 'improving' | 'stable' | 'declining';
  improvement_recommendations: string[];
  potential_savings: number;
}

/**
 * Mock AI Prediction Service for demo purposes
 * Provides AI-powered predictions for maintenance and efficiency
 */
export class AIPredictionService {
  /**
   * Get maintenance prediction for a customer
   */
  async getMaintenancePrediction(customerId: string): Promise<MaintenancePrediction | null> {
    try {
      const maintenanceData = await this.getAllMaintenanceData();
      const customerMaintenance = maintenanceData.find(m => m.customer_id === customerId);
      
      if (!customerMaintenance) {
        return null;
      }
      
      // Mock AI prediction based on existing data
      const prediction: MaintenancePrediction = {
        customer_id: customerId,
        boiler_model: await this.getCustomerBoilerModel(customerId),
        next_service_optimal: customerMaintenance.ai_predictions.next_service_optimal,
        risk_level: customerMaintenance.ai_predictions.risk_level,
        recommended_actions: customerMaintenance.ai_predictions.recommended_actions,
        efficiency_prediction: customerMaintenance.ai_predictions.efficiency_prediction,
        confidence_score: this.generateConfidenceScore(),
        factors: this.generatePredictionFactors(customerMaintenance),
        estimated_cost: this.estimateMaintenanceCost(customerMaintenance.ai_predictions.risk_level)
      };
      
      return prediction;
    } catch (error) {
      console.error('Error getting maintenance prediction:', error);
      throw new Error('Failed to get maintenance prediction');
    }
  }

  /**
   * Get failure prediction for a customer's boiler
   */
  async getFailurePrediction(customerId: string): Promise<FailurePrediction | null> {
    try {
      const maintenanceData = await this.getAllMaintenanceData();
      const customerMaintenance = maintenanceData.find(m => m.customer_id === customerId);
      
      if (!customerMaintenance) {
        return null;
      }
      
      // Mock failure prediction based on maintenance history and risk level
      const failureProbability = this.calculateFailureProbability(customerMaintenance);
      const estimatedFailureDate = this.estimateFailureDate(customerMaintenance);
      const riskFactors = this.identifyRiskFactors(customerMaintenance);
      const urgencyLevel = this.determineUrgencyLevel(failureProbability);
      
      const prediction: FailurePrediction = {
        customer_id: customerId,
        boiler_model: await this.getCustomerBoilerModel(customerId),
        failure_probability: failureProbability,
        estimated_failure_date: estimatedFailureDate,
        risk_factors: riskFactors,
        recommended_preventive_actions: this.getPreventiveActions(riskFactors),
        urgency_level: urgencyLevel
      };
      
      return prediction;
    } catch (error) {
      console.error('Error getting failure prediction:', error);
      throw new Error('Failed to get failure prediction');
    }
  }

  /**
   * Get efficiency analysis for a customer's boiler
   */
  async getEfficiencyAnalysis(customerId: string): Promise<EfficiencyAnalysis | null> {
    try {
      const maintenanceData = await this.getAllMaintenanceData();
      const customerMaintenance = maintenanceData.find(m => m.customer_id === customerId);
      
      if (!customerMaintenance) {
        return null;
      }
      
      const currentEfficiency = parseInt(customerMaintenance.ai_predictions.efficiency_prediction.replace('%', ''));
      const optimalEfficiency = this.getOptimalEfficiency(await this.getCustomerBoilerModel(customerId));
      const efficiencyTrend = this.analyzeEfficiencyTrend(customerMaintenance);
      const improvementRecommendations = this.getEfficiencyImprovements(currentEfficiency, optimalEfficiency);
      const potentialSavings = this.calculatePotentialSavings(currentEfficiency, optimalEfficiency);
      
      const analysis: EfficiencyAnalysis = {
        customer_id: customerId,
        boiler_model: await this.getCustomerBoilerModel(customerId),
        current_efficiency: currentEfficiency,
        optimal_efficiency: optimalEfficiency,
        efficiency_trend: efficiencyTrend,
        improvement_recommendations: improvementRecommendations,
        potential_savings: potentialSavings
      };
      
      return analysis;
    } catch (error) {
      console.error('Error getting efficiency analysis:', error);
      throw new Error('Failed to get efficiency analysis');
    }
  }

  /**
   * Get predictive maintenance schedule
   */
  async getPredictiveMaintenanceSchedule(customerId: string): Promise<{
    next_service_date: string;
    service_type: string;
    priority: 'low' | 'medium' | 'high';
    estimated_duration: number;
    required_parts: string[];
    cost_estimate: number;
  }> {
    try {
      const prediction = await this.getMaintenancePrediction(customerId);
      if (!prediction) {
        throw new Error('No maintenance prediction available');
      }
      
      const serviceType = this.determineServiceType(prediction.risk_level);
      const priority = prediction.risk_level;
      const estimatedDuration = this.estimateServiceDuration(serviceType);
      const requiredParts = this.getRequiredParts(serviceType, prediction.risk_level);
      const costEstimate = prediction.estimated_cost;
      
      return {
        next_service_date: prediction.next_service_optimal,
        service_type: serviceType,
        priority,
        estimated_duration: estimatedDuration,
        required_parts: requiredParts,
        cost_estimate: costEstimate
      };
    } catch (error) {
      console.error('Error getting predictive maintenance schedule:', error);
      throw new Error('Failed to get predictive maintenance schedule');
    }
  }

  /**
   * Get AI recommendations for boiler optimization
   */
  async getBoilerOptimizationRecommendations(customerId: string): Promise<{
    recommendations: string[];
    priority: 'low' | 'medium' | 'high';
    estimated_impact: string;
    implementation_cost: number;
    payback_period: number;
  }> {
    try {
      const efficiencyAnalysis = await this.getEfficiencyAnalysis(customerId);
      const failurePrediction = await this.getFailurePrediction(customerId);
      
      if (!efficiencyAnalysis) {
        throw new Error('No efficiency analysis available');
      }
      
      const recommendations = this.generateOptimizationRecommendations(efficiencyAnalysis, failurePrediction);
      const priority = this.determineOptimizationPriority(efficiencyAnalysis, failurePrediction);
      const estimatedImpact = this.estimateOptimizationImpact(efficiencyAnalysis);
      const implementationCost = this.calculateImplementationCost(recommendations);
      const paybackPeriod = this.calculatePaybackPeriod(implementationCost, efficiencyAnalysis.potential_savings);
      
      return {
        recommendations,
        priority,
        estimated_impact: estimatedImpact,
        implementation_cost: implementationCost,
        payback_period: paybackPeriod
      };
    } catch (error) {
      console.error('Error getting boiler optimization recommendations:', error);
      throw new Error('Failed to get boiler optimization recommendations');
    }
  }

  /**
   * Get predictive analytics summary
   */
  async getPredictiveAnalyticsSummary(customerId: string): Promise<{
    maintenance_health_score: number;
    efficiency_score: number;
    reliability_score: number;
    overall_risk_level: 'low' | 'medium' | 'high';
    key_insights: string[];
    recommended_actions: string[];
  }> {
    try {
      const [maintenancePrediction, failurePrediction, efficiencyAnalysis] = await Promise.all([
        this.getMaintenancePrediction(customerId),
        this.getFailurePrediction(customerId),
        this.getEfficiencyAnalysis(customerId)
      ]);
      
      if (!maintenancePrediction || !failurePrediction || !efficiencyAnalysis) {
        throw new Error('Incomplete data for analytics summary');
      }
      
      const maintenanceHealthScore = this.calculateMaintenanceHealthScore(maintenancePrediction);
      const efficiencyScore = this.calculateEfficiencyScore(efficiencyAnalysis);
      const reliabilityScore = this.calculateReliabilityScore(failurePrediction);
      const overallRiskLevel = this.determineOverallRiskLevel(maintenanceHealthScore, efficiencyScore, reliabilityScore);
      const keyInsights = this.generateKeyInsights(maintenancePrediction, failurePrediction, efficiencyAnalysis);
      const recommendedActions = this.generateRecommendedActions(maintenancePrediction, failurePrediction, efficiencyAnalysis);
      
      return {
        maintenance_health_score: maintenanceHealthScore,
        efficiency_score: efficiencyScore,
        reliability_score: reliabilityScore,
        overall_risk_level: overallRiskLevel,
        key_insights: keyInsights,
        recommended_actions: recommendedActions
      };
    } catch (error) {
      console.error('Error getting predictive analytics summary:', error);
      throw new Error('Failed to get predictive analytics summary');
    }
  }

  /**
   * Private helper methods
   */
  private async getAllMaintenanceData(): Promise<Maintenance[]> {
    try {
      const data = await fs.readFile(MAINTENANCE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading maintenance file:', error);
      throw new Error('Failed to read maintenance data');
    }
  }

  private async getCustomerBoilerModel(customerId: string): Promise<string> {
    try {
      const { customerService } = await import('./customer-service.js');
      const customer = await customerService.getCustomerById(customerId);
      return customer?.boiler_model || 'Unknown Model';
    } catch (error) {
      console.error('Error getting customer boiler model:', error);
      return 'Unknown Model';
    }
  }

  private generateConfidenceScore(): number {
    // Mock confidence score between 0.7 and 0.95
    return Math.round((Math.random() * 0.25 + 0.7) * 100) / 100;
  }

  private generatePredictionFactors(maintenance: Maintenance): string[] {
    const factors = [
      'Service history analysis',
      'Boiler age and usage patterns',
      'Environmental conditions',
      'Component wear indicators',
      'Performance trends'
    ];
    
    // Randomly select 3-4 factors
    const selectedFactors = factors.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3);
    return selectedFactors;
  }

  private estimateMaintenanceCost(riskLevel: string): number {
    const baseCosts = {
      low: 150,
      medium: 250,
      high: 400
    };
    
    const baseCost = baseCosts[riskLevel as keyof typeof baseCosts] || 200;
    const variation = Math.random() * 0.3 + 0.85; // ±15% variation
    return Math.round(baseCost * variation);
  }

  private calculateFailureProbability(maintenance: Maintenance): number {
    const riskLevels = { low: 0.05, medium: 0.15, high: 0.35 };
    const baseProbability = riskLevels[maintenance.ai_predictions.risk_level as keyof typeof riskLevels] || 0.1;
    
    // Add some randomness
    const variation = Math.random() * 0.2 + 0.9; // ±10% variation
    return Math.round(baseProbability * variation * 100) / 100;
  }

  private estimateFailureDate(maintenance: Maintenance): string {
    const daysToAdd = maintenance.ai_predictions.risk_level === 'high' ? 
      Math.floor(Math.random() * 90) + 30 : // 30-120 days for high risk
      Math.floor(Math.random() * 365) + 180; // 180-545 days for low/medium risk
    
    const nextServiceDate = new Date(maintenance.next_service);
    const failureDate = new Date(nextServiceDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return failureDate.toISOString().split('T')[0];
  }

  private identifyRiskFactors(maintenance: Maintenance): string[] {
    const allRiskFactors = [
      'Aging components',
      'Inconsistent maintenance schedule',
      'High usage patterns',
      'Environmental stress',
      'Component wear',
      'Efficiency degradation',
      'Previous repairs',
      'Operating conditions'
    ];
    
    // Select 2-4 risk factors based on risk level
    const factorCount = maintenance.ai_predictions.risk_level === 'high' ? 4 : 
                       maintenance.ai_predictions.risk_level === 'medium' ? 3 : 2;
    
    return allRiskFactors.sort(() => 0.5 - Math.random()).slice(0, factorCount);
  }

  private determineUrgencyLevel(failureProbability: number): 'low' | 'medium' | 'high' | 'critical' {
    if (failureProbability > 0.3) return 'critical';
    if (failureProbability > 0.2) return 'high';
    if (failureProbability > 0.1) return 'medium';
    return 'low';
  }

  private getPreventiveActions(riskFactors: string[]): string[] {
    const actionMap: { [key: string]: string[] } = {
      'Aging components': ['Schedule component replacement', 'Increase monitoring frequency'],
      'Inconsistent maintenance': ['Establish regular service schedule', 'Set up maintenance reminders'],
      'High usage patterns': ['Optimize usage patterns', 'Consider efficiency upgrades'],
      'Environmental stress': ['Improve ventilation', 'Install protective measures'],
      'Component wear': ['Replace worn components', 'Implement preventive maintenance'],
      'Efficiency degradation': ['Clean system components', 'Optimize settings'],
      'Previous repairs': ['Monitor repaired components', 'Schedule follow-up inspection'],
      'Operating conditions': ['Adjust operating parameters', 'Improve environmental conditions']
    };
    
    const actions: string[] = [];
    riskFactors.forEach(factor => {
      if (actionMap[factor]) {
        actions.push(...actionMap[factor]);
      }
    });
    
    return actions.slice(0, 4); // Return max 4 actions
  }

  private getOptimalEfficiency(boilerModel: string): number {
    // Mock optimal efficiency based on boiler model
    const modelEfficiencies: { [key: string]: number } = {
      'Worcester Bosch 8000 Style': 94,
      'Vaillant ecoTEC plus': 92,
      'Ideal Logic+ Combi': 93,
      'Baxi 800': 91,
      'Glow-worm Energy': 90
    };
    
    return modelEfficiencies[boilerModel] || 90;
  }

  private analyzeEfficiencyTrend(maintenance: Maintenance): 'improving' | 'stable' | 'declining' {
    const efficiency = parseInt(maintenance.ai_predictions.efficiency_prediction.replace('%', ''));
    const optimalEfficiency = this.getOptimalEfficiency(maintenance.customer_id);
    
    if (efficiency >= optimalEfficiency - 2) return 'stable';
    if (efficiency >= optimalEfficiency - 5) return 'declining';
    return 'declining';
  }

  private getEfficiencyImprovements(currentEfficiency: number, optimalEfficiency: number): string[] {
    const improvements = [
      'Schedule annual service',
      'Clean system components',
      'Optimize boiler settings',
      'Check for air leaks',
      'Upgrade to smart controls',
      'Consider system upgrade'
    ];
    
    const efficiencyGap = optimalEfficiency - currentEfficiency;
    if (efficiencyGap > 10) {
      improvements.push('Consider boiler replacement');
    }
    
    return improvements.slice(0, 4);
  }

  private calculatePotentialSavings(currentEfficiency: number, optimalEfficiency: number): number {
    const efficiencyGap = optimalEfficiency - currentEfficiency;
    const annualHeatingCost = 1200; // Mock annual heating cost
    const potentialSavings = (efficiencyGap / 100) * annualHeatingCost;
    return Math.round(potentialSavings);
  }

  private determineServiceType(riskLevel: string): string {
    const serviceTypes = {
      low: 'annual_service',
      medium: 'comprehensive_service',
      high: 'emergency_service'
    };
    
    return serviceTypes[riskLevel as keyof typeof serviceTypes] || 'annual_service';
  }

  private estimateServiceDuration(serviceType: string): number {
    const durations = {
      annual_service: 2,
      comprehensive_service: 4,
      emergency_service: 6
    };
    
    return durations[serviceType as keyof typeof durations] || 2;
  }

  private getRequiredParts(serviceType: string, riskLevel: string): string[] {
    const baseParts = ['Filters', 'Gaskets'];
    
    if (serviceType === 'comprehensive_service') {
      baseParts.push('Thermostat', 'Pressure sensor');
    }
    
    if (riskLevel === 'high') {
      baseParts.push('Heat exchanger', 'Burner assembly');
    }
    
    return baseParts;
  }

  private generateOptimizationRecommendations(
    efficiencyAnalysis: EfficiencyAnalysis,
    failurePrediction: FailurePrediction | null
  ): string[] {
    const recommendations = [
      ...efficiencyAnalysis.improvement_recommendations
    ];
    
    if (failurePrediction && failurePrediction.failure_probability > 0.2) {
      recommendations.push('Schedule preventive maintenance');
      recommendations.push('Consider component replacement');
    }
    
    return recommendations.slice(0, 5);
  }

  private determineOptimizationPriority(
    efficiencyAnalysis: EfficiencyAnalysis,
    failurePrediction: FailurePrediction | null
  ): 'low' | 'medium' | 'high' {
    if (failurePrediction && failurePrediction.urgency_level === 'critical') return 'high';
    if (efficiencyAnalysis.efficiency_trend === 'declining') return 'medium';
    return 'low';
  }

  private estimateOptimizationImpact(efficiencyAnalysis: EfficiencyAnalysis): string {
    const improvement = efficiencyAnalysis.optimal_efficiency - efficiencyAnalysis.current_efficiency;
    if (improvement > 10) return 'High impact - significant efficiency gains possible';
    if (improvement > 5) return 'Medium impact - moderate efficiency improvements';
    return 'Low impact - minor optimizations available';
  }

  private calculateImplementationCost(recommendations: string[]): number {
    const costPerRecommendation = 50;
    return recommendations.length * costPerRecommendation;
  }

  private calculatePaybackPeriod(implementationCost: number, annualSavings: number): number {
    if (annualSavings <= 0) return 0;
    return Math.ceil(implementationCost / annualSavings);
  }

  private calculateMaintenanceHealthScore(prediction: MaintenancePrediction): number {
    const riskScores = { low: 85, medium: 65, high: 35 };
    const baseScore = riskScores[prediction.risk_level];
    return baseScore + Math.floor(Math.random() * 20) - 10; // ±10 variation
  }

  private calculateEfficiencyScore(analysis: EfficiencyAnalysis): number {
    return Math.round((analysis.current_efficiency / analysis.optimal_efficiency) * 100);
  }

  private calculateReliabilityScore(prediction: FailurePrediction): number {
    return Math.round((1 - prediction.failure_probability) * 100);
  }

  private determineOverallRiskLevel(
    maintenanceScore: number,
    efficiencyScore: number,
    reliabilityScore: number
  ): 'low' | 'medium' | 'high' {
    const averageScore = (maintenanceScore + efficiencyScore + reliabilityScore) / 3;
    
    if (averageScore >= 75) return 'low';
    if (averageScore >= 50) return 'medium';
    return 'high';
  }

  private generateKeyInsights(
    maintenancePrediction: MaintenancePrediction,
    failurePrediction: FailurePrediction,
    efficiencyAnalysis: EfficiencyAnalysis
  ): string[] {
    const insights = [
      `Efficiency is ${efficiencyAnalysis.efficiency_trend} (${efficiencyAnalysis.current_efficiency}% vs optimal ${efficiencyAnalysis.optimal_efficiency}%)`,
      `Failure probability is ${Math.round(failurePrediction.failure_probability * 100)}%`,
      `Next optimal service date: ${maintenancePrediction.next_service_optimal}`,
      `Potential annual savings: £${efficiencyAnalysis.potential_savings}`
    ];
    
    return insights;
  }

  private generateRecommendedActions(
    maintenancePrediction: MaintenancePrediction,
    failurePrediction: FailurePrediction,
    efficiencyAnalysis: EfficiencyAnalysis
  ): string[] {
    const actions = [
      ...maintenancePrediction.recommended_actions,
      ...efficiencyAnalysis.improvement_recommendations
    ];
    
    if (failurePrediction.failure_probability > 0.2) {
      actions.push('Schedule preventive maintenance');
    }
    
    return actions.slice(0, 5);
  }
}

// Export singleton instance
export const aiPredictionService = new AIPredictionService(); 