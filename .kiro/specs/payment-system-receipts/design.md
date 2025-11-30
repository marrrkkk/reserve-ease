# Design Document

## Overview

A lightweight mock payment system integrated into the existing Laravel application with React frontend. The system will simulate payment processing and generate PDF receipts formatted for Philippines peso currency.

## Architecture

-   **Frontend**: React components for payment forms and receipt viewing
-   **Backend**: Laravel controllers for payment processing and receipt generation
-   **Database**: Simple payments table to track transactions
-   **File Storage**: PDF receipts stored in Laravel storage

## Components and Interfaces

### Database Schema

-   `payments` table: id, reservation_id, amount, currency (PHP), status, transaction_id, created_at
-   Add `payment_status` column to existing reservations table

### Frontend Components

-   `PaymentForm.jsx`: Mock payment form with PHP currency display
-   `ReceiptViewer.jsx`: Component to display and download receipts
-   Update existing reservation components to show payment status

### Backend Controllers

-   `PaymentController`: Handle payment simulation and receipt generation
-   Update existing reservation controllers to include payment status

## Data Models

### Payment Model

```php
- id: integer
- reservation_id: foreign key
- amount: decimal (PHP)
- currency: string (default 'PHP')
- status: enum ('pending', 'completed', 'failed')
- transaction_id: string (mock UUID)
- created_at/updated_at: timestamps
```

## Error Handling

-   Payment form validation for required fields
-   Handle failed payment simulations gracefully
-   Proper error messages for receipt generation failures

## Testing Strategy

-   Unit tests for payment processing logic
-   Feature tests for payment flow end-to-end
-   Test PHP currency formatting and receipt generation
