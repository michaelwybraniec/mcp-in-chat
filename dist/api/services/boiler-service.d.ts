import { Boiler, Inventory } from '../../types/index.js';
/**
 * Mock Boiler Service for demo purposes
 * Handles reading boiler catalog and inventory data from JSON files
 */
export declare class BoilerService {
    /**
     * Get all boilers from catalog
     */
    getAllBoilers(): Promise<Boiler[]>;
    /**
     * Get boiler by model
     */
    getBoilerByModel(model: string): Promise<Boiler | null>;
    /**
     * Get boilers by manufacturer
     */
    getBoilersByManufacturer(manufacturer: string): Promise<Boiler[]>;
    /**
     * Get boilers by efficiency rating
     */
    getBoilersByEfficiency(minEfficiency: string): Promise<Boiler[]>;
    /**
     * Get boilers by price range
     */
    getBoilersByPriceRange(minPrice: number, maxPrice: number): Promise<Boiler[]>;
    /**
     * Search boilers by features
     */
    searchBoilersByFeatures(features: string[]): Promise<Boiler[]>;
    /**
     * Get all inventory items
     */
    getAllInventory(): Promise<Inventory[]>;
    /**
     * Get inventory by model
     */
    getInventoryByModel(model: string): Promise<Inventory | null>;
    /**
     * Get available inventory (in stock)
     */
    getAvailableInventory(): Promise<Inventory[]>;
    /**
     * Get low stock inventory
     */
    getLowStockInventory(): Promise<Inventory[]>;
    /**
     * Get out of stock inventory
     */
    getOutOfStockInventory(): Promise<Inventory[]>;
    /**
     * Check if boiler is available for purchase
     */
    isBoilerAvailable(model: string, quantity?: number): Promise<boolean>;
    /**
     * Get boiler with inventory information
     */
    getBoilerWithInventory(model: string): Promise<{
        boiler: Boiler | null;
        inventory: Inventory | null;
    }>;
    /**
     * Get recommended boilers based on criteria
     */
    getRecommendedBoilers(criteria: {
        maxPrice?: number;
        minEfficiency?: string;
        features?: string[];
        manufacturer?: string;
    }): Promise<Boiler[]>;
    /**
     * Compare boilers
     */
    compareBoilers(models: string[]): Promise<{
        [key: string]: Boiler | null;
    }>;
    /**
     * Get warranty information for boiler
     */
    getWarrantyInfo(model: string): Promise<any>;
}
export declare const boilerService: BoilerService;
//# sourceMappingURL=boiler-service.d.ts.map