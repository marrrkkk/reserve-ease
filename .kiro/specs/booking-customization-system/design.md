# Design Document

## Overview

The Booking Customization System extends the existing Laravel-based reservation platform to provide comprehensive package customization capabilities, enhanced payment processing with receipt uploads, and robust analytics for administrators. The system maintains the current Laravel + Inertia.js + React architecture while adding new models, controllers, and UI components to support detailed event customization, multiple payment methods with proof of payment, and revenue tracking.

Key enhancements include:

-   Structured navigation prioritizing package discovery
-   Detailed customer information capture with data integrity preservation
-   Package customization engine for tables, chairs, and food selections with budget constraints
-   Payment method selection with receipt upload functionality
-   Enhanced admin analytics with printable reports
-   Accurate revenue calculation based on confirmed payments

## Architecture

### System Architecture

The system follows Laravel's MVC pattern with Inertia.js as the bridge between Laravel backend and React frontend:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Inertia)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Packages   │  │ Reservation  │  │   Payment    │      │
│  │     Pages    │  │    Pages     │  │    Pages     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Admin     │  │  Analytics   │  │   Receipt    │      │
│  │    Pages     │  │    Pages     │  │   Upload     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ Inertia.js
┌─────────────────────────────────────────────────────────────┐
│                    Laravel Backend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Package    │  │ Reservation  │  │   Payment    │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Analytics  │  │   Receipt    │  │   Revenue    │      │
│  │  Controller  │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Package    │  │ Reservation  │  │   Payment    │      │
│  │    Model     │  │    Model     │  │    Model     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │Customization │  │   Receipt    │                         │
│  │    Model     │  │    Model     │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Database (SQLite/MySQL)                         │
│  packages | reservations | payments | customizations        │
│  receipts | users                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Booking Flow**: Customer → Packages Page → Package Selection → Customization Form → Reservation Creation → Payment Selection → Receipt Upload
2. **Admin Flow**: Admin → Analytics Dashboard → Reservation Management → Payment Verification → Report Generation
3. **Data Flow**: User Input → Validation → Controller → Model → Database → Response → Inertia → React Component

## Components and Interfaces

### Backend Components

#### 1. Package Model

```php
class Package extends Model
{
    protected $fillable = [
        'name',
        'description',
        'base_price',
        'category',
        'is_active',
        'available_tables',
        'available_chairs',
        'available_foods'
    ];

    protected $casts = [
        'available_tables' => 'array',
        'available_chairs' => 'array',
        'available_foods' => 'array',
        'base_price' => 'decimal:2'
    ];

    public function reservations();
    public function getAvailableOptions();
}
```

#### 2. Enhanced Reservation Model

```php
class Reservation extends Model
{
    // Existing fields plus:
    protected $fillable = [
        'user_id',
        'package_id',
        'customer_full_name',
        'customer_address',
        'customer_contact_number',
        'customer_email',
        'event_type',
        'event_date',
        'event_time',
        'venue',
        'guest_count',
        'status',
        'payment_status',
        'total_amount'
    ];

    public function package();
    public function customization();
    public function payments();
    public function receipts();
}
```

#### 3. PackageCustomization Model

```php
class PackageCustomization extends Model
{
    protected $fillable = [
        'reservation_id',
        'selected_table_type',
        'selected_chair_type',
        'selected_foods',
        'customization_notes'
    ];

    protected $casts = [
        'selected_foods' => 'array'
    ];

    public function reservation();
    public function calculateTotalCost();
    public function validateBudgetConstraint();
}
```

#### 4. Receipt Model

```php
class Receipt extends Model
{
    protected $fillable = [
        'payment_id',
        'reservation_id',
        'file_path',
        'file_name',
        'file_type',
        'uploaded_at',
        'verified_by',
        'verified_at'
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'verified_at' => 'datetime'
    ];

    public function payment();
    public function reservation();
    public function verifier();
}
```

#### 5. Enhanced Payment Model

```php
class Payment extends Model
{
    // Existing fields plus:
    protected $fillable = [
        'reservation_id',
        'user_id',
        'payment_method',
        'amount',
        'currency',
        'status',
        'transaction_id',
        'reference_number',
        'payment_details',
        'paid_at'
    ];

    public function receipt();
    public function updateStatus($status);
}
```

#### 6. PackageController

```php
class PackageController extends Controller
{
    public function index(); // List all active packages
    public function show(Package $package); // Show package details with customization options
    public function getCustomizationOptions(Package $package); // Get available tables, chairs, foods
}
```

#### 7. Enhanced ReservationController

```php
class ReservationController extends Controller
{
    public function store(Request $request); // Create reservation with customer info and customization
    public function show(Reservation $reservation); // View complete reservation details
    public function userReservations(); // List user's reservations
    public function validateCustomization(Request $request); // Validate customization against budget
}
```

#### 8. Enhanced PaymentController

```php
class PaymentController extends Controller
{
    public function show(Reservation $reservation); // Show payment options
    public function store(Request $request, Reservation $reservation); // Process payment
    public function uploadReceipt(Request $request, Payment $payment); // Handle receipt upload
    public function getPaymentMethods(); // Return available payment methods with details
}
```

#### 9. AnalyticsController

```php
class AnalyticsController extends Controller
{
    public function index(); // Main analytics dashboard
    public function bookingSummary(); // Booking statistics
    public function monthlyReport($year, $month); // Monthly booking and revenue report
    public function revenueChart($period); // Revenue data for charts
    public function printReport(Request $request); // Generate printable report
}
```

#### 10. RevenueService

```php
class RevenueService
{
    public function calculateTotalRevenue($startDate = null, $endDate = null);
    public function getRevenueByPeriod($period); // daily, weekly, monthly, yearly
    public function getRevenueByPaymentMethod();
    public function getPaidReservations($startDate = null, $endDate = null);
}
```

### Frontend Components

#### 1. PackageList Component

-   Displays all available packages
-   Shows package details (name, description, base price)
-   Provides "Select Package" button

#### 2. PackageCustomization Component

-   Table selection dropdown (Round, Rectangular, Other)
-   Chair selection dropdown (Tiffany, Monoblock, Other)
-   Food selection with multi-select and price tracking
-   Real-time budget validation
-   Displays remaining budget

#### 3. CustomerInformationForm Component

-   Full name input
-   Address textarea
-   Contact number input with validation
-   Email input with validation
-   Form validation with error display

#### 4. ReservationDetails Component

-   Displays complete reservation information
-   Shows customer details exactly as entered
-   Displays package and customization selections
-   Shows payment status
-   Provides payment button if unpaid

#### 5. PaymentMethodSelector Component

-   Checklist of payment methods
-   Displays payment details for each method (GCash: 0982 726 5178)
-   Conditional display of payment instructions

#### 6. ReceiptUpload Component

-   File input for receipt images
-   Preview uploaded receipt
-   Upload progress indicator
-   Validation for file type and size

#### 7. AnalyticsDashboard Component

-   Summary cards (total bookings, revenue, pending payments)
-   Monthly report table
-   Revenue charts (line chart, bar chart)
-   Print button for reports
-   Date range selector

#### 8. RevenueDisplay Component

-   Total revenue display
-   Revenue breakdown by payment method
-   Revenue by time period
-   Paid vs pending visualization

## Data Models

### Database Schema

#### packages table

```sql
CREATE TABLE packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    available_tables JSON, -- ["Round", "Rectangular", "Square"]
    available_chairs JSON, -- ["Tiffany", "Monoblock", "Plastic"]
    available_foods JSON, -- [{"name": "Food Item", "price": 100.00}]
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### reservations table (enhanced)

```sql
ALTER TABLE reservations ADD COLUMN package_id BIGINT;
ALTER TABLE reservations ADD COLUMN customer_full_name VARCHAR(255);
ALTER TABLE reservations ADD COLUMN customer_address TEXT;
ALTER TABLE reservations ADD COLUMN customer_contact_number VARCHAR(50);
ALTER TABLE reservations ADD COLUMN customer_email VARCHAR(255);
ALTER TABLE reservations ADD FOREIGN KEY (package_id) REFERENCES packages(id);
```

#### package_customizations table

```sql
CREATE TABLE package_customizations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reservation_id BIGINT NOT NULL,
    selected_table_type VARCHAR(100),
    selected_chair_type VARCHAR(100),
    selected_foods JSON, -- [{"name": "Food Item", "price": 100.00}]
    customization_notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);
```

#### receipts table

```sql
CREATE TABLE receipts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NOT NULL,
    reservation_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP,
    verified_by BIGINT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);
```

### Data Relationships

-   Package hasMany Reservations
-   Reservation belongsTo Package
-   Reservation hasOne PackageCustomization
-   Reservation hasMany Payments
-   Reservation hasMany Receipts
-   Payment hasOne Receipt
-   Receipt belongsTo Payment
-   Receipt belongsTo Reservation

### Data Validation Rules

#### Customer Information

-   full_name: required, string, max:255
-   address: required, string, max:1000
-   contact_number: required, string, regex:/^[0-9]{10,15}$/
-   email: required, email, max:255

#### Package Customization

-   selected_table_type: required, string, in:available_tables
-   selected_chair_type: required, string, in:available_chairs
-   selected_foods: required, array
-   selected_foods.\*.name: required, string
-   selected_foods.\*.price: required, numeric, min:0
-   total_food_cost: max:package.base_price

#### Receipt Upload

-   receipt_file: required, file, mimes:jpg,jpeg,png,pdf, max:5120 (5MB)

#### Payment Method

-   payment_method: required, string, in:gcash,bank_transfer,cash
-   reference_number: required_if:payment_method,gcash,bank_transfer

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Customer information validation completeness

_For any_ booking submission, if any of the four required fields (full name, address, contact number, email) is missing, the system should reject the submission with validation errors.
**Validates: Requirements 2.1, 2.2**

### Property 2: Customer data round-trip integrity

_For any_ valid customer information submitted during booking, retrieving that reservation should return the exact same customer data with all characters, formatting, and whitespace preserved.
**Validates: Requirements 2.3, 2.4, 2.5**

### Property 3: Food selection budget constraint enforcement

_For any_ package and any combination of selected food items, if the total food cost exceeds the package base price, the system should reject the selection.
**Validates: Requirements 3.5**

### Property 4: Food selection within budget acceptance

_For any_ package and any combination of selected food items where the total cost is less than or equal to the package base price, the system should accept the selection.
**Validates: Requirements 3.4**

### Property 5: Customization data persistence

_For any_ valid customization (table type, chair type, food selections), saving the customization and then retrieving the reservation should return identical customization data.
**Validates: Requirements 3.6**

### Property 6: Reservation creation completeness

_For any_ valid booking with customer information and customization, creating a reservation should result in a record containing all submitted booking details, customer information, and customization selections.
**Validates: Requirements 4.1**

### Property 7: Reservation filtering by customer

_For any_ customer, querying their reservations should return only reservations where the user_id matches that customer, and should return all such reservations.
**Validates: Requirements 4.2**

### Property 8: Reservation detail completeness

_For any_ reservation, the detail view should include all required fields: customer information (full name, address, contact number, email), package selection, table choice, chair choice, food selections, and payment status.
**Validates: Requirements 4.4**

### Property 9: Payment method persistence

_For any_ payment method selection, storing the payment and then retrieving it should return the same payment method value.
**Validates: Requirements 5.2**

### Property 10: Payment method details inclusion

_For any_ payment method, the payment options response should include the relevant payment details (account numbers, wallet IDs, instructions).
**Validates: Requirements 5.3**

### Property 11: Receipt file upload and storage

_For any_ valid image file (jpg, jpeg, png, pdf under 5MB), uploading it as a receipt should result in the file being stored and associated with the payment and reservation.
**Validates: Requirements 5.6**

### Property 12: Invalid receipt rejection

_For any_ file that fails validation (wrong format, too large), attempting to upload it as a receipt should return an error and not store the file.
**Validates: Requirements 5.7**

### Property 13: Payment status validity

_For any_ reservation, the payment status should be either "Paid" or "In Progress" (no other values allowed).
**Validates: Requirements 6.1**

### Property 14: Payment confirmation status update

_For any_ reservation, when a payment is confirmed, the payment status should be updated to "Paid".
**Validates: Requirements 6.3**

### Property 15: Receipt accessibility

_For any_ reservation with an uploaded receipt, the receipt file should be retrievable by both the customer and admin.
**Validates: Requirements 6.5**

### Property 16: Booking summary accuracy

_For any_ set of reservations, the booking summary totals (total bookings, bookings by status, bookings by time period) should equal the count of reservations matching each criteria.
**Validates: Requirements 7.3**

### Property 17: Monthly grouping correctness

_For any_ set of reservations, grouping by month should place each reservation in the group corresponding to its event_date month.
**Validates: Requirements 7.4**

### Property 18: Revenue calculation from paid reservations only

_For any_ set of reservations, the total revenue should equal the sum of total_amount for all reservations where payment_status is "Paid", excluding all reservations with "In Progress" status.
**Validates: Requirements 8.1, 8.5**

### Property 19: Revenue total equals sum of payments

_For any_ set of confirmed payments, the displayed revenue total should equal the arithmetic sum of all individual payment amounts.
**Validates: Requirements 8.2, 8.4**

### Property 20: Revenue update on status change

_For any_ reservation that changes from "In Progress" to "Paid" status, the total revenue should increase by exactly that reservation's total_amount.
**Validates: Requirements 8.3**

## Error Handling

### Validation Errors

-   **Customer Information**: Return 422 with field-specific error messages for missing or invalid data
-   **Budget Constraint**: Return 422 with message indicating food selection exceeds package price and showing the overage amount
-   **File Upload**: Return 422 with specific error (invalid format, file too large, upload failed)
-   **Payment Method**: Return 422 if payment method is not in the allowed list

### Business Logic Errors

-   **Unauthorized Access**: Return 403 when user attempts to access another user's reservation or payment
-   **Package Not Found**: Return 404 when attempting to customize non-existent package
-   **Reservation Not Found**: Return 404 when attempting to view or pay for non-existent reservation
-   **Payment Already Completed**: Return 409 when attempting to pay for already-paid reservation

### System Errors

-   **File Storage Failure**: Return 500 with message to retry upload
-   **Database Errors**: Return 500 with generic error message, log detailed error
-   **Payment Processing Failure**: Return 500 with message to retry payment

### Error Response Format

```json
{
    "message": "Validation failed",
    "errors": {
        "customer_full_name": ["The full name field is required."],
        "selected_foods": [
            "The total food cost exceeds the package price by ₱500.00"
        ]
    }
}
```

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific examples and integration points:

1. **Model Tests**

    - Package model methods (getAvailableOptions)
    - Reservation model relationships and status methods
    - PackageCustomization budget validation
    - Receipt model file path generation

2. **Controller Tests**

    - PackageController returns correct package data
    - ReservationController creates reservations with all fields
    - PaymentController processes payment methods correctly
    - AnalyticsController generates correct report structure

3. **Service Tests**

    - RevenueService calculates totals correctly for known datasets
    - Receipt upload service handles file storage
    - Validation service checks budget constraints

4. **Integration Tests**
    - Complete booking flow from package selection to reservation creation
    - Payment flow from method selection to receipt upload
    - Admin analytics report generation

### Property-Based Testing Approach

Property-based tests will verify universal properties across all inputs using **Pest PHP** with the **pest-plugin-faker** for property-based testing capabilities. Each property test will run a minimum of 100 iterations with randomly generated data.

1. **Data Integrity Properties**

    - Property 2: Customer data round-trip (generate random customer info, store, retrieve, compare)
    - Property 5: Customization data persistence (generate random customizations, verify round-trip)
    - Property 9: Payment method persistence (generate random payment methods, verify storage)

2. **Validation Properties**

    - Property 1: Customer information validation (generate incomplete data, verify rejection)
    - Property 3 & 4: Budget constraint enforcement (generate random food combinations, verify acceptance/rejection based on price)
    - Property 12: Invalid receipt rejection (generate invalid files, verify rejection)

3. **Calculation Properties**

    - Property 16: Booking summary accuracy (generate random reservation sets, verify counts)
    - Property 18: Revenue from paid only (generate mixed status reservations, verify only paid included)
    - Property 19: Revenue sum correctness (generate random payments, verify arithmetic)
    - Property 20: Revenue update on status change (generate reservations, change status, verify delta)

4. **Filtering and Grouping Properties**

    - Property 7: Reservation filtering (generate reservations for multiple users, verify filtering)
    - Property 17: Monthly grouping (generate reservations across months, verify grouping)

5. **Completeness Properties**
    - Property 6: Reservation creation completeness (generate random bookings, verify all fields stored)
    - Property 8: Reservation detail completeness (generate reservations, verify all fields in response)

**Property Test Tagging Convention**: Each property-based test will include a comment tag in the format:

```php
// Feature: booking-customization-system, Property 2: Customer data round-trip integrity
```

### Testing Framework Configuration

-   **Framework**: Pest PHP (Laravel's recommended testing framework)
-   **Property Testing**: pest-plugin-faker for data generation
-   **Minimum Iterations**: 100 per property test
-   **Database**: SQLite in-memory for fast test execution
-   **File Storage**: Mock filesystem for receipt upload tests

### Test Organization

```
tests/
├── Unit/
│   ├── Models/
│   │   ├── PackageTest.php
│   │   ├── ReservationTest.php
│   │   ├── PackageCustomizationTest.php
│   │   └── ReceiptTest.php
│   ├── Services/
│   │   └── RevenueServiceTest.php
│   └── Validation/
│       └── BudgetValidationTest.php
├── Feature/
│   ├── BookingFlowTest.php
│   ├── PaymentFlowTest.php
│   ├── AnalyticsTest.php
│   └── RevenueCalculationTest.php
└── Property/
    ├── CustomerDataIntegrityTest.php
    ├── BudgetConstraintTest.php
    ├── RevenueCalculationTest.php
    ├── ReservationFilteringTest.php
    └── DataCompletenessTest.php
```

## Security Considerations

1. **Authorization**: Ensure customers can only view/modify their own reservations and payments
2. **File Upload Security**: Validate file types, scan for malware, limit file sizes
3. **Data Sanitization**: Sanitize customer input to prevent XSS attacks
4. **SQL Injection Prevention**: Use Laravel's query builder and Eloquent ORM
5. **CSRF Protection**: Utilize Laravel's built-in CSRF token validation
6. **Admin Access Control**: Verify admin role before allowing access to analytics and all reservations

## Performance Considerations

1. **Database Indexing**: Add indexes on user_id, package_id, payment_status, event_date
2. **Eager Loading**: Use eager loading for relationships to prevent N+1 queries
3. **Caching**: Cache package options and payment method details
4. **File Storage**: Use Laravel's storage system with appropriate disk configuration
5. **Analytics Queries**: Optimize revenue calculations with database aggregations
6. **Pagination**: Implement pagination for reservation lists and analytics reports

## Implementation Notes

1. **Navigation Order**: Update the navigation component to ensure Packages appears before My Reservation
2. **Customer Data Preservation**: Store customer information in dedicated columns (not JSON) to ensure exact preservation
3. **Budget Validation**: Implement real-time budget checking on frontend and backend validation
4. **Receipt Storage**: Store receipts in storage/app/receipts with organized folder structure
5. **Revenue Calculation**: Create database views or cached calculations for performance
6. **Print Formatting**: Use CSS print media queries for proper report formatting
7. **Payment Method Details**: Store payment details in configuration file for easy updates
