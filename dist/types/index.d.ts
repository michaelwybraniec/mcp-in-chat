export interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    boiler_model: string;
    install_date: string;
    phone: string;
}
export interface Boiler {
    model: string;
    manufacturer: string;
    efficiency: string;
    price: number;
    features: string[];
    warranty_info: {
        duration: string;
        coverage: string;
        conditions: string[];
    };
    fuel_type: string;
    output: string;
}
export interface Maintenance {
    customer_id: string;
    last_service: string;
    next_service: string;
    status: 'scheduled' | 'overdue' | 'completed';
    ai_predictions: {
        next_service_optimal: string;
        risk_level: 'low' | 'medium' | 'high';
        recommended_actions: string[];
        efficiency_prediction: string;
    };
    service_history: ServiceRecord[];
}
export interface ServiceRecord {
    date: string;
    type: string;
    technician: string;
    notes: string;
}
export interface Inventory {
    model: string;
    quantity: number;
    location: string;
    price: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    arrival_date: string;
    supplier: string;
}
export interface Order {
    order_id: string;
    customer_id: string;
    boiler_model: string;
    order_date: string;
    status: 'pending' | 'processing' | 'completed';
    total: number;
    payment_method: string;
    installation_date: string | null;
    technician_id: string | null;
}
export interface Weather {
    date: string;
    location: string;
    temperature: {
        min: number;
        max: number;
        current: number;
    };
    conditions: string;
    precipitation_chance: number;
    wind_speed: number;
    maintenance_suitable: boolean;
    notes: string;
}
export interface Technician {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    availability: {
        monday: string[];
        tuesday: string[];
        wednesday: string[];
        thursday: string[];
        friday: string[];
        saturday: string[];
        sunday: string;
    };
    location: string;
    experience_years: number;
    rating: number;
    specializations: string[];
}
export interface Warranty {
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
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface BoilerInfoParams {
    customer_id: string;
}
export interface MaintenanceParams {
    customer_id: string;
    service_date?: string;
    service_type?: string;
}
export interface PurchaseParams {
    customer_id: string;
    boiler_model: string;
    payment_info: {
        method: string;
        amount: number;
    };
}
export interface EmailParams {
    to_email: string;
    subject: string;
    message: string;
}
//# sourceMappingURL=index.d.ts.map