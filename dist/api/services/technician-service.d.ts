import { Technician } from '../../types/index.js';
export interface TechnicianAvailability {
    technician_id: string;
    date: string;
    available_slots: string[];
    location: string;
    skills: string[];
    rating: number;
}
export interface ServiceBooking {
    booking_id: string;
    customer_id: string;
    technician_id: string;
    service_date: string;
    service_time: string;
    service_type: string;
    estimated_duration: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
}
export interface TechnicianSchedule {
    technician_id: string;
    date: string;
    bookings: ServiceBooking[];
    available_hours: string[];
    total_booked_hours: number;
}
/**
 * Mock Technician Service for demo purposes
 * Handles technician availability and service scheduling
 */
export declare class TechnicianService {
    /**
     * Get all technicians
     */
    getAllTechnicians(): Promise<Technician[]>;
    /**
     * Get technician by ID
     */
    getTechnicianById(technicianId: string): Promise<Technician | null>;
    /**
     * Get technicians by location
     */
    getTechniciansByLocation(location: string): Promise<Technician[]>;
    /**
     * Get technicians by skills
     */
    getTechniciansBySkills(requiredSkills: string[]): Promise<Technician[]>;
    /**
     * Get available technicians for a specific date and location
     */
    getAvailableTechnicians(date: string, location: string, requiredSkills?: string[]): Promise<TechnicianAvailability[]>;
    /**
     * Book a technician for service
     */
    bookTechnician(customerId: string, technicianId: string, serviceDate: string, serviceTime: string, serviceType: string, estimatedDuration?: number): Promise<ServiceBooking>;
    /**
     * Get technician schedule for a specific date
     */
    getTechnicianSchedule(technicianId: string, date: string): Promise<TechnicianSchedule>;
    /**
     * Cancel a service booking
     */
    cancelBooking(bookingId: string): Promise<boolean>;
    /**
     * Update booking status
     */
    updateBookingStatus(bookingId: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled', notes?: string): Promise<ServiceBooking | null>;
    /**
     * Get emergency technicians
     */
    getEmergencyTechnicians(location: string): Promise<Technician[]>;
    /**
     * Get technician performance metrics
     */
    getTechnicianPerformance(technicianId: string): Promise<{
        total_services: number;
        average_rating: number;
        completion_rate: number;
        customer_satisfaction: number;
        specializations: string[];
    }>;
    /**
     * Find best technician for a job
     */
    findBestTechnician(location: string, requiredSkills: string[], serviceType: string, preferredDate: string): Promise<Technician | null>;
    /**
     * Get service recommendations based on technician availability
     */
    getServiceRecommendations(customerId: string, serviceType: string, preferredDate: string, location: string): Promise<{
        recommended_technicians: Technician[];
        alternative_dates: string[];
        estimated_costs: {
            [technicianId: string]: number;
        };
    }>;
    /**
     * Private helper methods
     */
    private getAvailableSlots;
    private generateTimeSlots;
    private generateBookingId;
    private generateAlternativeDates;
    private estimateServiceCost;
}
export declare const technicianService: TechnicianService;
//# sourceMappingURL=technician-service.d.ts.map