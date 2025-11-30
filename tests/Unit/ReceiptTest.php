<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReceiptTest extends TestCase
{
  use RefreshDatabase;

  /**
   * Test that Receipt model can be created with required fields.
   */
  public function test_receipt_can_be_created_with_required_fields()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $this->assertInstanceOf(Receipt::class, $receipt);
    $this->assertEquals($payment->id, $receipt->payment_id);
    $this->assertEquals($reservation->id, $receipt->reservation_id);
    $this->assertEquals('receipts/test_receipt.jpg', $receipt->file_path);
  }

  /**
   * Test Receipt relationships.
   */
  public function test_receipt_has_correct_relationships()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $this->assertInstanceOf(Payment::class, $receipt->payment);
    $this->assertInstanceOf(Reservation::class, $receipt->reservation);
    $this->assertEquals($payment->id, $receipt->payment->id);
    $this->assertEquals($reservation->id, $receipt->reservation->id);
  }

  /**
   * Test Receipt file helper methods.
   */
  public function test_receipt_file_helper_methods()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Test fileExists returns false when file doesn't exist
    $this->assertFalse($receipt->fileExists());

    // Create a fake file
    Storage::put('receipts/test_receipt.jpg', 'fake content');

    // Test fileExists returns true when file exists
    $this->assertTrue($receipt->fileExists());

    // Test file size
    $this->assertGreaterThan(0, $receipt->file_size);
  }

  /**
   * Test Receipt verification methods.
   */
  public function test_receipt_verification_methods()
  {
    $user = User::factory()->create();
    $admin = User::factory()->create(['is_admin' => true]);
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Initially not verified
    $this->assertFalse($receipt->isVerified());

    // Mark as verified
    $receipt->update([
      'verified_by' => $admin->id,
      'verified_at' => now(),
    ]);

    // Now should be verified
    $this->assertTrue($receipt->isVerified());
  }
}
