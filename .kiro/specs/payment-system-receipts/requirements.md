# Requirements Document

## Introduction

A simple mock payment system that allows users to make payments for reservations and generate receipts in Philippines peso (PHP) currency. This system will simulate payment processing without actual financial transactions.

## Requirements

### Requirement 1

**User Story:** As a user, I want to pay for my reservations, so that I can complete my booking process

#### Acceptance Criteria

1. WHEN a user views their reservation THEN the system SHALL display a "Pay Now" button if payment is pending
2. WHEN a user clicks "Pay Now" THEN the system SHALL show a mock payment form with PHP currency
3. WHEN a user submits payment details THEN the system SHALL simulate successful payment processing
4. WHEN payment is successful THEN the system SHALL update the reservation status to "paid"

### Requirement 2

**User Story:** As a user, I want to receive a receipt after payment, so that I have proof of my transaction

#### Acceptance Criteria

1. WHEN payment is completed THEN the system SHALL generate a receipt with PHP currency formatting
2. WHEN a receipt is generated THEN it SHALL include reservation details, payment amount, and transaction date
3. WHEN a user views their reservations THEN they SHALL be able to download receipts for paid reservations
4. IF a reservation is paid THEN the system SHALL display "View Receipt" option

### Requirement 3

**User Story:** As an admin, I want to view payment records, so that I can track revenue and transactions

#### Acceptance Criteria

1. WHEN an admin accesses the admin dashboard THEN they SHALL see a payments section
2. WHEN an admin views payments THEN the system SHALL display all transactions with PHP amounts
3. WHEN an admin clicks on a payment THEN they SHALL be able to view the associated receipt
