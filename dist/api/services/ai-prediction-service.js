import { promises as fs } from 'fs';
import path from 'path';
const MAINTENANCE_FILE = path.join(process.cwd(), 'data', 'maintenance.json');
/**
 * Mock AI Prediction Service for demo purposes
 * Provides AI-powered predictions for maintenance and efficiency
 */
export class AIPredictionService {
    /**
     * Get maintenance prediction for a customer
     */
    async getMaintenancePrediction(customerId) {
        try {
            const maintenanceData = await this.getAllMaintenanceData();
            const customerMaintenance = maintenanceData.find(m => m.customer_id === customerId);
            if (!customerMaintenance) {
                return null;
            }
            // Mock AI prediction based on existing data
            const prediction = {
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
        }
        catch (error) {
            console.error('Error getting maintenance prediction:', error);
            throw new Error('Failed to get maintenance prediction');
        }
    }
    /**
     * Get failure prediction for a customer's boiler
     */
    async getFailurePrediction(customerId) {
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
            const prediction = {
                customer_id: customerId,
                boiler_model: await this.getCustomerBoilerModel(customerId),
                failure_probability: failureProbability,
                estimated_failure_date: estimatedFailureDate,
                risk_factors: riskFactors,
                recommended_preventive_actions: this.getPreventiveActions(riskFactors),
                urgency_level: urgencyLevel
            };
            return prediction;
        }
        catch (error) {
            console.error('Error getting failure prediction:', error);
            throw new Error('Failed to get failure prediction');
        }
    }
    /**
     * Get efficiency analysis for a customer's boiler
     */
    async getEfficiencyAnalysis(customerId) {
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
            const analysis = {
                customer_id: customerId,
                boiler_model: await this.getCustomerBoilerModel(customerId),
                current_efficiency: currentEfficiency,
                optimal_efficiency: optimalEfficiency,
                efficiency_trend: efficiencyTrend,
                improvement_recommendations: improvementRecommendations,
                potential_savings: potentialSavings
            };
            return analysis;
        }
        catch (error) {
            console.error('Error getting efficiency analysis:', error);
            throw new Error('Failed to get efficiency analysis');
        }
    }
    /**
     * Get predictive maintenance schedule
     */
    async getPredictiveMaintenanceSchedule(customerId) {
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
        }
        catch (error) {
            console.error('Error getting predictive maintenance schedule:', error);
            throw new Error('Failed to get predictive maintenance schedule');
        }
    }
    /**
     * Get AI recommendations for boiler optimization
     */
    async getBoilerOptimizationRecommendations(customerId) {
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
        }
        catch (error) {
            console.error('Error getting boiler optimization recommendations:', error);
            throw new Error('Failed to get boiler optimization recommendations');
        }
    }
    /**
     * Get predictive analytics summary
     */
    async getPredictiveAnalyticsSummary(customerId) {
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
        }
        catch (error) {
            console.error('Error getting predictive analytics summary:', error);
            throw new Error('Failed to get predictive analytics summary');
        }
    }
    /**
     * Private helper methods
     */
    async getAllMaintenanceData() {
        try {
            const data = await fs.readFile(MAINTENANCE_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading maintenance file:', error);
            throw new Error('Failed to read maintenance data');
        }
    }
    async getCustomerBoilerModel(customerId) {
        try {
            const { customerService } = await import('./customer-service.js');
            const customer = await customerService.getCustomerById(customerId);
            return customer?.boiler_model || 'Unknown Model';
        }
        catch (error) {
            console.error('Error getting customer boiler model:', error);
            return 'Unknown Model';
        }
    }
    generateConfidenceScore() {
        // Mock confidence score between 0.7 and 0.95
        return Math.round((Math.random() * 0.25 + 0.7) * 100) / 100;
    }
    generatePredictionFactors(maintenance) {
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
    estimateMaintenanceCost(riskLevel) {
        const baseCosts = {
            low: 150,
            medium: 250,
            high: 400
        };
        const baseCost = baseCosts[riskLevel] || 200;
        const variation = Math.random() * 0.3 + 0.85; // ±15% variation
        return Math.round(baseCost * variation);
    }
    calculateFailureProbability(maintenance) {
        const riskLevels = { low: 0.05, medium: 0.15, high: 0.35 };
        const baseProbability = riskLevels[maintenance.ai_predictions.risk_level] || 0.1;
        // Add some randomness
        const variation = Math.random() * 0.2 + 0.9; // ±10% variation
        return Math.round(baseProbability * variation * 100) / 100;
    }
    estimateFailureDate(maintenance) {
        const daysToAdd = maintenance.ai_predictions.risk_level === 'high' ?
            Math.floor(Math.random() * 90) + 30 : // 30-120 days for high risk
            Math.floor(Math.random() * 365) + 180; // 180-545 days for low/medium risk
        const nextServiceDate = new Date(maintenance.next_service);
        const failureDate = new Date(nextServiceDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        return failureDate.toISOString().split('T')[0];
    }
    identifyRiskFactors(maintenance) {
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
    determineUrgencyLevel(failureProbability) {
        if (failureProbability > 0.3)
            return 'critical';
        if (failureProbability > 0.2)
            return 'high';
        if (failureProbability > 0.1)
            return 'medium';
        return 'low';
    }
    getPreventiveActions(riskFactors) {
        const actionMap = {
            'Aging components': ['Schedule component replacement', 'Increase monitoring frequency'],
            'Inconsistent maintenance': ['Establish regular service schedule', 'Set up maintenance reminders'],
            'High usage patterns': ['Optimize usage patterns', 'Consider efficiency upgrades'],
            'Environmental stress': ['Improve ventilation', 'Install protective measures'],
            'Component wear': ['Replace worn components', 'Implement preventive maintenance'],
            'Efficiency degradation': ['Clean system components', 'Optimize settings'],
            'Previous repairs': ['Monitor repaired components', 'Schedule follow-up inspection'],
            'Operating conditions': ['Adjust operating parameters', 'Improve environmental conditions']
        };
        const actions = [];
        riskFactors.forEach(factor => {
            if (actionMap[factor]) {
                actions.push(...actionMap[factor]);
            }
        });
        return actions.slice(0, 4); // Return max 4 actions
    }
    getOptimalEfficiency(boilerModel) {
        // Mock optimal efficiency based on boiler model
        const modelEfficiencies = {
            'Worcester Bosch 8000 Style': 94,
            'Vaillant ecoTEC plus': 92,
            'Ideal Logic+ Combi': 93,
            'Baxi 800': 91,
            'Glow-worm Energy': 90
        };
        return modelEfficiencies[boilerModel] || 90;
    }
    analyzeEfficiencyTrend(maintenance) {
        const efficiency = parseInt(maintenance.ai_predictions.efficiency_prediction.replace('%', ''));
        const optimalEfficiency = this.getOptimalEfficiency(maintenance.customer_id);
        if (efficiency >= optimalEfficiency - 2)
            return 'stable';
        if (efficiency >= optimalEfficiency - 5)
            return 'declining';
        return 'declining';
    }
    getEfficiencyImprovements(currentEfficiency, optimalEfficiency) {
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
    calculatePotentialSavings(currentEfficiency, optimalEfficiency) {
        const efficiencyGap = optimalEfficiency - currentEfficiency;
        const annualHeatingCost = 1200; // Mock annual heating cost
        const potentialSavings = (efficiencyGap / 100) * annualHeatingCost;
        return Math.round(potentialSavings);
    }
    determineServiceType(riskLevel) {
        const serviceTypes = {
            low: 'annual_service',
            medium: 'comprehensive_service',
            high: 'emergency_service'
        };
        return serviceTypes[riskLevel] || 'annual_service';
    }
    estimateServiceDuration(serviceType) {
        const durations = {
            annual_service: 2,
            comprehensive_service: 4,
            emergency_service: 6
        };
        return durations[serviceType] || 2;
    }
    getRequiredParts(serviceType, riskLevel) {
        const baseParts = ['Filters', 'Gaskets'];
        if (serviceType === 'comprehensive_service') {
            baseParts.push('Thermostat', 'Pressure sensor');
        }
        if (riskLevel === 'high') {
            baseParts.push('Heat exchanger', 'Burner assembly');
        }
        return baseParts;
    }
    generateOptimizationRecommendations(efficiencyAnalysis, failurePrediction) {
        const recommendations = [
            ...efficiencyAnalysis.improvement_recommendations
        ];
        if (failurePrediction && failurePrediction.failure_probability > 0.2) {
            recommendations.push('Schedule preventive maintenance');
            recommendations.push('Consider component replacement');
        }
        return recommendations.slice(0, 5);
    }
    determineOptimizationPriority(efficiencyAnalysis, failurePrediction) {
        if (failurePrediction && failurePrediction.urgency_level === 'critical')
            return 'high';
        if (efficiencyAnalysis.efficiency_trend === 'declining')
            return 'medium';
        return 'low';
    }
    estimateOptimizationImpact(efficiencyAnalysis) {
        const improvement = efficiencyAnalysis.optimal_efficiency - efficiencyAnalysis.current_efficiency;
        if (improvement > 10)
            return 'High impact - significant efficiency gains possible';
        if (improvement > 5)
            return 'Medium impact - moderate efficiency improvements';
        return 'Low impact - minor optimizations available';
    }
    calculateImplementationCost(recommendations) {
        const costPerRecommendation = 50;
        return recommendations.length * costPerRecommendation;
    }
    calculatePaybackPeriod(implementationCost, annualSavings) {
        if (annualSavings <= 0)
            return 0;
        return Math.ceil(implementationCost / annualSavings);
    }
    calculateMaintenanceHealthScore(prediction) {
        const riskScores = { low: 85, medium: 65, high: 35 };
        const baseScore = riskScores[prediction.risk_level];
        return baseScore + Math.floor(Math.random() * 20) - 10; // ±10 variation
    }
    calculateEfficiencyScore(analysis) {
        return Math.round((analysis.current_efficiency / analysis.optimal_efficiency) * 100);
    }
    calculateReliabilityScore(prediction) {
        return Math.round((1 - prediction.failure_probability) * 100);
    }
    determineOverallRiskLevel(maintenanceScore, efficiencyScore, reliabilityScore) {
        const averageScore = (maintenanceScore + efficiencyScore + reliabilityScore) / 3;
        if (averageScore >= 75)
            return 'low';
        if (averageScore >= 50)
            return 'medium';
        return 'high';
    }
    generateKeyInsights(maintenancePrediction, failurePrediction, efficiencyAnalysis) {
        const insights = [
            `Efficiency is ${efficiencyAnalysis.efficiency_trend} (${efficiencyAnalysis.current_efficiency}% vs optimal ${efficiencyAnalysis.optimal_efficiency}%)`,
            `Failure probability is ${Math.round(failurePrediction.failure_probability * 100)}%`,
            `Next optimal service date: ${maintenancePrediction.next_service_optimal}`,
            `Potential annual savings: £${efficiencyAnalysis.potential_savings}`
        ];
        return insights;
    }
    generateRecommendedActions(maintenancePrediction, failurePrediction, efficiencyAnalysis) {
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
//# sourceMappingURL=ai-prediction-service.js.map