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
export declare class AIPredictionService {
    /**
     * Get maintenance prediction for a customer
     */
    getMaintenancePrediction(customerId: string): Promise<MaintenancePrediction | null>;
    /**
     * Get failure prediction for a customer's boiler
     */
    getFailurePrediction(customerId: string): Promise<FailurePrediction | null>;
    /**
     * Get efficiency analysis for a customer's boiler
     */
    getEfficiencyAnalysis(customerId: string): Promise<EfficiencyAnalysis | null>;
    /**
     * Get predictive maintenance schedule
     */
    getPredictiveMaintenanceSchedule(customerId: string): Promise<{
        next_service_date: string;
        service_type: string;
        priority: 'low' | 'medium' | 'high';
        estimated_duration: number;
        required_parts: string[];
        cost_estimate: number;
    }>;
    /**
     * Get AI recommendations for boiler optimization
     */
    getBoilerOptimizationRecommendations(customerId: string): Promise<{
        recommendations: string[];
        priority: 'low' | 'medium' | 'high';
        estimated_impact: string;
        implementation_cost: number;
        payback_period: number;
    }>;
    /**
     * Get predictive analytics summary
     */
    getPredictiveAnalyticsSummary(customerId: string): Promise<{
        maintenance_health_score: number;
        efficiency_score: number;
        reliability_score: number;
        overall_risk_level: 'low' | 'medium' | 'high';
        key_insights: string[];
        recommended_actions: string[];
    }>;
    /**
     * Private helper methods
     */
    private getAllMaintenanceData;
    private getCustomerBoilerModel;
    private generateConfidenceScore;
    private generatePredictionFactors;
    private estimateMaintenanceCost;
    private calculateFailureProbability;
    private estimateFailureDate;
    private identifyRiskFactors;
    private determineUrgencyLevel;
    private getPreventiveActions;
    private getOptimalEfficiency;
    private analyzeEfficiencyTrend;
    private getEfficiencyImprovements;
    private calculatePotentialSavings;
    private determineServiceType;
    private estimateServiceDuration;
    private getRequiredParts;
    private generateOptimizationRecommendations;
    private determineOptimizationPriority;
    private estimateOptimizationImpact;
    private calculateImplementationCost;
    private calculatePaybackPeriod;
    private calculateMaintenanceHealthScore;
    private calculateEfficiencyScore;
    private calculateReliabilityScore;
    private determineOverallRiskLevel;
    private generateKeyInsights;
    private generateRecommendedActions;
}
export declare const aiPredictionService: AIPredictionService;
//# sourceMappingURL=ai-prediction-service.d.ts.map