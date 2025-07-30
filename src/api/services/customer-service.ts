import { promises as fs } from 'fs';
import path from 'path';
import { Customer } from '../../types/index.js';

const CUSTOMERS_FILE = path.join(process.cwd(), 'data', 'customers.json');

/**
 * Mock Customer Service for demo purposes
 * Handles reading and writing customer data from JSON files
 */
export class CustomerService {
  /**
   * Get all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const data = await fs.readFile(CUSTOMERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading customers file:', error);
      throw new Error('Failed to read customer data');
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(customer => customer.id === customerId) || null;
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      throw new Error('Failed to get customer data');
    }
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(customer => customer.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting customer by email:', error);
      throw new Error('Failed to get customer data');
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const customers = await this.getAllCustomers();
      const newCustomer: Customer = {
        ...customerData,
        id: `CUST${String(customers.length + 1).padStart(3, '0')}`
      };
      
      customers.push(newCustomer);
      await this.saveCustomers(customers);
      
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId: string, updateData: Partial<Customer>): Promise<Customer | null> {
    try {
      const customers = await this.getAllCustomers();
      const customerIndex = customers.findIndex(customer => customer.id === customerId);
      
      if (customerIndex === -1) {
        return null;
      }
      
      customers[customerIndex] = {
        ...customers[customerIndex],
        ...updateData,
        id: customerId // Ensure ID doesn't change
      };
      
      await this.saveCustomers(customers);
      return customers[customerIndex];
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      const customers = await this.getAllCustomers();
      const filteredCustomers = customers.filter(customer => customer.id !== customerId);
      
      if (filteredCustomers.length === customers.length) {
        return false; // Customer not found
      }
      
      await this.saveCustomers(filteredCustomers);
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw new Error('Failed to delete customer');
    }
  }

  /**
   * Search customers by name
   */
  async searchCustomersByName(name: string): Promise<Customer[]> {
    try {
      const customers = await this.getAllCustomers();
      const searchTerm = name.toLowerCase();
      return customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw new Error('Failed to search customers');
    }
  }

  /**
   * Get customers by boiler model
   */
  async getCustomersByBoilerModel(boilerModel: string): Promise<Customer[]> {
    try {
      const customers = await this.getAllCustomers();
      const searchTerm = boilerModel.toLowerCase();
      return customers.filter(customer => 
        customer.boiler_model.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error getting customers by boiler model:', error);
      throw new Error('Failed to get customers by boiler model');
    }
  }

  /**
   * Get customers with overdue maintenance
   */
  async getCustomersWithOverdueMaintenance(): Promise<Customer[]> {
    try {
      const customers = await this.getAllCustomers();
      const today = new Date();
      
      // This would typically join with maintenance data
      // For demo purposes, we'll return customers with older install dates
      return customers.filter(customer => {
        const installDate = new Date(customer.install_date);
        const yearsSinceInstall = (today.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        return yearsSinceInstall > 1; // Consider overdue if installed more than 1 year ago
      });
    } catch (error) {
      console.error('Error getting customers with overdue maintenance:', error);
      throw new Error('Failed to get customers with overdue maintenance');
    }
  }

  /**
   * Save customers to JSON file
   */
  private async saveCustomers(customers: Customer[]): Promise<void> {
    try {
      await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving customers file:', error);
      throw new Error('Failed to save customer data');
    }
  }

  /**
   * Validate customer data
   */
  validateCustomerData(customerData: Partial<Customer>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (customerData.name && customerData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (customerData.email && !this.isValidEmail(customerData.email)) {
      errors.push('Invalid email format');
    }

    if (customerData.phone && !this.isValidPhone(customerData.phone)) {
      errors.push('Invalid phone number format');
    }

    if (customerData.address && customerData.address.trim().length < 10) {
      errors.push('Address must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

// Export singleton instance
export const customerService = new CustomerService(); 