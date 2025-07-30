import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '../../types/index.js';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

export interface PaymentInfo {
  method: 'credit_card' | 'bank_transfer' | 'finance' | 'cash';
  amount: number;
  currency?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
  sortCode?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  message: string;
  orderId?: string;
}

export interface FinanceApplication {
  customerId: string;
  amount: number;
  term: number; // months
  monthlyPayment: number;
  interestRate: number;
  approved: boolean;
  applicationId: string;
}

/**
 * Mock Payment Service for demo purposes
 * Simulates payment processing with always successful results
 */
export class PaymentService {
  /**
   * Process payment
   */
  async processPayment(paymentInfo: PaymentInfo, orderId?: string): Promise<PaymentResult> {
    try {
      // Simulate processing delay
      await this.simulateProcessingDelay();
      
      // Generate mock transaction ID
      const transactionId = this.generateTransactionId();
      
      // Mock payment processing - always successful for demo
      const result: PaymentResult = {
        success: true,
        transactionId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency || 'GBP',
        method: paymentInfo.method,
        status: 'completed',
        timestamp: new Date().toISOString(),
        message: 'Payment processed successfully',
        orderId
      };
      
      // Log payment for demo purposes
      console.log(`💰 Mock Payment Processed:`, {
        transactionId,
        amount: result.amount,
        method: result.method,
        timestamp: result.timestamp
      });
      
      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Payment processing failed');
    }
  }

  /**
   * Process credit card payment
   */
  async processCreditCardPayment(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    amount: number,
    orderId?: string
  ): Promise<PaymentResult> {
    const paymentInfo: PaymentInfo = {
      method: 'credit_card',
      amount,
      currency: 'GBP',
      cardNumber,
      expiryDate,
      cvv
    };
    
    return this.processPayment(paymentInfo, orderId);
  }

  /**
   * Process bank transfer
   */
  async processBankTransfer(
    accountNumber: string,
    sortCode: string,
    amount: number,
    orderId?: string
  ): Promise<PaymentResult> {
    const paymentInfo: PaymentInfo = {
      method: 'bank_transfer',
      amount,
      currency: 'GBP',
      accountNumber,
      sortCode
    };
    
    return this.processPayment(paymentInfo, orderId);
  }

  /**
   * Process cash payment
   */
  async processCashPayment(amount: number, orderId?: string): Promise<PaymentResult> {
    const paymentInfo: PaymentInfo = {
      method: 'cash',
      amount,
      currency: 'GBP'
    };
    
    return this.processPayment(paymentInfo, orderId);
  }

  /**
   * Apply for finance
   */
  async applyForFinance(
    customerId: string,
    amount: number,
    term: number = 24
  ): Promise<FinanceApplication> {
    try {
      // Simulate processing delay
      await this.simulateProcessingDelay();
      
      // Mock finance application - always approved for demo
      const monthlyPayment = this.calculateMonthlyPayment(amount, term);
      const interestRate = this.getInterestRate(amount, term);
      
      const application: FinanceApplication = {
        customerId,
        amount,
        term,
        monthlyPayment,
        interestRate,
        approved: true,
        applicationId: this.generateApplicationId()
      };
      
      console.log(`💳 Mock Finance Application Approved:`, {
        applicationId: application.applicationId,
        customerId,
        amount,
        term,
        monthlyPayment
      });
      
      return application;
    } catch (error) {
      console.error('Error applying for finance:', error);
      throw new Error('Finance application failed');
    }
  }

  /**
   * Process finance payment
   */
  async processFinancePayment(
    applicationId: string,
    amount: number,
    orderId?: string
  ): Promise<PaymentResult> {
    const paymentInfo: PaymentInfo = {
      method: 'finance',
      amount,
      currency: 'GBP'
    };
    
    return this.processPayment(paymentInfo, orderId);
  }

  /**
   * Get payment history for customer
   */
  async getPaymentHistory(customerId: string): Promise<PaymentResult[]> {
    try {
      const orders = await this.getAllOrders();
      const customerOrders = orders.filter(order => order.customer_id === customerId);
      
      return customerOrders.map(order => ({
        success: true,
        transactionId: `TXN-${order.order_id}`,
        amount: order.total,
        currency: 'GBP',
        method: order.payment_method,
        status: order.status === 'completed' ? 'completed' : 'pending',
        timestamp: order.order_date,
        message: `Payment for order ${order.order_id}`,
        orderId: order.order_id
      }));
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw new Error('Failed to get payment history');
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<PaymentResult> {
    try {
      // Simulate processing delay
      await this.simulateProcessingDelay();
      
      const refundResult: PaymentResult = {
        success: true,
        transactionId: `REFUND-${transactionId}`,
        amount: -amount, // Negative amount for refund
        currency: 'GBP',
        method: 'refund',
        status: 'completed',
        timestamp: new Date().toISOString(),
        message: `Refund processed: ${reason}`
      };
      
      console.log(`🔄 Mock Refund Processed:`, {
        originalTransactionId: transactionId,
        refundAmount: amount,
        reason,
        timestamp: refundResult.timestamp
      });
      
      return refundResult;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Refund processing failed');
    }
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(paymentInfo: PaymentInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (paymentInfo.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (paymentInfo.method === 'credit_card') {
      if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 13) {
        errors.push('Invalid card number');
      }
      if (!paymentInfo.expiryDate || !this.isValidExpiryDate(paymentInfo.expiryDate)) {
        errors.push('Invalid expiry date');
      }
      if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
        errors.push('Invalid CVV');
      }
    }

    if (paymentInfo.method === 'bank_transfer') {
      if (!paymentInfo.accountNumber || paymentInfo.accountNumber.length < 8) {
        errors.push('Invalid account number');
      }
      if (!paymentInfo.sortCode || paymentInfo.sortCode.length !== 6) {
        errors.push('Invalid sort code');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): Array<{
    method: string;
    name: string;
    description: string;
    minAmount?: number;
    maxAmount?: number;
  }> {
    return [
      {
        method: 'credit_card',
        name: 'Credit Card',
        description: 'Visa, Mastercard, American Express',
        minAmount: 1,
        maxAmount: 10000
      },
      {
        method: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        minAmount: 100,
        maxAmount: 50000
      },
      {
        method: 'finance',
        name: 'Finance',
        description: '0% APR available on selected boilers',
        minAmount: 500,
        maxAmount: 15000
      },
      {
        method: 'cash',
        name: 'Cash',
        description: 'Pay on installation',
        minAmount: 1,
        maxAmount: 5000
      }
    ];
  }

  /**
   * Private helper methods
   */
  private async simulateProcessingDelay(): Promise<void> {
    // Simulate network delay (100-500ms)
    const delay = Math.random() * 400 + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  private generateApplicationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `FIN-${timestamp}-${random}`.toUpperCase();
  }

  private calculateMonthlyPayment(amount: number, term: number): number {
    const interestRate = this.getInterestRate(amount, term);
    const monthlyRate = interestRate / 12 / 100;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  }

  private getInterestRate(amount: number, term: number): number {
    // Mock interest rates based on amount and term
    if (amount >= 5000) {
      return term <= 12 ? 0 : term <= 24 ? 2.9 : 4.9;
    } else {
      return term <= 12 ? 0 : term <= 24 ? 3.9 : 5.9;
    }
  }

  private isValidExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    return expMonth >= 1 && expMonth <= 12 && 
           expYear >= currentYear && 
           (expYear > currentYear || expMonth >= currentMonth);
  }

  private async getAllOrders(): Promise<Order[]> {
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading orders file:', error);
      return [];
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService(); 