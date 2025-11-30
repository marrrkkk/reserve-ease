# Inwood Tavern - Event Reservation System

A modern, full-featured event reservation and management system built with Laravel and React (Inertia.js). This application allows customers to book events at Inwood Tavern while providing administrators with powerful tools to manage reservations, payments, and analytics.

## Features

### Customer Features

-   **User Authentication** - Secure registration and login with modern UI
-   **Event Reservations** - Create and manage event bookings with customization options
-   **Real-time Dashboard** - View reservation status, notifications, and event summary
-   **Payment Integration** - Secure online payment processing with receipt generation
-   **Notification System** - Real-time updates on reservation status changes
-   **Responsive Design** - Beautiful, mobile-friendly interface with amber/orange theme

### Admin Features

-   **Admin Dashboard** - Comprehensive analytics and reservation overview
-   **Reservation Management** - Approve, decline, or delete reservations
-   **Payment Tracking** - Monitor all payments and transaction history
-   **Receipt Management** - View and manage payment receipts
-   **Analytics** - Monthly trends, revenue tracking, and event type statistics
-   **User Management** - View and manage customer accounts

## Tech Stack

-   **Backend**: Laravel 11.x
-   **Frontend**: React 18 with Inertia.js
-   **Styling**: Tailwind CSS
-   **Database**: SQLite (development) / MySQL/PostgreSQL (production)
-   **Icons**: Lucide React
-   **PDF Generation**: DomPDF

## Requirements

-   PHP >= 8.2
-   Composer
-   Node.js >= 18.x
-   NPM or Yarn

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reserve-ease
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure Database

Edit `.env` file and set your database credentials:

```env
DB_CONNECTION=sqlite
# Or for MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=reserve_ease
# DB_USERNAME=root
# DB_PASSWORD=
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Seed Database (Optional)

```bash
php artisan db:seed
```

### 8. Build Assets

```bash
npm run build
# Or for development with hot reload:
npm run dev
```

### 9. Start Development Server

```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Default Admin Account

After seeding, you can login with:

-   **Email**: admin@example.com
-   **Password**: password

## Project Structure

```
reserve-ease/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminController.php
│   │   │   ├── ReservationController.php
│   │   │   ├── PaymentController.php
│   │   │   └── ReceiptController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Reservation.php
│   │   ├── Payment.php
│   │   ├── Receipt.php
│   │   └── Notification.php
│   └── Services/
│       └── PaymentService.php
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── CreateReservationModal.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   └── ...
│   │   ├── Layouts/
│   │   │   ├── AuthenticatedLayout.jsx
│   │   │   └── GuestLayout.jsx
│   │   └── Pages/
│   │       ├── Auth/
│   │       │   ├── Login.jsx
│   │       │   └── Register.jsx
│   │       ├── Admin/
│   │       │   ├── Index.jsx
│   │       │   ├── Reservations.jsx
│   │       │   ├── Payments.jsx
│   │       │   └── Analytics.jsx
│   │       ├── Dashboard.jsx
│   │       └── Reservations/
│   └── views/
│       └── receipts/
│           └── payment.blade.php
├── routes/
│   ├── web.php
│   └── api.php
└── database/
    └── migrations/
```

## Key Features Documentation

### Reservation System

Users can create reservations with:

-   Event type selection
-   Date and time
-   Guest count
-   Venue selection
-   Custom requirements/notes
-   Automatic pricing calculation

### Payment System

-   Secure payment processing
-   Multiple payment methods support
-   Automatic receipt generation
-   Payment status tracking
-   PDF receipt downloads

### Admin Panel

Access admin features at `/admin`:

-   Dashboard with key metrics
-   Reservation approval workflow
-   Payment monitoring
-   Analytics and reporting
-   User management

### Notification System

Real-time notifications for:

-   Reservation status changes
-   Payment confirmations
-   Admin actions
-   System updates

## API Endpoints

### User Endpoints

-   `GET /api/user/reservations` - Get user's reservations
-   `GET /api/user/notifications` - Get user's notifications

### Admin Endpoints (Protected)

-   `GET /admin` - Admin dashboard
-   `GET /admin/reservations` - Manage reservations
-   `POST /admin/reservations/{id}/approve` - Approve reservation
-   `POST /admin/reservations/{id}/decline` - Decline reservation
-   `DELETE /admin/reservations/{id}` - Delete reservation
-   `GET /admin/payments` - View all payments
-   `GET /admin/analytics` - View analytics

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
# PHP
./vendor/bin/pint

# JavaScript
npm run lint
```

### Building for Production

```bash
npm run build
php artisan optimize
```

## Environment Variables

Key environment variables:

```env
APP_NAME="Inwood Tavern"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## Troubleshooting

### Common Issues

**Issue**: White screen after login

-   **Solution**: Run `npm run build` and clear browser cache

**Issue**: Database connection error

-   **Solution**: Check `.env` database credentials and run `php artisan migrate`

**Issue**: Permission denied errors

-   **Solution**: Set proper permissions:
    ```bash
    chmod -R 775 storage bootstrap/cache
    ```

**Issue**: Assets not loading

-   **Solution**: Run `npm run build` and `php artisan storage:link`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software developed for Inwood Tavern.

## Support

For support, email support@inwoodtavern.com or contact the development team.

## Acknowledgments

-   Built with [Laravel](https://laravel.com)
-   UI powered by [React](https://react.dev) and [Inertia.js](https://inertiajs.com)
-   Styled with [Tailwind CSS](https://tailwindcss.com)
-   Icons by [Lucide](https://lucide.dev)
