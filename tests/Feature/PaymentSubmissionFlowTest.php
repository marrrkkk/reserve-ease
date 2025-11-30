<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentSubmissionFlowTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function payment_submission_creates_payment_and_shows_receipt_upload()
  {
    // Arrange: Create a user and reservation
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 10000.00,
      'payment_status' => 'In Progress',
    ]);

    // Act: Submit payment with GCash method
    $response = $this->actingAs($user)->post(route('payment.store', $reservation), [
      'payment_method' => 'gcash',
      'mobile_number' => '09123456789',
      'reference_number' => '1234567890123',
    ]);

    // Assert: Payment is created
    $this->assertDatabaseHas('payments', [
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    // Assert: Response returns to payment page with payment data
    $response->assertInertia(
      fn($page) => $page
        ->component('Payment/Show')
        ->has('payment')
        ->where('payment.payment_method', 'gcash')
        ->where('payment.status', Payment::STATUS_IN_PROGRESS)
    );
  }

  /** @test */
  public function cash_payment_redirects_to_receipt_page()
  {
    // Arrange: Create a user and reservation
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 5000.00,
      'payment_status' => 'In Progress',
    ]);

    // Act: Submit payment with cash method
    $response = $this->actingAs($user)->post(route('payment.store', $reservation), [
      'payment_method' => 'cash',
      'mobile_number' => '',
      'reference_number' => '',
    ]);

    // Assert: Payment is created with Paid status
    $payment = Payment::where('reservation_id', $reservation->id)->first();
    $this->assertNotNull($payment);
    $this->assertEquals(Payment::STATUS_PAID, $payment->status);

    // Assert: Redirects to receipt page
    $response->assertRedirect(route('payment.receipt', $payment));
  }

  /** @test */
  public function cannot_create_duplicate_payment_for_same_reservation()
  {
    // Arrange: Create a user, reservation, and existing payment
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 10000.00,
      'payment_status' => 'In Progress',
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    // Act: Try to create another payment
    $response = $this->actingAs($user)->post(route('payment.store', $reservation), [
      'payment_method' => 'gcash',
      'mobile_number' => '09123456789',
      'reference_number' => '1234567890123',
    ]);

    // Assert: Redirected back with error
    $response->assertRedirect();
    $response->assertSessionHas('error', 'A payment already exists for this reservation.');

    // Assert: Only one payment exists
    $this->assertEquals(1, Payment::where('reservation_id', $reservation->id)->count());
  }

  /** @test */
  public function existing_in_progress_payment_is_shown_on_payment_page()
  {
    // Arrange: Create a user, reservation, and existing payment
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 10000.00,
      'payment_status' => 'In Progress',
    ]);

    $existingPayment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    // Act: Visit payment page
    $response = $this->actingAs($user)->get(route('payment.show', $reservation));

    // Assert: Existing payment is included in response
    $response->assertInertia(
      fn($page) => $page
        ->component('Payment/Show')
        ->has('payment')
        ->where('payment.id', $existingPayment->id)
        ->where('payment.status', Payment::STATUS_IN_PROGRESS)
    );
  }
}
