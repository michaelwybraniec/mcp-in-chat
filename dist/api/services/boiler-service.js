import { promises as fs } from 'fs';
import * as path from 'path';
const BOILERS_FILE = path.join(process.cwd(), 'data', 'boilers.json');
const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');
/**
 * Mock Boiler Service for demo purposes
 * Handles reading boiler catalog and inventory data from JSON files
 */
export class BoilerService {
    /**
     * Get all boilers from catalog
     */
    async getAllBoilers() {
        try {
            const data = await fs.readFile(BOILERS_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading boilers file:', error);
            throw new Error('Failed to read boiler catalog data');
        }
    }
    /**
     * Get boiler by model
     */
    async getBoilerByModel(model) {
        try {
            const boilers = await this.getAllBoilers();
            return boilers.find(boiler => boiler.model.toLowerCase() === model.toLowerCase()) || null;
        }
        catch (error) {
            console.error('Error getting boiler by model:', error);
            throw new Error('Failed to get boiler data');
        }
    }
    /**
     * Get boilers by manufacturer
     */
    async getBoilersByManufacturer(manufacturer) {
        try {
            const boilers = await this.getAllBoilers();
            const searchTerm = manufacturer.toLowerCase();
            return boilers.filter(boiler => boiler.manufacturer.toLowerCase().includes(searchTerm));
        }
        catch (error) {
            console.error('Error getting boilers by manufacturer:', error);
            throw new Error('Failed to get boilers by manufacturer');
        }
    }
    /**
     * Get boilers by efficiency rating
     */
    async getBoilersByEfficiency(minEfficiency) {
        try {
            const boilers = await this.getAllBoilers();
            const minEfficiencyNum = parseInt(minEfficiency.replace('%', ''));
            return boilers.filter(boiler => {
                const efficiencyNum = parseInt(boiler.efficiency.replace('%', ''));
                return efficiencyNum >= minEfficiencyNum;
            });
        }
        catch (error) {
            console.error('Error getting boilers by efficiency:', error);
            throw new Error('Failed to get boilers by efficiency');
        }
    }
    /**
     * Get boilers by price range
     */
    async getBoilersByPriceRange(minPrice, maxPrice) {
        try {
            const boilers = await this.getAllBoilers();
            return boilers.filter(boiler => boiler.price >= minPrice && boiler.price <= maxPrice);
        }
        catch (error) {
            console.error('Error getting boilers by price range:', error);
            throw new Error('Failed to get boilers by price range');
        }
    }
    /**
     * Search boilers by features
     */
    async searchBoilersByFeatures(features) {
        try {
            const boilers = await this.getAllBoilers();
            return boilers.filter(boiler => features.every(feature => boiler.features.some(boilerFeature => boilerFeature.toLowerCase().includes(feature.toLowerCase()))));
        }
        catch (error) {
            console.error('Error searching boilers by features:', error);
            throw new Error('Failed to search boilers by features');
        }
    }
    /**
     * Get all inventory items
     */
    async getAllInventory() {
        try {
            const data = await fs.readFile(INVENTORY_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading inventory file:', error);
            throw new Error('Failed to read inventory data');
        }
    }
    /**
     * Get inventory by model
     */
    async getInventoryByModel(model) {
        try {
            const inventory = await this.getAllInventory();
            return inventory.find(item => item.model.toLowerCase() === model.toLowerCase()) || null;
        }
        catch (error) {
            console.error('Error getting inventory by model:', error);
            throw new Error('Failed to get inventory data');
        }
    }
    /**
     * Get available inventory (in stock)
     */
    async getAvailableInventory() {
        try {
            const inventory = await this.getAllInventory();
            return inventory.filter(item => item.status === 'in_stock' && item.quantity > 0);
        }
        catch (error) {
            console.error('Error getting available inventory:', error);
            throw new Error('Failed to get available inventory');
        }
    }
    /**
     * Get low stock inventory
     */
    async getLowStockInventory() {
        try {
            const inventory = await this.getAllInventory();
            return inventory.filter(item => item.status === 'low_stock' || (item.quantity > 0 && item.quantity <= 5));
        }
        catch (error) {
            console.error('Error getting low stock inventory:', error);
            throw new Error('Failed to get low stock inventory');
        }
    }
    /**
     * Get out of stock inventory
     */
    async getOutOfStockInventory() {
        try {
            const inventory = await this.getAllInventory();
            return inventory.filter(item => item.status === 'out_of_stock' || item.quantity === 0);
        }
        catch (error) {
            console.error('Error getting out of stock inventory:', error);
            throw new Error('Failed to get out of stock inventory');
        }
    }
    /**
     * Check if boiler is available for purchase
     */
    async isBoilerAvailable(model, quantity = 1) {
        try {
            const inventory = await this.getInventoryByModel(model);
            return inventory !== null && inventory.quantity >= quantity;
        }
        catch (error) {
            console.error('Error checking boiler availability:', error);
            return false;
        }
    }
    /**
     * Get boiler with inventory information
     */
    async getBoilerWithInventory(model) {
        try {
            const [boiler, inventory] = await Promise.all([
                this.getBoilerByModel(model),
                this.getInventoryByModel(model)
            ]);
            return { boiler, inventory };
        }
        catch (error) {
            console.error('Error getting boiler with inventory:', error);
            throw new Error('Failed to get boiler with inventory');
        }
    }
    /**
     * Get recommended boilers based on criteria
     */
    async getRecommendedBoilers(criteria) {
        try {
            let boilers = await this.getAllBoilers();
            if (criteria.maxPrice) {
                boilers = boilers.filter(boiler => boiler.price <= criteria.maxPrice);
            }
            if (criteria.minEfficiency) {
                const minEfficiencyNum = parseInt(criteria.minEfficiency.replace('%', ''));
                boilers = boilers.filter(boiler => {
                    const efficiencyNum = parseInt(boiler.efficiency.replace('%', ''));
                    return efficiencyNum >= minEfficiencyNum;
                });
            }
            if (criteria.features && criteria.features.length > 0) {
                boilers = boilers.filter(boiler => criteria.features.every(feature => boiler.features.some(boilerFeature => boilerFeature.toLowerCase().includes(feature.toLowerCase()))));
            }
            if (criteria.manufacturer) {
                const manufacturer = criteria.manufacturer.toLowerCase();
                boilers = boilers.filter(boiler => boiler.manufacturer.toLowerCase().includes(manufacturer));
            }
            // Sort by efficiency (descending) and then by price (ascending)
            return boilers.sort((a, b) => {
                const efficiencyA = parseInt(a.efficiency.replace('%', ''));
                const efficiencyB = parseInt(b.efficiency.replace('%', ''));
                if (efficiencyA !== efficiencyB) {
                    return efficiencyB - efficiencyA; // Higher efficiency first
                }
                return a.price - b.price; // Lower price first
            });
        }
        catch (error) {
            console.error('Error getting recommended boilers:', error);
            throw new Error('Failed to get recommended boilers');
        }
    }
    /**
     * Compare boilers
     */
    async compareBoilers(models) {
        try {
            const boilers = await this.getAllBoilers();
            const result = {};
            for (const model of models) {
                result[model] = boilers.find(boiler => boiler.model.toLowerCase() === model.toLowerCase()) || null;
            }
            return result;
        }
        catch (error) {
            console.error('Error comparing boilers:', error);
            throw new Error('Failed to compare boilers');
        }
    }
    /**
     * Get warranty information for boiler
     */
    async getWarrantyInfo(model) {
        try {
            const boiler = await this.getBoilerByModel(model);
            if (!boiler) {
                return null;
            }
            return boiler.warranty_info;
        }
        catch (error) {
            console.error('Error getting warranty info:', error);
            throw new Error('Failed to get warranty information');
        }
    }
}
// Export singleton instance
export const boilerService = new BoilerService();
//# sourceMappingURL=boiler-service.js.map