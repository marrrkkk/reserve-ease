# Implementation Plan

-   [x] 1. Database schema and migrations

    -   Create migrations for packages table, package_customizations table, receipts table
    -   Add columns to reservations table for customer information and package_id
    -   Add database indexes for performance optimization
    -   _Requirements: 2.1, 3.1, 5.6_

-

-   [ ] 2. Create Package model and controller

    -   [x] 2.1 Implement Package model with relationships and methods

        -   Create Package model with fillable fields and casts
        -   Define relationship to Reservations
        -   Implement getAvailableOptions() method
        -   _Requirements: 3.1, 3.2, 3.3_

    -   [ ]\* 2.2 Write property test for package data retrieval

        -   **Property 10: Payment method details inclusion**
        -   **Validates: Requirements 5.3**

-   -   [x] 2.3 Implement PackageController with index and show methods

        -   Create index() method to list all active packages
        -   Create show() method to display package details
        -   Create getCustomizationOptions() method
        -   _Requirements: 1.3, 3.1_

    -   [ ]\* 2.4 Write unit tests for PackageController
        -   Test index returns all active packages
        -   Test show returns correct package with options
        -   Test getCustomizationOptions returns proper structure
        -   _Requirements: 1.3, 3.1_

-   [-] 3. Create PackageCustomization model

    -   [x] 3.1 Implement PackageCustomization model with validation

        -   Create model with fillable fields and casts
        -   Define relationship to Reservation
        -   Implement calculateTotalCost() method
        -   Implement validateBudgetConstraint() method
        -   _Requirements: 3.4, 3.5, 3.6_

    -   [ ]\* 3.2 Write property test for budget constraint enforcement

        -   **Property 3: Food selection budget constraint enforcement**
        -   **Validates: Requirements 3.5**

    -   [ ]\* 3.3 Write property test for budget acceptance

        -   **Property 4: Food selection within budget acceptance**
        -   **Validates: Requirements 3.4**

    -   [ ]\* 3.4 Write property test for customization persistence
        -   **Property 5: Customization data persistence**
        -   **Validates: Requirements 3.6**

-

-   [ ] 4. Enhance Reservation model and controller

    -   [x] 4.1 Update Reservation model with new fields and relationships

        -   Add customer information fields to fillable array
        -   Add package_id to fillable array
        -   Define relationship to Package
        -   Define relationship to PackageCustomization
        -   Define relationship to Receipts
        -   _Requirements: 2.1, 2.3, 3.6, 4.1_

    -   [ ]\* 4.2 Write property test for customer data integrity

        -   **Property 2: Customer data round-trip integrity**
        -   **Validates: Requirements 2.3, 2.4, 2.5**

    -   [x] 4.3 Update ReservationController store method

        -   Add validation for customer information fields
        -   Add validation for package_id and customization
        -   Create reservation with customer data
        -   Create associated PackageCustomization record
        -   _Requirements: 2.1, 2.2, 3.6, 4.1_

    -   [ ]\* 4.4 Write property test for customer validation

        -   **Property 1: Customer information validation completeness**
        -   **Validates: Requirements 2.1, 2.2**

    -   [ ]\* 4.5 Write property test for reservation creation completeness

        -   **Property 6: Reservation creation completeness**
        -   **Validates: Requirements 4.1**

-   -   [x] 4.6 Implement ReservationController show method

        -   Create show() method to display complete reservation details
        -   Eager load package, customization, payments, receipts
        -   Return all required fields in response
        -   _Requirements: 4.4, 4.5_

    -   [ ]\* 4.7 Write property test for reservation detail completeness

        -   **Property 8: Reservation detail completeness**
        -   **Validates: Requirements 4.4**

    -   [x] 4.8 Update userReservations method with filtering

        -   Ensure only user's own reservations are returned
        -   Eager load relationships for performance
        -   _Requirements: 4.2_

    -   [ ]\* 4.9 Write property test for reservation filtering
        -   **Property 7: Reservation filtering by customer**
        -   **Validates: Requirements 4.2**

-

-   [ ] 5. Create Receipt model and enhance Payment controller

    -   [x] 5.1 Implement Receipt model

        -   Create Receipt model with fillable fields and casts
        -   Define relationships to Payment and Reservation
        -   Add file path helper methods
        -   _Requirements: 5.6_

-   -   [x] 5.2 Update PaymentController with payment method details

        -   Update getPaymentMethods() to include GCash number and other details
        -   Ensure payment method details are returned in show method
        -   _Requirements: 5.1, 5.3, 5.4_

    -   [ ]\* 5.3 Write property test for payment method persistence

        -   **Property 9: Payment method persistence**
        -   **Validates: Requirements 5.2**

    -   [x] 5.4 Implement receipt upload functionality

        -   Create uploadReceipt() method in PaymentController
        -   Add file validation (type, size)
        -   Store file in storage/app/receipts
        -   Create Receipt record with file details
        -   _Requirements: 5.6, 5.7_

    -   [ ]\* 5.5 Write property test for receipt upload

        -   **Property 11: Receipt file upload and storage**
        -   **Validates: Requirements 5.6**

    -   [ ]\* 5.6 Write property test for invalid receipt rejection

        -   **Property 12: Invalid receipt rejection**
        -   **Validates: Requirements 5.7**

    -   [x] 5.7 Add receipt viewing and download methods

        -   Implement methods to retrieve receipt file
        -   Add authorization checks
        -   _Requirements: 6.5_

    -   [ ]\* 5.8 Write property test for receipt accessibility
        -   **Property 15: Receipt accessibility**
        -   **Validates: Requirements 6.5**

-

-   [x] 6. Implement payment status management

    -   [x] 6.1 Update Payment model with status methods

        -   Ensure payment status is validated to be "Paid" or "In Progress"
        -   Update status update methods
        -   _Requirements: 6.1, 6.2, 6.3_

    -   [ ]\* 6.2 Write property test for payment status validity

        -   **Property 13: Payment status validity**
        -   **Validates: Requirements 6.1**

    -   [ ]\* 6.3 Write property test for payment confirmation

        -   **Property 14: Payment confirmation status update**
        -   **Validates: Requirements 6.3**

    -   [x] 6.4 Update admin reservation views to show payment method

        -   Modify admin reservation detail view to display payment method
        -   Show receipt if uploaded
        -   _Requirements: 6.4, 6.5_

-

-   [ ] 7. Create RevenueService for calculations

    -   [x] 7.1 Implement RevenueService class

        -   Create calculateTotalRevenue() method filtering by Paid status
        -   Create getRevenueByPeriod() method
        -   Create getRevenueByPaymentMethod() method
        -   Create getPaidReservations() method
        -   _Requirements: 8.1, 8.2, 8.5_

    -   [ ]\* 7.2 Write property test for revenue calculation from paid only

        -   **Property 18: Revenue calculation from paid reservations only**
        -   **Validates: Requirements 8.1, 8.5**

    -   [ ]\* 7.3 Write property test for revenue sum correctness

        -   **Property 19: Revenue total equals sum of payments**
        -   **Validates: Requirements 8.2, 8.4**

    -   [ ]\* 7.4 Write property test for revenue update on status change
        -   **Property 20: Revenue update on status change**
        -   **Validates: Requirements 8.3**

-   [-] 8. Create AnalyticsController and views

-   [ ] 8. Create AnalyticsController and views

    -   [x] 8.1 Implement AnalyticsController

        -   Create index() method for main dashboard
        -   Create bookingSummary() method with counts and grouping
        -   Create monthlyReport() method
        -   Create revenueChart() method
        -   Create printReport() method
        -   _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

    -   [ ]\* 8.2 Write property test for booking summary accuracy

        -   **Property 16: Booking summary accuracy**
        -   **Validates: Requirements 7.3**

    -   [ ]\* 8.3 Write property test for monthly grouping

        -   **Property 17: Monthly grouping correctness**
        -   **Validates: Requirements 7.4**

    -   [ ]\* 8.4 Write unit tests for AnalyticsController
        -   Test index returns correct structure
        -   Test bookingSummary calculates correctly
        -   Test monthlyReport groups by month
        -   Test printReport formats correctly
        -   _Requirements: 7.1, 7.2, 7.3, 7.4_

-

-   [x] 9. Create frontend React components for packages

-   -   [x] 9.1 Create PackageList component

        -   Display all available packages in grid layout
        -   Show package name, description, base price
        -   Add "Select Package" button for each package
        -   _Requirements: 1.3_

    -   [x] 9.2 Create Packages/Index page

        -   Integrate PackageList component
        -   Handle package selection navigation
        -   _Requirements: 1.1, 1.3_

-   -   [x] 9.3 Update navigation to show Packages before My Reservation

        -   Modify navigation component order
        -   Ensure sequence: Dashboard → Packages → My Reservation
        -   _Requirements: 1.1, 1.2_

-   [x] 10. Create frontend components for booking and customization

    -   [x] 10.1 Create CustomerInformationForm component

        -   Add input fields for full name, address, contact number, email
        -   Implement client-side validation
        -   Display validation errors
        -   _Requirements: 2.1, 2.2_

    -   [x] 10.2 Create PackageCustomization component

        -   Add dropdown for table selection (Round, Rectangular, Other)
        -   Add dropdown for chair selection (Tiffany, Monoblock, Other)
        -   Add multi-select for food items with prices
        -   Display running total and remaining budget
        -   Implement real-time budget validation
        -   Show error when budget exceeded
        -   _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

    -   [x] 10.3 Create booking flow page combining forms

        -   Integrate CustomerInformationForm
        -   Integrate PackageCustomization component
        -   Handle form submission
        -   Navigate to reservation confirmation
        -   _Requirements: 2.1, 3.1, 4.1_

-

-   [x] 11. Create frontend components for reservation viewing

    -   [x] 11.1 Update Reservation/Index page

        -   Display list of user's reservations
        -   Add View button for each reservation
        -   Show payment status badge
        -   _Requirements: 4.2, 4.3_

-   -   [x] 11.2 Create ReservationDetails component

        -   Display customer information section
        -   Display package and customization details
        -   Display table and chair selections
        -   Display food selections
        -   Display payment status
        -   Add payment button if unpaid
        -   _Requirements: 4.4, 4.5_

-   [x] 12. Create frontend components for payment

-   -   [x] 12.1 Create PaymentMethodSelector component

        -   Display payment methods as checkboxes
        -   Show payment details for each method (GCash: 0982 726 5178)
        -   Handle payment method selection
        -   _Requirements: 5.1, 5.2, 5.3, 5.4_

    -   [x] 12.2 Create ReceiptUpload component

        -   Add file input for receipt images
        -   Show file preview after selection
        -   Display upload progress
        -   Show validation errors
        -   Handle file upload to backend
        -   _Requirements: 5.5, 5.6, 5.7_

    -   [x] 12.3 Update Payment/Show page

        -   Integrate PaymentMethodSelector
        -   Integrate ReceiptUpload component
        -   Handle payment submission flow
        -   _Requirements: 5.1, 5.6_

-

-   [x] 13. Create frontend components for admin analytics

    -   [x] 13.1 Create AnalyticsDashboard component

        -   Display summary cards (total bookings, revenue, pending)
        -   Show monthly report table
        -   Integrate revenue charts
        -   Add print button
        -   Add date range selector
        -   _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

-   -   [x] 13.2 Create RevenueDisplay component

        -   Display total revenue prominently
        -   Show revenue breakdown by payment method
        -   Show revenue by time period
        -   Visualize paid vs pending
        -   _Requirements: 8.1, 8.2_

    -   [x] 13.3 Create Admin/Analytics page

        -   Integrate AnalyticsDashboard component
        -   Integrate RevenueDisplay component
        -   Implement print functionality with CSS
        -   _Requirements: 7.1, 7.2, 8.1, 8.2_

-   -   [x] 13.4 Update admin reservation views

        -   Show customer-selected payment method
        -   Display uploaded receipt with view/download options
        -   Show accurate payment status
        -   _Requirements: 6.4, 6.5_

-   [x] 14. Add routes and middleware

    -   [x] 14.1 Add package routes

        -   GET /packages (list packages)
        -   GET /packages/{package} (show package details)
        -   GET /packages/{package}/customization-options
        -   _Requirements: 1.3, 3.1_

-   -   [x] 14.2 Add reservation routes

        -   POST /reservations (create with customer info and customization)
        -   GET /reservations/{reservation} (show complete details)
        -   GET /my-reservations (user's reservations)
        -   _Requirements: 2.1, 4.1, 4.2, 4.4_

    -   [x] 14.3 Add payment and receipt routes

        -   POST /payments/{payment}/upload-receipt
        -   GET /receipts/{receipt}/view
        -   GET /receipts/{receipt}/download
        -   _Requirements: 5.6, 6.5_

    -   [x] 14.4 Add analytics routes

    -   [x] 14.4 Add analytics routes

        -   GET /admin/analytics (main dashboard)
        -   GET /admin/analytics/booking-summary
        -   GET /admin/analytics/monthly-report/{year}/{month}
        -   GET /admin/analytics/revenue-chart/{period}
        -   GET /admin/analytics/print
        -   _Requirements: 7.1, 7.2, 7.3, 7.4_

    -   [x] 14.5 Add authorization middleware

    -   [x] 14.5 Add authorization middleware

        -   Ensure customers can only access their own reservations
        -   Ensure only admins can access analytics
        -   Ensure receipt access is authorized
        -   _Requirements: 4.2, 6.5, 7.1_

-

-   [x] 15. Seed database with sample data

-   -   [x] 15.1 Create package seeder

        -   Create 3-5 sample packages with different prices
        -   Include table, chair, and food options for each
        -   _Requirements: 1.3, 3.1_

    -   [x] 15.2 Create sample reservations seeder

        -   Create reservations with various statuses
        -   Include both Paid and In Progress payment statuses
        -   Include customer information and customizations
        -   _Requirements: 4.2, 6.1, 8.1_

-   [ ] 16. Final checkpoint - Ensure all tests pass

    -   Ensure all tests pass, ask the user if questions arise.
