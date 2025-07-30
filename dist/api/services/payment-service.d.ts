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
    term: number;
    monthlyPayment: number;
    interestRate: number;
    approved: boolean;
    applicationId: string;
}
/**
 * Mock Payment Service for demo purposes
 * Simulates payment processing with always successful results
 */
export declare class PaymentService {
    /**
     * Process payment
     */
    processPayment(paymentInfo: PaymentInfo, orderId?: string): Promise<PaymentResult>;
    /**
     * Process credit card payment
     */
    processCreditCardPayment(cardNumber: string, expiryDate: string, cvv: string, amount: number, orderId?: string): Promise<PaymentResult>;
    /**
     * Process bank transfer
     */
    processBankTransfer(accountNumber: string, sortCode: string, amount: number, orderId?: string): Promise<PaymentResult>;
    /**
     * Process cash payment
     */
    processCashPayment(amount: number, orderId?: string): Promise<PaymentResult>;
    /**
     * Apply for finance
     */
    applyForFinance(customerId: string, amount: number, term?: number): Promise<FinanceApplication>;
    /**
     * Process finance payment
     */
    processFinancePayment(applicationId: string, amount: number, orderId?: string): Promise<PaymentResult>;
    /**
     * Get payment history for customer
     */
    getPaymentHistory(customerId: string): Promise<PaymentResult[]>;
    /**
     * Refund payment
     */
    refundPayment(transactionId: string, amount: number, reason: string): Promise<PaymentResult>;
    /**
     * Validate payment method
     */
    validatePaymentMethod(paymentInfo: PaymentInfo): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Get available payment methods
     */
    getAvailablePaymentMethods(): Array<{
        method: string;
        name: string;
        description: string;
        minAmount?: number;
        maxAmount?: number;
    }>;
    /**
     * Private helper methods
     */
    private simulateProcessingDelay;
    private generateTransactionId;
    private generateApplicationId;
    private calculateMonthlyPayment;
    private getInterestRate;
    private isValidExpiryDate;
    private getAllOrders;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment-service.d.ts.map