<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Package;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminReservationsTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function admin_reservations_page_displays_payment_method_and_receipt()
  {
    // Create an admin user
    $admin = User::factory()->create(['is_admin' => true]);

    // Create a regular user
    $user = User::factory()->create();

    // Create a package
    $package = Package::factory()->create([
      'name' => 'Wedding Package',
      'base_price' => 50000,
    ]);

    // Create a reservation with customer information
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'John Doe',
      'customer_email' => 'john@example.com',
      'customer_contact_number' => '09123456789',
      'customer_address' => '123 Main St',
      'payment_status' => 'Paid',
    ]);

    // Create a payment with payment method
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'status' => 'Paid',
      'amount' => 50000,
    ]);

    // Create a receipt
    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test-receipt.jpg',
      'file_name' => 'test-receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: Admin views the reservations page
    $response = $this->actingAs($admin)->get(route('admin.reservations'));

    // Assert: Page loads successfully
    $response->assertStatus(200);

    // Assert: Reservation data is passed to the view
    $response->assertInertia(
      fn($page) => $page
        ->component('Admin/Reservations')
        ->has('reservations', 1)
        ->where('reservations.0.id', $reservation->id)
        ->where('reservations.0.payment_status', 'Paid')
        ->has('reservations.0.payments', 1)
        ->where('reservations.0.payments.0.payment_method', 'gcash')
        ->has('reservations.0.receipts', 1)
        ->where('reservations.0.receipts.0.id', $receipt->id)
    );
  }

  /** @test */
  public function admin_reservations_page_shows_reservations_without_receipts()
  {
    // Create an admin user
    $admin = User::factory()->create(['is_admin' => true]);

    // Create a regular user
    $user = User::factory()->create();

    // Create a package
    $package = Package::factory()->create([
      'name' => 'Birthday Package',
      'base_price' => 30000,
    ]);

    // Create a reservation without payment or receipt
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'Jane Smith',
      'customer_email' => 'jane@example.com',
      'customer_contact_number' => '09987654321',
      'customer_address' => '456 Oak Ave',
      'payment_status' => 'In Progress',
    ]);

    // Act: Admin views the reservations page
    $response = $this->actingAs($admin)->get(route('admin.reservations'));

    // Assert: Page loads successfully
    $response->assertStatus(200);

    // Assert: Reservation data is passed without receipts
    $response->assertInertia(
      fn($page) => $page
        ->component('Admin/Reservations')
        ->has('reservations', 1)
        ->where('reservations.0.id', $reservation->id)
        ->where('reservations.0.payment_status', 'In Progress')
        ->has('reservations.0.receipts', 0)
    );
  }
}
