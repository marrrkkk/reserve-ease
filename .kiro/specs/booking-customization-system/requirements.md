# Requirements Document

## Introduction

This document specifies the requirements for an enhanced booking and payment system that allows customers to customize event packages, submit payments with proof, and enables administrators to track bookings, payments, and generate analytics reports. The system extends the existing reservation platform to support detailed package customization including table designs, chair types, and food selections while maintaining accurate payment tracking and revenue reporting.

## Glossary

-   **Booking System**: The software system that manages customer reservations and package selections
-   **Customer**: A user who books event packages through the system
-   **Admin**: A system administrator who manages bookings, payments, and generates reports
-   **Package**: A predefined event service offering with customizable options
-   **Reservation**: A confirmed booking made by a customer for a specific package
-   **Payment Status**: The current state of payment for a reservation (Paid, In Progress)
-   **Receipt Upload**: Digital proof of payment submitted by customers
-   **Analytics Report**: A printable summary of booking and revenue data
-   **Package Customization**: The process of selecting specific options within a package (tables, chairs, food)
-   **Mode of Payment**: The payment method selected by the customer (e-wallet, bank transfer, etc.)

## Requirements

### Requirement 1

**User Story:** As a customer, I want to view available packages before accessing my reservations, so that I can explore options before making booking decisions.

#### Acceptance Criteria

1. WHEN a customer navigates to the dashboard THEN the Booking System SHALL display the Packages page before the My Reservation page in the navigation order
2. WHEN a customer accesses the customer module THEN the Booking System SHALL present navigation in the sequence: Dashboard, Packages, My Reservation
3. WHEN the Packages page loads THEN the Booking System SHALL display all available event packages with their base details

### Requirement 2

**User Story:** As a customer, I want to provide my complete contact information during booking, so that the admin can reach me and process my reservation.

#### Acceptance Criteria

1. WHEN a customer initiates a booking THEN the Booking System SHALL require the customer to enter full name, address, contact number, and email address
2. WHEN a customer submits incomplete information THEN the Booking System SHALL prevent booking submission and display validation errors for missing fields
3. WHEN a customer completes the booking form THEN the Booking System SHALL store all customer information exactly as entered
4. WHEN an admin views the reservation THEN the Booking System SHALL display the customer information exactly as the customer entered it
5. WHEN customer information is displayed in the admin panel THEN the Booking System SHALL preserve all original formatting and character data

### Requirement 3

**User Story:** As a customer, I want to customize my selected package with specific table designs, chair types, and food selections, so that my event matches my preferences within my budget.

#### Acceptance Criteria

1. WHEN a customer selects a package THEN the Booking System SHALL display customization options for tables, chairs, and food
2. WHEN a customer views table options THEN the Booking System SHALL present choices including Round, Rectangular, and other available table designs
3. WHEN a customer views chair options THEN the Booking System SHALL present choices including Tiffany chair, Monoblock, and other available chair types
4. WHEN a customer selects food items THEN the Booking System SHALL allow selection of any food items that fit within the package price
5. WHEN a customer attempts to select food exceeding the package price THEN the Booking System SHALL prevent the selection and display the price constraint
6. WHEN a customer completes customization THEN the Booking System SHALL save all selected options with the reservation

### Requirement 4

**User Story:** As a customer, I want to view the complete details of my reservation after booking, so that I can verify all my selections and booking information.

#### Acceptance Criteria

1. WHEN a customer completes a booking THEN the Booking System SHALL create a reservation record with all booking and customization details
2. WHEN a customer navigates to My Reservation page THEN the Booking System SHALL display all reservations associated with that customer
3. WHEN a customer views a reservation entry THEN the Booking System SHALL display a View button for each reservation
4. WHEN a customer clicks the View button THEN the Booking System SHALL display complete reservation details including customer information, package selection, table choice, chair choice, food selections, and payment status
5. WHEN the reservation details are displayed THEN the Booking System SHALL present all information in a clear, organized format

### Requirement 5

**User Story:** As a customer, I want to select my payment method from a checklist and upload proof of payment, so that the admin knows how I paid and can verify my payment.

#### Acceptance Criteria

1. WHEN a customer accesses payment options THEN the Booking System SHALL display available payment methods as checkable options
2. WHEN a customer selects a payment method THEN the Booking System SHALL record the selected payment mode with the reservation
3. WHEN a customer views a payment method option THEN the Booking System SHALL display the relevant payment details (account numbers, wallet IDs, etc.)
4. WHEN a customer selects GCash as payment method THEN the Booking System SHALL display the GCash number 0982 726 5178
5. WHEN a customer completes payment method selection THEN the Booking System SHALL provide a receipt upload feature
6. WHEN a customer uploads a receipt file THEN the Booking System SHALL accept image file formats and store the receipt with the reservation
7. WHEN a receipt upload fails validation THEN the Booking System SHALL display an error message and allow retry

### Requirement 6

**User Story:** As an admin, I want to view payment status for all bookings and track which payment method customers used, so that I can manage payments effectively.

#### Acceptance Criteria

1. WHEN an admin views a reservation THEN the Booking System SHALL display the payment status as either Paid or In Progress
2. WHEN a reservation has no payment recorded THEN the Booking System SHALL display the payment status as In Progress
3. WHEN a reservation payment is confirmed THEN the Booking System SHALL display the payment status as Paid
4. WHEN an admin views reservation details THEN the Booking System SHALL display the customer-selected payment method
5. WHEN an admin views a reservation with uploaded receipt THEN the Booking System SHALL provide access to view or download the receipt file

### Requirement 7

**User Story:** As an admin, I want to generate and print analytics reports showing booking summaries, monthly reports, and revenue charts, so that I can analyze business performance.

#### Acceptance Criteria

1. WHEN an admin accesses the Analytics section THEN the Booking System SHALL display booking summaries, monthly reports, and revenue data
2. WHEN an admin requests to print analytics THEN the Booking System SHALL format the report for printing with all relevant data visible
3. WHEN an admin views booking summaries THEN the Booking System SHALL display total bookings, bookings by status, and bookings by time period
4. WHEN an admin views monthly reports THEN the Booking System SHALL display booking and revenue data organized by month
5. WHEN an admin views revenue charts THEN the Booking System SHALL display visual representations of revenue trends

### Requirement 8

**User Story:** As an admin, I want to see accurate revenue totals based on actual payments received, so that I can track business income correctly.

#### Acceptance Criteria

1. WHEN an admin views revenue totals THEN the Booking System SHALL calculate revenue based only on reservations with Paid status
2. WHEN an admin views total payments received THEN the Booking System SHALL display the sum of all confirmed payment amounts
3. WHEN a reservation payment status changes to Paid THEN the Booking System SHALL include that payment amount in revenue calculations
4. WHEN an admin views revenue details THEN the Booking System SHALL display accurate totals that match the sum of individual payment records
5. WHEN revenue calculations are performed THEN the Booking System SHALL exclude reservations with In Progress payment status from revenue totals
