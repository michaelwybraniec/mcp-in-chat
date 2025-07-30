import { promises as fs } from 'fs';
import path from 'path';
const TECHNICIANS_FILE = path.join(process.cwd(), 'data', 'technicians.json');
/**
 * Mock Technician Service for demo purposes
 * Handles technician availability and service scheduling
 */
export class TechnicianService {
    /**
     * Get all technicians
     */
    async getAllTechnicians() {
        try {
            const data = await fs.readFile(TECHNICIANS_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading technicians file:', error);
            throw new Error('Failed to read technician data');
        }
    }
    /**
     * Get technician by ID
     */
    async getTechnicianById(technicianId) {
        try {
            const technicians = await this.getAllTechnicians();
            return technicians.find(tech => tech.id === technicianId) || null;
        }
        catch (error) {
            console.error('Error getting technician by ID:', error);
            throw new Error('Failed to get technician data');
        }
    }
    /**
     * Get technicians by location
     */
    async getTechniciansByLocation(location) {
        try {
            const technicians = await this.getAllTechnicians();
            return technicians.filter(tech => tech.location.toLowerCase().includes(location.toLowerCase()));
        }
        catch (error) {
            console.error('Error getting technicians by location:', error);
            throw new Error('Failed to get technicians by location');
        }
    }
    /**
     * Get technicians by skills
     */
    async getTechniciansBySkills(requiredSkills) {
        try {
            const technicians = await this.getAllTechnicians();
            return technicians.filter(tech => requiredSkills.every(skill => tech.skills.some(techSkill => techSkill.toLowerCase().includes(skill.toLowerCase()))));
        }
        catch (error) {
            console.error('Error getting technicians by skills:', error);
            throw new Error('Failed to get technicians by skills');
        }
    }
    /**
     * Get available technicians for a specific date and location
     */
    async getAvailableTechnicians(date, location, requiredSkills = []) {
        try {
            const technicians = await this.getAllTechnicians();
            const availableTechnicians = [];
            for (const technician of technicians) {
                if (technician.location.toLowerCase().includes(location.toLowerCase())) {
                    const hasRequiredSkills = requiredSkills.length === 0 ||
                        requiredSkills.every(skill => technician.skills.some(techSkill => techSkill.toLowerCase().includes(skill.toLowerCase())));
                    if (hasRequiredSkills) {
                        const availableSlots = this.getAvailableSlots(technician, date);
                        if (availableSlots.length > 0) {
                            availableTechnicians.push({
                                technician_id: technician.id,
                                date,
                                available_slots: availableSlots,
                                location: technician.location,
                                skills: technician.skills,
                                rating: technician.rating
                            });
                        }
                    }
                }
            }
            // Sort by rating (highest first)
            return availableTechnicians.sort((a, b) => b.rating - a.rating);
        }
        catch (error) {
            console.error('Error getting available technicians:', error);
            throw new Error('Failed to get available technicians');
        }
    }
    /**
     * Book a technician for service
     */
    async bookTechnician(customerId, technicianId, serviceDate, serviceTime, serviceType, estimatedDuration = 2) {
        try {
            const technician = await this.getTechnicianById(technicianId);
            if (!technician) {
                throw new Error('Technician not found');
            }
            // Check if technician is available at the requested time
            const availableSlots = this.getAvailableSlots(technician, serviceDate);
            if (!availableSlots.includes(serviceTime)) {
                throw new Error('Technician not available at requested time');
            }
            const booking = {
                booking_id: this.generateBookingId(),
                customer_id: customerId,
                technician_id: technicianId,
                service_date: serviceDate,
                service_time: serviceTime,
                service_type: serviceType,
                estimated_duration: estimatedDuration,
                status: 'scheduled',
                notes: `Service booked for ${serviceType}`
            };
            console.log(`📅 Mock Service Booking Created:`, {
                bookingId: booking.booking_id,
                customerId,
                technicianId,
                serviceDate,
                serviceTime,
                serviceType
            });
            return booking;
        }
        catch (error) {
            console.error('Error booking technician:', error);
            throw new Error('Failed to book technician');
        }
    }
    /**
     * Get technician schedule for a specific date
     */
    async getTechnicianSchedule(technicianId, date) {
        try {
            const technician = await this.getTechnicianById(technicianId);
            if (!technician) {
                throw new Error('Technician not found');
            }
            // Mock bookings for the date
            const mockBookings = [
                {
                    booking_id: 'BK001',
                    customer_id: 'CUST001',
                    technician_id: technicianId,
                    service_date: date,
                    service_time: '09:00',
                    service_type: 'annual_service',
                    estimated_duration: 2,
                    status: 'scheduled'
                },
                {
                    booking_id: 'BK002',
                    customer_id: 'CUST003',
                    technician_id: technicianId,
                    service_date: date,
                    service_time: '14:00',
                    service_type: 'repair',
                    estimated_duration: 3,
                    status: 'scheduled'
                }
            ];
            const availableHours = this.getAvailableSlots(technician, date);
            const totalBookedHours = mockBookings.reduce((sum, booking) => sum + booking.estimated_duration, 0);
            return {
                technician_id: technicianId,
                date,
                bookings: mockBookings,
                available_hours: availableHours,
                total_booked_hours: totalBookedHours
            };
        }
        catch (error) {
            console.error('Error getting technician schedule:', error);
            throw new Error('Failed to get technician schedule');
        }
    }
    /**
     * Cancel a service booking
     */
    async cancelBooking(bookingId) {
        try {
            console.log(`❌ Mock Booking Cancelled:`, { bookingId });
            return true;
        }
        catch (error) {
            console.error('Error cancelling booking:', error);
            return false;
        }
    }
    /**
     * Update booking status
     */
    async updateBookingStatus(bookingId, status, notes) {
        try {
            // Mock booking update
            const updatedBooking = {
                booking_id: bookingId,
                customer_id: 'CUST001',
                technician_id: 'TECH001',
                service_date: new Date().toISOString().split('T')[0],
                service_time: '09:00',
                service_type: 'annual_service',
                estimated_duration: 2,
                status,
                notes
            };
            console.log(`📝 Mock Booking Status Updated:`, {
                bookingId,
                status,
                notes
            });
            return updatedBooking;
        }
        catch (error) {
            console.error('Error updating booking status:', error);
            return null;
        }
    }
    /**
     * Get emergency technicians
     */
    async getEmergencyTechnicians(location) {
        try {
            const technicians = await this.getAllTechnicians();
            return technicians.filter(tech => tech.location.toLowerCase().includes(location.toLowerCase()) &&
                tech.specializations.some(spec => spec.toLowerCase().includes('emergency') ||
                    spec.toLowerCase().includes('repair'))).sort((a, b) => b.rating - a.rating);
        }
        catch (error) {
            console.error('Error getting emergency technicians:', error);
            throw new Error('Failed to get emergency technicians');
        }
    }
    /**
     * Get technician performance metrics
     */
    async getTechnicianPerformance(technicianId) {
        try {
            const technician = await this.getTechnicianById(technicianId);
            if (!technician) {
                throw new Error('Technician not found');
            }
            // Mock performance metrics
            return {
                total_services: Math.floor(Math.random() * 500) + 100,
                average_rating: technician.rating,
                completion_rate: Math.round((Math.random() * 0.1 + 0.95) * 100),
                customer_satisfaction: Math.round((Math.random() * 0.1 + 0.9) * 100),
                specializations: technician.specializations
            };
        }
        catch (error) {
            console.error('Error getting technician performance:', error);
            throw new Error('Failed to get technician performance');
        }
    }
    /**
     * Find best technician for a job
     */
    async findBestTechnician(location, requiredSkills, serviceType, preferredDate) {
        try {
            const availableTechnicians = await this.getAvailableTechnicians(preferredDate, location, requiredSkills);
            if (availableTechnicians.length === 0) {
                return null;
            }
            // Get the highest-rated available technician
            const bestTechnicianId = availableTechnicians[0].technician_id;
            return await this.getTechnicianById(bestTechnicianId);
        }
        catch (error) {
            console.error('Error finding best technician:', error);
            return null;
        }
    }
    /**
     * Get service recommendations based on technician availability
     */
    async getServiceRecommendations(customerId, serviceType, preferredDate, location) {
        try {
            const availableTechnicians = await this.getAvailableTechnicians(preferredDate, location);
            const recommendedTechnicians = await Promise.all(availableTechnicians.slice(0, 3).map(async (avail) => await this.getTechnicianById(avail.technician_id)));
            const alternativeDates = this.generateAlternativeDates(preferredDate);
            const estimatedCosts = {};
            for (const tech of recommendedTechnicians) {
                if (tech) {
                    estimatedCosts[tech.id] = this.estimateServiceCost(serviceType, tech.rating);
                }
            }
            return {
                recommended_technicians: recommendedTechnicians.filter(Boolean),
                alternative_dates: alternativeDates,
                estimated_costs: estimatedCosts
            };
        }
        catch (error) {
            console.error('Error getting service recommendations:', error);
            throw new Error('Failed to get service recommendations');
        }
    }
    /**
     * Private helper methods
     */
    getAvailableSlots(technician, date) {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const availability = technician.availability[dayOfWeek];
        if (typeof availability === 'string' && availability === 'emergency_only') {
            return ['emergency_only'];
        }
        if (Array.isArray(availability) && availability.length === 2) {
            const [start, end] = availability;
            return this.generateTimeSlots(start, end);
        }
        return [];
    }
    generateTimeSlots(start, end) {
        const slots = [];
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    }
    generateBookingId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `BK-${timestamp}-${random}`.toUpperCase();
    }
    generateAlternativeDates(preferredDate) {
        const dates = [];
        const preferred = new Date(preferredDate);
        for (let i = 1; i <= 7; i++) {
            const alternative = new Date(preferred.getTime() + i * 24 * 60 * 60 * 1000);
            dates.push(alternative.toISOString().split('T')[0]);
        }
        return dates;
    }
    estimateServiceCost(serviceType, technicianRating) {
        const baseCosts = {
            annual_service: 120,
            emergency_service: 200,
            repair: 150,
            installation: 300,
            inspection: 80
        };
        const baseCost = baseCosts[serviceType] || 120;
        const ratingMultiplier = 1 + (technicianRating - 4.5) * 0.1; // Higher rating = higher cost
        return Math.round(baseCost * ratingMultiplier);
    }
}
// Export singleton instance
export const technicianService = new TechnicianService();
//# sourceMappingURL=technician-service.js.map