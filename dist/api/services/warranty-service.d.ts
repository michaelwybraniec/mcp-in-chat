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
export declare class WarrantyService {
    /**
     * Get warranty information for a specific boiler model
     */
    getWarrantyInfo(manufacturer: string, model: string): Promise<WarrantyInfo | null>;
    /**
     * Get warranty information by manufacturer
     */
    getWarrantiesByManufacturer(manufacturer: string): Promise<WarrantyInfo[]>;
    /**
     * Get warranty status for a customer's boiler
     */
    getWarrantyStatus(customerId: string): Promise<WarrantyStatus | null>;
    /**
     * Check if warranty is still active
     */
    isWarrantyActive(customerId: string): Promise<boolean>;
    /**
     * Get warranty extensions available for a boiler
     */
    getWarrantyExtensions(manufacturer: string, model: string): Promise<WarrantyExtension[]>;
    /**
     * Calculate warranty extension cost
     */
    calculateWarrantyExtensionCost(manufacturer: string, model: string, extensionType: string): Promise<number | null>;
    /**
     * Get warranty contact information
     */
    getWarrantyContact(manufacturer: string, model: string): Promise<{
        phone: string;
        email: string;
        website: string;
    } | null>;
    /**
     * Get all manufacturers with warranty information
     */
    getManufacturers(): Promise<string[]>;
    /**
     * Get warranty comparison for multiple models
     */
    compareWarranties(models: Array<{
        manufacturer: string;
        model: string;
    }>): Promise<{
        [key: string]: WarrantyInfo | null;
    }>;
    /**
     * Get warranty recommendations based on customer needs
     */
    getWarrantyRecommendations(criteria: {
        budget?: number;
        coverage_preference?: 'basic' | 'comprehensive' | 'premium';
        duration_preference?: 'short' | 'medium' | 'long';
    }): Promise<WarrantyInfo[]>;
    /**
     * Validate warranty claim eligibility
     */
    validateWarrantyClaim(customerId: string, issue: string, serviceDate: string): Promise<{
        eligible: boolean;
        reason: string;
        coverage_details: string;
        next_steps: string[];
    }>;
    /**
     * Get warranty statistics
     */
    getWarrantyStatistics(): Promise<{
        total_manufacturers: number;
        average_warranty_duration: string;
        most_common_coverage: string;
        extension_availability: number;
    }>;
    /**
     * Private helper methods
     */
    private getAllWarranties;
    private parseWarrantyDuration;
}
export declare const warrantyService: WarrantyService;
//# sourceMappingURL=warranty-service.d.ts.map