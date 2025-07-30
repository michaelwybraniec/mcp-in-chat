# API Endpoints Documentation

This document provides comprehensive documentation for all 4 API endpoints in the Boiler Maintenance MCP Server demo.

## Base URL
```
http://localhost:3001
```

## Authentication
All endpoints require API key authentication via the `Authorization` header:
```
Authorization: Bearer demo-key
```

## Common Response Format
All endpoints return JSON responses with the following structure:
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "timestamp": string
}
```

## Error Response Format
```json
{
  "success": false,
  "error": string,
  "message": string
}
```

---

## 1. Boiler Information Endpoint

### GET /api/boiler-info
Retrieves comprehensive boiler information and warranty details for a customer.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | Customer ID to get boiler information for |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/boiler-info?customer_id=CUST001" \
  -H "Authorization: Bearer demo-key"
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "John Smith",
      "email": "john.smith@email.com",
      "address": "123 Main Street, Anytown, ST 12345",
      "phone": "+1-555-0123"
    },
    "boiler": {
      "model": "EcoMax Pro 30kW",
      "manufacturer": "Worcester Bosch",
      "efficiency": "94%",
      "fuel_type": "Natural Gas",
      "output": "30kW",
      "features": [
        "Condensing Technology",
        "Smart Controls",
        "Weather Compensation",
        "OpenTherm Compatible"
      ],
      "install_date": "2020-03-15",
      "age_years": 3
    },
    "warranty": {
      "info": {
        "duration": "10 years",
        "coverage": "Parts and labor",
        "conditions": [
          "Annual service required",
          "Genuine parts only",
          "Professional installation"
        ],
        "contact": {
          "phone": "+1-800-WORCESTER",
          "email": "support@worcester-bosch.com",
          "website": "https://www.worcester-bosch.co.uk"
        }
      },
      "status": {
        "is_active": true,
        "days_remaining": 2555,
        "warranty_end": "2030-03-15",
        "coverage_type": "Standard Warranty"
      }
    },
    "inventory": {
      "available": true,
      "quantity": 5,
      "status": "In Stock",
      "location": "Warehouse A"
    },
    "recommendations": {
      "maintenance_due": true,
      "efficiency_rating": "Excellent",
      "upgrade_recommended": false,
      "next_service_date": "2024-02-15"
    }
  },
  "message": "Boiler information retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
- **400 Bad Request**: Missing or invalid customer_id
- **404 Not Found**: Customer not found
- **500 Internal Server Error**: Server error

---

## 2. Maintenance Endpoint

### GET /api/maintenance
Retrieves maintenance schedule and predictions for a customer.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | Customer ID to get maintenance information for |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/maintenance?customer_id=CUST001" \
  -H "Authorization: Bearer demo-key"
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "John Smith",
      "boiler_model": "EcoMax Pro 30kW"
    },
    "current_status": {
      "maintenance_prediction": {
        "next_service_due": "2024-02-15",
        "priority": "Medium",
        "estimated_cost": 150
      },
      "failure_prediction": {
        "risk_level": "Low",
        "probability": 0.05,
        "recommended_actions": ["Annual service", "Filter replacement"]
      },
      "efficiency_analysis": {
        "current_efficiency": 94,
        "optimal_efficiency": 96,
        "efficiency_trend": "Stable"
      },
      "predictive_schedule": {
        "next_3_months": ["2024-02-15", "2024-05-15"],
        "recommended_frequency": "Quarterly"
      }
    },
    "weather_conditions": {
      "suitable": true,
      "location": "Anytown",
      "date": "2024-02-15",
      "temperature": 12,
      "conditions": "Clear"
    },
    "optimal_dates": [
      "2024-02-15",
      "2024-02-16",
      "2024-02-17"
    ],
    "weather_alerts": [],
    "recommendations": [
      "Schedule annual service before warranty expires",
      "Consider filter replacement for optimal efficiency",
      "Weather conditions are suitable for maintenance"
    ]
  },
  "message": "Maintenance information retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/maintenance
Schedules maintenance service for a customer.

#### Request Body
```json
{
  "customer_id": "CUST001",
  "service_date": "2024-02-15",
  "service_type": "annual_service",
  "issue_description": "Annual maintenance service"
}
```

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | Customer ID |
| `service_date` | string | Yes | Service date (YYYY-MM-DD) |
| `service_type` | string | No | Type of service (annual_service, emergency_service, repair) |
| `issue_description` | string | No | Description of issues or service needed |

#### Example Request
```bash
curl -X POST "http://localhost:3001/api/maintenance" \
  -H "Authorization: Bearer demo-key" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "service_date": "2024-02-15",
    "service_type": "annual_service",
    "issue_description": "Annual maintenance service"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "John Smith",
      "boiler_model": "EcoMax Pro 30kW"
    },
    "booking": {
      "booking_id": "BK2024001",
      "service_date": "2024-02-15",
      "service_time": "09:00",
      "service_type": "annual_service",
      "technician_id": "TECH001",
      "status": "Confirmed"
    },
    "technician": {
      "id": "TECH001",
      "rating": 4.8,
      "skills": ["Boiler Maintenance", "Gas Safety", "Efficiency Optimization"]
    },
    "email_sent": true,
    "maintenance_prediction": {
      "next_service_due": "2025-02-15",
      "priority": "Low",
      "estimated_cost": 150
    },
    "weather_conditions": {
      "suitable": true,
      "location": "Anytown",
      "date": "2024-02-15"
    },
    "recommendations": [
      "Service confirmed for 2024-02-15 at 09:00",
      "Technician will arrive with all necessary parts",
      "Please ensure boiler is accessible"
    ]
  },
  "message": "Maintenance service scheduled successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
- **400 Bad Request**: Missing required fields or invalid data
- **404 Not Found**: Customer not found
- **409 Conflict**: Service date not available
- **500 Internal Server Error**: Server error

---

## 3. Purchase Endpoint

### POST /api/purchase
Processes boiler purchase orders with inventory check and technician scheduling.

#### Request Body
```json
{
  "customer_id": "CUST001",
  "boiler_model": "EcoMax Pro 30kW",
  "payment_info": {
    "method": "credit_card",
    "card_number": "1234",
    "expiry_date": "12/25",
    "cvv": "123",
    "billing_address": "123 Main Street, Anytown, ST 12345"
  },
  "delivery_address": "123 Main Street, Anytown, ST 12345",
  "installation_required": true,
  "preferred_installation_date": "2024-02-20"
}
```

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | Customer ID making the purchase |
| `boiler_model` | string | Yes | Boiler model to purchase |
| `payment_info` | object | Yes | Payment information |
| `payment_info.method` | string | Yes | Payment method (credit_card, debit_card, bank_transfer) |
| `payment_info.card_number` | string | No | Last 4 digits of card |
| `payment_info.expiry_date` | string | No | Card expiry date (MM/YY) |
| `payment_info.cvv` | string | No | Card CVV |
| `payment_info.billing_address` | string | Yes | Billing address |
| `delivery_address` | string | No | Delivery address (if different from billing) |
| `installation_required` | boolean | No | Whether installation is required |
| `preferred_installation_date` | string | No | Preferred installation date (YYYY-MM-DD) |

#### Example Request
```bash
curl -X POST "http://localhost:3001/api/purchase" \
  -H "Authorization: Bearer demo-key" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "boiler_model": "EcoMax Pro 30kW",
    "payment_info": {
      "method": "credit_card",
      "card_number": "1234",
      "expiry_date": "12/25",
      "cvv": "123",
      "billing_address": "123 Main Street, Anytown, ST 12345"
    },
    "installation_required": true,
    "preferred_installation_date": "2024-02-20"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "order": {
      "order_id": "ORD2024001",
      "customer_id": "CUST001",
      "boiler_model": "EcoMax Pro 30kW",
      "total_amount": 2500,
      "order_date": "2024-01-15",
      "status": "Confirmed",
      "estimated_delivery": "2024-02-18"
    },
    "payment": {
      "transaction_id": "TXN2024001",
      "amount": 2500,
      "method": "credit_card",
      "status": "Approved"
    },
    "boiler": {
      "model": "EcoMax Pro 30kW",
      "manufacturer": "Worcester Bosch",
      "efficiency": "94%",
      "price": 2000,
      "features": [
        "Condensing Technology",
        "Smart Controls",
        "Weather Compensation"
      ],
      "warranty_info": {
        "duration": "10 years",
        "coverage": "Parts and labor"
      }
    },
    "installation": {
      "required": true,
      "scheduled_date": "2024-02-20",
      "technician_id": "TECH002",
      "estimated_duration": "4-6 hours"
    },
    "inventory": {
      "available": true,
      "quantity_after_order": 4,
      "location": "Warehouse A"
    }
  },
  "message": "Purchase order processed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
- **400 Bad Request**: Missing required fields or invalid data
- **404 Not Found**: Customer or boiler model not found
- **409 Conflict**: Insufficient inventory
- **422 Unprocessable Entity**: Payment failed
- **500 Internal Server Error**: Server error

---

## 4. Email Endpoint

### POST /api/email
Sends confirmation emails to customers.

#### Request Body
```json
{
  "to_email": "customer@example.com",
  "subject": "Order Confirmation",
  "message": "Your order has been confirmed...",
  "email_type": "confirmation",
  "customer_id": "CUST001",
  "order_id": "ORD2024001"
}
```

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to_email` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject line |
| `message` | string | Yes | Email message content |
| `email_type` | string | No | Type of email (confirmation, reminder, notification, general) |
| `customer_id` | string | No | Customer ID for tracking |
| `order_id` | string | No | Order ID for order-related emails |

#### Example Request
```bash
curl -X POST "http://localhost:3001/api/email" \
  -H "Authorization: Bearer demo-key" \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "customer@example.com",
    "subject": "Order Confirmation",
    "message": "Your order has been confirmed and will be delivered on 2024-02-18.",
    "email_type": "confirmation",
    "customer_id": "CUST001",
    "order_id": "ORD2024001"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "message_id": "MSG2024001",
    "sent_to": "customer@example.com",
    "subject": "Order Confirmation",
    "sent_at": "2024-01-15T10:30:00.000Z",
    "email_type": "confirmation",
    "status": "Delivered"
  }
}
```

#### Error Responses
- **400 Bad Request**: Missing required fields or invalid email format
- **500 Internal Server Error**: Email service error

---

## Rate Limiting

All endpoints are subject to rate limiting:
- **General Rate Limit**: 100 requests per minute per IP
- **Authentication Required**: All endpoints require valid API key
- **CORS Enabled**: Cross-origin requests allowed from configured origins

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing API key |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., date not available) |
| 422 | Unprocessable Entity - Business logic error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Testing

### Health Check
```bash
curl -X GET "http://localhost:3001/health"
```

### Test Script
Use the provided test script to verify all endpoints:
```bash
node test-api.js
```

---

**Note**: This API is part of a demonstration project and uses mock data. All external services (payments, emails, etc.) are simulated for demonstration purposes. 