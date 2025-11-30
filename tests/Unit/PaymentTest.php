<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
  use RefreshDatabase;

  /**
   * Test that Payment model validates status to be "Paid" or "In Progress".
   */
  public function test_payment_status_must_be_valid()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);

    // Test valid status: "Paid"
    $payment1 = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
    ]);
    $this->assertEquals('Paid', $payment1->status);

    // Test valid status: "In Progress"
    $payment2 = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);
    $this->assertEquals('In Progress', $payment2->status);
  }

  /**
   * Test that Payment model rejects invalid status values.
   */
  public function test_payment_rejects_invalid_status()
  {
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Payment status must be either "Paid" or "In Progress"');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);

    Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => 'Invalid Status',
    ]);
  }

  /**
   * Test markAsPaid method updates status and paid_at timestamp.
   */
  public function test_mark_as_paid_updates_status_and_timestamp()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'payment_status' => 'In Progress',
    ]);

    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
      'paid_at' => null,
    ]);

    $payment->markAsPaid();

    $this->assertEquals('Paid', $payment->fresh()->status);
    $this->assertNotNull($payment->fresh()->paid_at);
    $this->assertEquals('Paid', $reservation->fresh()->payment_status);
  }

  /**
   * Test markAsInProgress method updates status and clears paid_at.
   */
  public function test_mark_as_in_progress_updates_status_and_clears_timestamp()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'payment_status' => 'Paid',
    ]);

    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    $payment->markAsInProgress();

    $this->assertEquals('In Progress', $payment->fresh()->status);
    $this->assertNull($payment->fresh()->paid_at);
    $this->assertEquals('In Progress', $reservation->fresh()->payment_status);
  }

  /**
   * Test updateStatus method with valid status.
   */
  public function test_update_status_with_valid_status()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'payment_status' => 'In Progress',
    ]);

    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment->updateStatus(Payment::STATUS_PAID);

    $this->assertEquals('Paid', $payment->fresh()->status);
    $this->assertNotNull($payment->fresh()->paid_at);
    $this->assertEquals('Paid', $reservation->fresh()->payment_status);
  }

  /**
   * Test updateStatus method rejects invalid status.
   */
  public function test_update_status_rejects_invalid_status()
  {
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Payment status must be either "Paid" or "In Progress"');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);

    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment->updateStatus('Invalid Status');
  }

  /**
   * Test isPaid method returns correct boolean.
   */
  public function test_is_paid_returns_correct_boolean()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);

    $paidPayment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
    ]);

    $inProgressPayment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $this->assertTrue($paidPayment->isPaid());
    $this->assertFalse($inProgressPayment->isPaid());
  }

  /**
   * Test isInProgress method returns correct boolean.
   */
  public function test_is_in_progress_returns_correct_boolean()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);

    $paidPayment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
    ]);

    $inProgressPayment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $this->assertFalse($paidPayment->isInProgress());
    $this->assertTrue($inProgressPayment->isInProgress());
  }

  /**
   * Test that updating payment status also updates reservation payment status.
   */
  public function test_payment_status_update_syncs_with_reservation()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'payment_status' => 'In Progress',
    ]);

    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
    ]);

    // Update to Paid
    $payment->updateStatus(Payment::STATUS_PAID);
    $this->assertEquals('Paid', $reservation->fresh()->payment_status);

    // Update back to In Progress
    $payment->updateStatus(Payment::STATUS_IN_PROGRESS);
    $this->assertEquals('In Progress', $reservation->fresh()->payment_status);
  }
}
