# Demo Conversation Flows

This document provides sample chatbot conversations demonstrating how each MCP tool is used in real-world scenarios.

## Overview

These conversation flows show how external chatbots (Claude, ChatGPT, Cursor) can interact with the Boiler Maintenance MCP Server to provide comprehensive boiler services.

## Conversation Flow 1: Boiler Information Query

### Scenario
Customer wants to check their boiler warranty status and get information about their current boiler.

### Conversation Flow

**Customer**: "Hi, I need to check my boiler warranty status. My customer ID is CUST001."

**Chatbot**: "I'll help you check your boiler warranty status. Let me retrieve that information for you."

*[Chatbot calls boiler-info tool]*
```json
{
  "tool": "boiler-info",
  "input": {
    "customer_id": "CUST001"
  }
}
```

**Chatbot**: "Here's your boiler information:

**Boiler Details:**
- Model: EcoMax Pro 30kW
- Manufacturer: Worcester Bosch
- Efficiency: 94%
- Fuel Type: Natural Gas
- Installation Date: March 15, 2020
- Age: 3 years

**Warranty Status:**
- ✅ **Active**: Yes
- Duration: 10 years
- Days Remaining: 2,555 days
- Warranty End Date: March 15, 2030
- Coverage: Parts and labor

**Key Features:**
- Condensing Technology
- Smart Controls
- Weather Compensation
- OpenTherm Compatible

**Recommendations:**
- Your boiler is performing excellently with 94% efficiency
- Annual maintenance is due on February 15, 2024
- No upgrade recommended at this time

Would you like me to schedule your annual maintenance service?"

**Customer**: "Yes, that would be great. Can you schedule it for February 15th?"

**Chatbot**: "I'll schedule your annual maintenance service for February 15th."

*[Chatbot calls maintenance tool]*
```json
{
  "tool": "maintenance",
  "input": {
    "customer_id": "CUST001",
    "action": "schedule",
    "service_date": "2024-02-15",
    "service_type": "annual_service",
    "issue_description": "Annual maintenance service"
  }
}
```

**Chatbot**: "Perfect! I've scheduled your annual maintenance service:

**Service Details:**
- Date: February 15, 2024
- Time: 9:00 AM
- Service Type: Annual Service
- Technician: Mike Johnson (Rating: 4.8/5)
- Status: Confirmed

**Technician Skills:**
- Boiler Maintenance
- Gas Safety
- Efficiency Optimization

**Weather Check:**
- ✅ Weather conditions are suitable for maintenance
- Temperature: 12°C, Clear conditions

**Next Steps:**
- Confirmation email has been sent to john.smith@email.com
- Please ensure your boiler is accessible
- Technician will arrive with all necessary parts

Your next service will be due on February 15, 2025. Is there anything else you need help with?"

---

## Conversation Flow 2: Boiler Upgrade Purchase

### Scenario
Customer wants to upgrade their old boiler to a more efficient model.

### Conversation Flow

**Customer**: "I'm thinking about upgrading my boiler. Can you tell me about the EcoMax Pro 30kW model?"

**Chatbot**: "I'd be happy to help you with information about the EcoMax Pro 30kW boiler. Let me get the details for you."

*[Chatbot calls boiler-info tool to check current boiler]*
```json
{
  "tool": "boiler-info",
  "input": {
    "customer_id": "CUST001"
  }
}
```

**Chatbot**: "Based on your current boiler information, here's what I found:

**Your Current Boiler:**
- Model: EcoMax Pro 30kW (same model you're asking about!)
- Efficiency: 94%
- Age: 3 years
- Status: Excellent condition

**EcoMax Pro 30kW Features:**
- 94% efficiency rating
- Condensing Technology
- Smart Controls
- Weather Compensation
- OpenTherm Compatible
- 10-year warranty

**Inventory Status:**
- ✅ Available: 5 units in stock
- Location: Warehouse A

Since you already have this model, would you like me to:
1. Check if there are newer, more efficient models available
2. Schedule maintenance for your current boiler
3. Help you with something else?"

**Customer**: "Actually, I want to buy one for my new house. My customer ID is CUST002."

**Chatbot**: "I'll help you purchase the EcoMax Pro 30kW for your new house. Let me process that for you."

*[Chatbot calls purchase tool]*
```json
{
  "tool": "purchase",
  "input": {
    "customer_id": "CUST002",
    "boiler_model": "EcoMax Pro 30kW",
    "payment_info": {
      "method": "credit_card",
      "billing_address": "456 New Street, Newtown, ST 67890"
    },
    "installation_required": true,
    "preferred_installation_date": "2024-02-20"
  }
}
```

**Chatbot**: "Excellent! I've processed your boiler purchase:

**Order Details:**
- Order ID: ORD2024002
- Boiler: EcoMax Pro 30kW
- Total Amount: $2,500
- Status: Confirmed
- Estimated Delivery: February 18, 2024

**Payment:**
- Method: Credit Card
- Transaction ID: TXN2024002
- Status: Approved

**Installation:**
- ✅ Installation Service Included
- Scheduled Date: February 20, 2024
- Technician: Sarah Wilson
- Estimated Duration: 4-6 hours

**Warranty:**
- Duration: 10 years
- Coverage: Parts and labor

**Inventory Update:**
- Remaining stock: 4 units

Let me send you a confirmation email with all the details."

*[Chatbot calls email tool]*
```json
{
  "tool": "email",
  "input": {
    "to_email": "customer@newhouse.com",
    "subject": "Boiler Purchase Confirmation",
    "message": "Your EcoMax Pro 30kW boiler order has been confirmed. Delivery: Feb 18, Installation: Feb 20. Order ID: ORD2024002",
    "email_type": "confirmation",
    "customer_id": "CUST002",
    "order_id": "ORD2024002"
  }
}
```

**Chatbot**: "✅ Confirmation email sent to customer@newhouse.com

**Next Steps:**
1. You'll receive delivery confirmation on February 18
2. Installation team will contact you on February 19
3. Installation will take place on February 20

Is there anything else you need help with regarding your boiler purchase?"

---

## Conversation Flow 3: Emergency Service Request

### Scenario
Customer reports an urgent boiler issue and needs immediate assistance.

### Conversation Flow

**Customer**: "Help! My boiler is making strange noises and not heating properly. I need emergency service!"

**Chatbot**: "I understand this is urgent. Let me help you get emergency service right away. What's your customer ID?"

**Customer**: "CUST001"

**Chatbot**: "I'll schedule emergency service for you immediately."

*[Chatbot calls maintenance tool]*
```json
{
  "tool": "maintenance",
  "input": {
    "customer_id": "CUST001",
    "action": "schedule",
    "service_date": "2024-01-15",
    "service_type": "emergency_service",
    "issue_description": "Strange noises and not heating properly - emergency service required"
  }
}
```

**Chatbot**: "🚨 Emergency service scheduled!

**Emergency Service Details:**
- Date: Today (January 15, 2024)
- Time: ASAP (within 2 hours)
- Service Type: Emergency Repair
- Technician: David Emergency (Specialist in urgent repairs)
- Status: Priority Confirmed

**Technician Profile:**
- Rating: 4.9/5
- Specializations: Emergency Repairs, Fault Diagnosis, Quick Fixes
- Will arrive with emergency parts kit

**Safety Instructions:**
- If you smell gas, evacuate immediately and call emergency services
- Turn off the boiler if safe to do so
- Keep the area clear for the technician

Let me send you an urgent confirmation email."

*[Chatbot calls email tool]*
```json
{
  "tool": "email",
  "input": {
    "to_email": "john.smith@email.com",
    "subject": "URGENT: Emergency Boiler Service Scheduled",
    "message": "Emergency service confirmed for today. Technician David Emergency will arrive within 2 hours. If you smell gas, evacuate immediately.",
    "email_type": "notification",
    "customer_id": "CUST001"
  }
}
```

**Chatbot**: "✅ Urgent confirmation email sent to john.smith@email.com

**What to expect:**
- Technician will call you 30 minutes before arrival
- They'll diagnose the issue and provide immediate solutions
- If parts are needed, they'll be ordered and installed as soon as possible

**Safety First:** If you experience any gas smells or unusual sounds, please evacuate and call emergency services immediately.

Is there anything else I can help you with while you wait for the technician?"

---

## Conversation Flow 4: Maintenance Reminder and Scheduling

### Scenario
Customer receives a maintenance reminder and wants to schedule service.

### Conversation Flow

**Customer**: "I got an email saying my boiler maintenance is due. Can you help me schedule it?"

**Chatbot**: "Of course! Let me check your maintenance schedule and help you book a convenient time."

*[Chatbot calls maintenance tool]*
```json
{
  "tool": "maintenance",
  "input": {
    "customer_id": "CUST001",
    "action": "get"
  }
}
```

**Chatbot**: "I can see your maintenance information:

**Current Status:**
- Next Service Due: February 15, 2024
- Priority: Medium
- Estimated Cost: $150

**AI Predictions:**
- Failure Risk: Low (5% probability)
- Efficiency: 94% (Excellent)
- Recommended Actions: Annual service, Filter replacement

**Weather Analysis:**
- Optimal dates: February 15-17, 2024
- Weather conditions: Suitable for maintenance
- No weather alerts

**Recommendations:**
- Schedule service before warranty expires
- Consider filter replacement for optimal efficiency
- Weather conditions are perfect for maintenance

Would you like me to schedule your maintenance for February 15th, or do you prefer a different date?"

**Customer**: "February 15th works great for me."

**Chatbot**: "Perfect! I'll schedule your maintenance for February 15th."

*[Chatbot calls maintenance tool]*
```json
{
  "tool": "maintenance",
  "input": {
    "customer_id": "CUST001",
    "action": "schedule",
    "service_date": "2024-02-15",
    "service_type": "annual_service",
    "issue_description": "Annual maintenance service as recommended"
  }
}
```

**Chatbot**: "✅ Maintenance scheduled successfully!

**Service Details:**
- Date: February 15, 2024
- Time: 9:00 AM
- Technician: Mike Johnson (4.8/5 rating)
- Service Type: Annual Maintenance

**What's Included:**
- Full boiler inspection
- Filter replacement
- Efficiency optimization
- Safety checks
- Performance testing

**Preparation Tips:**
- Ensure boiler is accessible
- Clear the area around the boiler
- Have your warranty information ready

**Confirmation:**
- Email confirmation sent to john.smith@email.com
- Reminder will be sent 24 hours before service

Your next service will be due on February 15, 2025. Is there anything else you need help with?"

---

## Conversation Flow 5: Warranty Inquiry and Support

### Scenario
Customer has warranty questions and needs support contact information.

### Conversation Flow

**Customer**: "I have a question about my boiler warranty. Can you help me?"

**Chatbot**: "I'd be happy to help you with your warranty questions. Let me get your warranty information."

*[Chatbot calls boiler-info tool]*
```json
{
  "tool": "boiler-info",
  "input": {
    "customer_id": "CUST001"
  }
}
```

**Chatbot**: "Here's your warranty information:

**Warranty Status:**
- ✅ **Active**: Yes
- Duration: 10 years
- Days Remaining: 2,555 days
- Coverage Type: Standard Warranty
- Warranty End: March 15, 2030

**Coverage Details:**
- Parts and labor included
- Annual service required
- Genuine parts only
- Professional installation required

**Warranty Conditions:**
- Annual service must be performed
- Only genuine manufacturer parts
- Professional installation required
- Proper maintenance records needed

**Support Contact:**
- Phone: +1-800-WORCESTER
- Email: support@worcester-bosch.com
- Website: https://www.worcester-bosch.co.uk

What specific warranty question do you have? I can help you with:
1. Coverage details
2. Service requirements
3. Claim procedures
4. Contacting support"

**Customer**: "I need to make a warranty claim. How do I contact them?"

**Chatbot**: "I'll help you contact warranty support. Here are your options:

**Direct Contact:**
- Phone: +1-800-WORCESTER (24/7 support)
- Email: support@worcester-bosch.com
- Website: https://www.worcester-bosch.co.uk

**For Warranty Claims:**
1. Call the support number
2. Have your customer ID ready: CUST001
3. Provide your boiler model: EcoMax Pro 30kW
4. Describe the issue you're experiencing

**Important Information to Have Ready:**
- Customer ID: CUST001
- Boiler Model: EcoMax Pro 30kW
- Installation Date: March 15, 2020
- Warranty End Date: March 15, 2030
- Service History: Annual services completed

Would you like me to send you an email with all this information for easy reference?"

*[Chatbot calls email tool]*
```json
{
  "tool": "email",
  "input": {
    "to_email": "john.smith@email.com",
    "subject": "Warranty Claim Information",
    "message": "Warranty claim contact info: Phone: +1-800-WORCESTER, Email: support@worcester-bosch.com. Have your customer ID (CUST001) and boiler model (EcoMax Pro 30kW) ready.",
    "email_type": "notification",
    "customer_id": "CUST001"
  }
}
```

**Chatbot**: "✅ Warranty information email sent to john.smith@email.com

**Next Steps:**
1. Contact warranty support using the provided information
2. Have your customer ID and boiler details ready
3. Describe your issue clearly
4. Follow their instructions for next steps

Is there anything else I can help you with regarding your warranty claim?"

---

## Key Features Demonstrated

### 1. Seamless Tool Integration
- Multiple tools used in single conversations
- Context maintained across tool calls
- Natural conversation flow

### 2. Comprehensive Information
- Detailed responses with structured data
- Clear formatting and organization
- Actionable recommendations

### 3. Error Handling
- Graceful handling of missing information
- Clear error messages
- Alternative suggestions

### 4. User Experience
- Natural language processing
- Proactive suggestions
- Confirmation and follow-up

### 5. Business Logic
- Weather considerations for scheduling
- Inventory management
- Payment processing
- Email confirmations

## Testing Scenarios

These conversation flows can be used to test:
- Tool functionality
- Response accuracy
- Error handling
- User experience
- Integration completeness

---

**Note**: These conversation flows demonstrate the power of MCP Server integration, showing how external chatbots can provide comprehensive boiler maintenance and sales services through structured tool calls. 