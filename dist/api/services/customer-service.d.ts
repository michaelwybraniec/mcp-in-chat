import { Customer } from '../../types/index.js';
/**
 * Mock Customer Service for demo purposes
 * Handles reading and writing customer data from JSON files
 */
export declare class CustomerService {
    /**
     * Get all customers
     */
    getAllCustomers(): Promise<Customer[]>;
    /**
     * Get customer by ID
     */
    getCustomerById(customerId: string): Promise<Customer | null>;
    /**
     * Get customer by email
     */
    getCustomerByEmail(email: string): Promise<Customer | null>;
    /**
     * Create new customer
     */
    createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer>;
    /**
     * Update customer
     */
    updateCustomer(customerId: string, updateData: Partial<Customer>): Promise<Customer | null>;
    /**
     * Delete customer
     */
    deleteCustomer(customerId: string): Promise<boolean>;
    /**
     * Search customers by name
     */
    searchCustomersByName(name: string): Promise<Customer[]>;
    /**
     * Get customers by boiler model
     */
    getCustomersByBoilerModel(boilerModel: string): Promise<Customer[]>;
    /**
     * Get customers with overdue maintenance
     */
    getCustomersWithOverdueMaintenance(): Promise<Customer[]>;
    /**
     * Save customers to JSON file
     */
    private saveCustomers;
    /**
     * Validate customer data
     */
    validateCustomerData(customerData: Partial<Customer>): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Validate email format
     */
    private isValidEmail;
    /**
     * Validate phone number format
     */
    private isValidPhone;
}
export declare const customerService: CustomerService;
//# sourceMappingURL=customer-service.d.ts.map