<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Models\Reservation;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::get('/my-reservations', [ReservationController::class, 'userReservations'])->name('reservations.index');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');
    Route::get('/packages/{package}/book', [PackageController::class, 'book'])->name('packages.book');
    Route::get('/packages/{package}/customization-options', [PackageController::class, 'getCustomizationOptions'])->name('packages.customization-options');
    Route::get('/api/user/reservations', [DashboardController::class, 'userReservations']);
    Route::get('/api/user/notifications', [DashboardController::class, 'notifications']);

    // Payment routes
    Route::get('/reservations/{reservation}/payment', [\App\Http\Controllers\PaymentController::class, 'show'])->name('payment.show');
    Route::post('/reservations/{reservation}/payment', [\App\Http\Controllers\PaymentController::class, 'store'])->name('payment.store');
    Route::get('/payments/{payment}/receipt', [\App\Http\Controllers\PaymentController::class, 'receipt'])->name('payment.receipt');
    Route::get('/payments/{payment}/receipt/download', [\App\Http\Controllers\PaymentController::class, 'downloadReceipt'])->name('payment.receipt.download');

    // Receipt upload and viewing routes
    Route::post('/payments/{payment}/upload-receipt', [\App\Http\Controllers\PaymentController::class, 'uploadReceipt'])->name('payment.upload-receipt');
    Route::get('/receipts/{receipt}/view', [\App\Http\Controllers\PaymentController::class, 'viewReceipt'])->name('receipts.view');
    Route::get('/receipts/{receipt}/download', [\App\Http\Controllers\PaymentController::class, 'downloadReceiptFile'])->name('receipts.download');
});

// Admin routes protected by admin middleware
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
    Route::get('/admin/reservations', [AdminController::class, 'reservations'])->name('admin.reservations');
    Route::post('/admin/reservations/{id}/approve', [AdminController::class, 'approve'])->name('admin.reservations.approve');
    Route::post('/admin/reservations/{id}/decline', [AdminController::class, 'decline'])->name('admin.reservations.decline');
    Route::delete('/admin/reservations/{id}', [AdminController::class, 'destroy'])->name('admin.reservations.destroy');
    Route::get('/admin/analytics', [AnalyticsController::class, 'index'])->name('admin.analytics');
    Route::get('/admin/analytics/booking-summary', [AnalyticsController::class, 'bookingSummary'])->name('admin.analytics.booking-summary');
    Route::get('/admin/analytics/monthly-report/{year}/{month}', [AnalyticsController::class, 'monthlyReport'])->name('admin.analytics.monthly-report');
    Route::get('/admin/analytics/revenue-chart/{period}', [AnalyticsController::class, 'revenueChart'])->name('admin.analytics.revenue-chart');
    Route::get('/admin/analytics/print', [AnalyticsController::class, 'printReport'])->name('admin.analytics.print');
    Route::get('/admin/users', [\App\Http\Controllers\UserManagementController::class, 'index'])->name('admin.users');
    Route::patch('/admin/users/{id}', [\App\Http\Controllers\UserManagementController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\UserManagementController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/admin/users/{id}/promote', [\App\Http\Controllers\UserManagementController::class, 'promote'])->name('admin.users.promote');

    // Admin payment management
    Route::get('/admin/payments', [AdminController::class, 'payments'])->name('admin.payments');
    Route::get('/admin/payments/{payment}/receipt', [\App\Http\Controllers\PaymentController::class, 'adminReceipt'])->name('admin.payment.receipt');
    Route::get('/admin/payments/{payment}/receipt/download', [\App\Http\Controllers\PaymentController::class, 'adminDownloadReceipt'])->name('admin.payment.receipt.download');
});

require __DIR__ . '/auth.php';
