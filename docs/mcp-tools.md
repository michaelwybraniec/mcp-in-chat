# MCP Tools Documentation

This document provides comprehensive documentation for all 4 MCP tools in the Boiler Maintenance MCP Server demo.

## Overview

The MCP Server provides 4 specialized tools for boiler maintenance and sales operations:

1. **Boiler Info Tool** - Get customer boiler details and warranty information
2. **Maintenance Tool** - Schedule maintenance with weather data and AI predictions
3. **Purchase Tool** - Process orders with inventory check and technician scheduling
4. **Email Tool** - Send confirmation emails to customers

## Tool Architecture

```
External Chatbot → MCP Server → Backend API → Mock Services → JSON Data
```

Each tool:
- Validates input using Zod schemas
- Calls the corresponding backend API endpoint
- Validates output against defined schemas
- Returns structured JSON responses

---

## 1. Boiler Info Tool

### Tool Name
`boiler-info`

### Description
Get customer boiler information and warranty details. Use this when a user asks about their boiler status, warranty, or boiler details.

### Input Schema
```json
{
  "customer_id": "string"
}
```

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | The customer ID to get boiler information for |

### Example Usage
```json
{
  "customer_id": "CUST001"
}
```

### Output Schema
```json
{
  "success": "boolean",
  "data": {
    "customer": {
      "id": "string",
      "name": "string",
      "email": "string",
      "address": "string",
      "phone": "string"
    },
    "boiler": {
      "model": "string",
      "manufacturer": "string",
      "efficiency": "string",
      "fuel_type": "string",
      "output": "string",
      "features": ["string"],
      "install_date": "string",
      "age_years": "number"
    },
    "warranty": {
      "info": {
        "duration": "string",
        "coverage": "string",
        "conditions": ["string"],
        "contact": {
          "phone": "string",
          "email": "string",
          "website": "string"
        }
      },
      "status": {
        "is_active": "boolean",
        "days_remaining": "number",
        "warranty_end": "string",
        "coverage_type": "string"
      }
    },
    "inventory": {
      "available": "boolean",
      "quantity": "number",
      "location": "string"
    }
  },
  "message": "string",
  "timestamp": "string"
}
```

### Example Response
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
        "Weather Compensation"
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
          "Genuine parts only"
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
      "location": "Warehouse A"
    }
  },
  "message": "Boiler information retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Use Cases
- Customer asks about their boiler warranty status
- Customer wants to know their boiler efficiency
- Customer inquires about boiler features and specifications
- Customer needs boiler maintenance recommendations

---

## 2. Maintenance Tool

### Tool Name
`maintenance`

### Description
Schedule maintenance services or get maintenance information. Use this when a user wants to schedule boiler maintenance, check maintenance status, or get maintenance recommendations.

### Input Schema
```json
{
  "customer_id": "string",
  "action": "get" | "schedule",
  "service_date": "string?",
  "service_type": "annual_service" | "emergency_service" | "repair"?,
  "issue_description": "string?"
}
```

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | The customer ID for maintenance operations |
| `action` | string | Yes | Action to perform: "get" (retrieve schedule) or "schedule" (book maintenance) |
| `service_date` | string | No | Service date for scheduling (YYYY-MM-DD format) |
| `service_type` | string | No | Type of maintenance service |
| `issue_description` | string | No | Description of the issue for emergency/repair services |

### Example Usage - Get Maintenance Info
```json
{
  "customer_id": "CUST001",
  "action": "get"
}
```

### Example Usage - Schedule Maintenance
```json
{
  "customer_id": "CUST001",
  "action": "schedule",
  "service_date": "2024-02-15",
  "service_type": "annual_service",
  "issue_description": "Annual maintenance service"
}
```

### Output Schema
```json
{
  "success": "boolean",
  "data": {
    "customer": {
      "id": "string",
      "name": "string",
      "boiler_model": "string"
    },
    "current_status": {
      "maintenance_prediction": "object",
      "failure_prediction": "object",
      "efficiency_analysis": "object",
      "predictive_schedule": "object"
    },
    "booking": {
      "booking_id": "string",
      "service_date": "string",
      "service_time": "string",
      "service_type": "string",
      "technician_id": "string",
      "status": "string"
    },
    "technician": {
      "id": "string",
      "rating": "number",
      "skills": ["string"]
    },
    "email_sent": "boolean",
    "maintenance_prediction": "object",
    "weather_conditions": {
      "suitable": "boolean",
      "location": "string",
      "date": "string"
    },
    "optimal_dates": ["string"],
    "weather_alerts": ["object"],
    "recommendations": ["string"]
  },
  "message": "string",
  "timestamp": "string"
}
```

### Example Response - Get Maintenance Info
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
      }
    },
    "weather_conditions": {
      "suitable": true,
      "location": "Anytown",
      "date": "2024-02-15"
    },
    "optimal_dates": ["2024-02-15", "2024-02-16", "2024-02-17"],
    "recommendations": [
      "Schedule annual service before warranty expires",
      "Weather conditions are suitable for maintenance"
    ]
  },
  "message": "Maintenance information retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Example Response - Schedule Maintenance
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
    "weather_conditions": {
      "suitable": true,
      "location": "Anytown",
      "date": "2024-02-15"
    },
    "recommendations": [
      "Service confirmed for 2024-02-15 at 09:00",
      "Technician will arrive with all necessary parts"
    ]
  },
  "message": "Maintenance service scheduled successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Use Cases
- Customer wants to schedule annual maintenance
- Customer reports boiler issues and needs emergency service
- Customer asks about maintenance recommendations
- Customer wants to check maintenance schedule

---

## 3. Purchase Tool

### Tool Name
`purchase`

### Description
Process boiler purchase orders with inventory check and technician scheduling. Use this when a user wants to buy a new boiler or upgrade their existing one.

### Input Schema
```json
{
  "customer_id": "string",
  "boiler_model": "string",
  "payment_info": {
    "method": "credit_card" | "debit_card" | "bank_transfer",
    "card_number": "string?",
    "expiry_date": "string?",
    "cvv": "string?",
    "billing_address": "string"
  },
  "delivery_address": "string?",
  "installation_required": "boolean?",
  "preferred_installation_date": "string?"
}
```

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | The customer ID making the purchase |
| `boiler_model` | string | Yes | The boiler model to purchase |
| `payment_info` | object | Yes | Payment information |
| `payment_info.method` | string | Yes | Payment method |
| `payment_info.card_number` | string | No | Card number (last 4 digits only) |
| `payment_info.expiry_date` | string | No | Card expiry date (MM/YY format) |
| `payment_info.cvv` | string | No | Card CVV |
| `payment_info.billing_address` | string | Yes | Billing address |
| `delivery_address` | string | No | Delivery address (if different from billing) |
| `installation_required` | boolean | No | Whether installation service is required |
| `preferred_installation_date` | string | No | Preferred installation date (YYYY-MM-DD format) |

### Example Usage
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
  "installation_required": true,
  "preferred_installation_date": "2024-02-20"
}
```

### Output Schema
```json
{
  "success": "boolean",
  "data": {
    "order": {
      "order_id": "string",
      "customer_id": "string",
      "boiler_model": "string",
      "total_amount": "number",
      "order_date": "string",
      "status": "string",
      "estimated_delivery": "string"
    },
    "payment": {
      "transaction_id": "string",
      "amount": "number",
      "method": "string",
      "status": "string"
    },
    "boiler": {
      "model": "string",
      "manufacturer": "string",
      "efficiency": "string",
      "price": "number",
      "features": ["string"],
      "warranty_info": {
        "duration": "string",
        "coverage": "string"
      }
    },
    "installation": {
      "required": "boolean",
      "scheduled_date": "string?",
      "technician_id": "string?",
      "estimated_duration": "string?"
    },
    "inventory": {
      "available": "boolean",
      "quantity_after_order": "number",
      "location": "string"
    }
  },
  "message": "string",
  "timestamp": "string"
}
```

### Example Response
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

### Use Cases
- Customer wants to upgrade their boiler
- Customer needs a new boiler installation
- Customer asks about boiler pricing and features
- Customer wants to compare different boiler models

---

## 4. Email Tool

### Tool Name
`email`

### Description
Send confirmation emails to customers. Use this when you need to send order confirmations, maintenance reminders, or any other customer communications.

### Input Schema
```json
{
  "to_email": "string",
  "subject": "string",
  "message": "string",
  "email_type": "confirmation" | "reminder" | "notification" | "general"?,
  "customer_id": "string?",
  "order_id": "string?"
}
```

### Input Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to_email` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject line |
| `message` | string | Yes | Email message content |
| `email_type` | string | No | Type of email being sent |
| `customer_id` | string | No | Customer ID for tracking purposes |
| `order_id` | string | No | Order ID for order-related emails |

### Example Usage
```json
{
  "to_email": "customer@example.com",
  "subject": "Order Confirmation",
  "message": "Your order has been confirmed and will be delivered on 2024-02-18.",
  "email_type": "confirmation",
  "customer_id": "CUST001",
  "order_id": "ORD2024001"
}
```

### Output Schema
```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "message_id": "string",
    "sent_to": "string",
    "subject": "string",
    "sent_at": "string",
    "email_type": "string",
    "status": "string"
  }
}
```

### Example Response
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

### Use Cases
- Send order confirmation emails
- Send maintenance appointment reminders
- Send warranty expiration notifications
- Send general customer communications

---

## Tool Integration Examples

### Complete Workflow Example

**Scenario**: Customer wants to upgrade their boiler and schedule installation

1. **Get Boiler Info**
```json
{
  "tool": "boiler-info",
  "input": {
    "customer_id": "CUST001"
  }
}
```

2. **Process Purchase**
```json
{
  "tool": "purchase",
  "input": {
    "customer_id": "CUST001",
    "boiler_model": "EcoMax Pro 30kW",
    "payment_info": {
      "method": "credit_card",
      "billing_address": "123 Main Street, Anytown, ST 12345"
    },
    "installation_required": true
  }
}
```

3. **Send Confirmation Email**
```json
{
  "tool": "email",
  "input": {
    "to_email": "customer@example.com",
    "subject": "Order Confirmation",
    "message": "Your boiler upgrade has been confirmed...",
    "email_type": "confirmation",
    "customer_id": "CUST001",
    "order_id": "ORD2024001"
  }
}
```

## Error Handling

All tools follow consistent error handling patterns:

### Common Error Responses
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

### Error Types
- **Validation Errors**: Invalid input parameters
- **API Errors**: Backend API communication issues
- **Business Logic Errors**: Domain-specific rule violations
- **System Errors**: Internal server errors

## Testing

### Test Script
Use the provided test script to verify all tools:
```bash
node test-mcp-tools.js
```

### Individual Tool Testing
Each tool can be tested independently using the MCP server's tool calling interface.

---

**Note**: These tools are part of a demonstration project and use mock data. All external services (payments, emails, etc.) are simulated for demonstration purposes. 