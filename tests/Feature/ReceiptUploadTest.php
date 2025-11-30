<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReceiptUploadTest extends TestCase
{
  use RefreshDatabase;

  /**
   * Test that a user can upload a receipt for their payment.
   */
  public function test_user_can_upload_receipt_for_their_payment()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    $file = UploadedFile::fake()->image('receipt.jpg');

    $response = $this->actingAs($user)->post(
      route('payment.upload-receipt', $payment),
      ['receipt_file' => $file]
    );

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Receipt uploaded successfully!');

    // Verify receipt was created in database
    $this->assertDatabaseHas('receipts', [
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
    ]);

    // Verify file was stored
    $receipt = Receipt::where('payment_id', $payment->id)->first();
    Storage::assertExists($receipt->file_path);
  }

  /**
   * Test that receipt upload validates file type.
   */
  public function test_receipt_upload_validates_file_type()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Try to upload an invalid file type
    $file = UploadedFile::fake()->create('document.txt', 100);

    $response = $this->actingAs($user)->post(
      route('payment.upload-receipt', $payment),
      ['receipt_file' => $file]
    );

    $response->assertSessionHasErrors('receipt_file');
    $this->assertDatabaseCount('receipts', 0);
  }

  /**
   * Test that receipt upload validates file size.
   */
  public function test_receipt_upload_validates_file_size()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Try to upload a file that's too large (6MB, limit is 5MB)
    $file = UploadedFile::fake()->create('receipt.jpg', 6144);

    $response = $this->actingAs($user)->post(
      route('payment.upload-receipt', $payment),
      ['receipt_file' => $file]
    );

    $response->assertSessionHasErrors('receipt_file');
    $this->assertDatabaseCount('receipts', 0);
  }

  /**
   * Test that users cannot upload receipts for other users' payments.
   */
  public function test_user_cannot_upload_receipt_for_other_users_payment()
  {
    Storage::fake('local');

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user1->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user1->id,
    ]);

    $file = UploadedFile::fake()->image('receipt.jpg');

    $response = $this->actingAs($user2)->post(
      route('payment.upload-receipt', $payment),
      ['receipt_file' => $file]
    );

    $response->assertForbidden();
    $this->assertDatabaseCount('receipts', 0);
  }

  /**
   * Test that users can view their own receipts.
   */
  public function test_user_can_view_their_own_receipt()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Create a fake receipt file
    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('receipts.view', $receipt));

    $response->assertOk();
  }

  /**
   * Test that users cannot view other users' receipts.
   */
  public function test_user_cannot_view_other_users_receipt()
  {
    Storage::fake('local');

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user1->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user1->id,
    ]);

    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user2)->get(route('receipts.view', $receipt));

    $response->assertForbidden();
  }

  /**
   * Test that admin can view any receipt.
   */
  public function test_admin_can_view_any_receipt()
  {
    Storage::fake('local');

    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get(route('receipts.view', $receipt));

    $response->assertOk();
  }

  /**
   * Test that users can download their own receipts.
   */
  public function test_user_can_download_their_own_receipt()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Create a fake receipt file
    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('receipts.download', $receipt));

    $response->assertOk();
    $response->assertDownload('test_receipt.jpg');
  }

  /**
   * Test that users cannot download other users' receipts.
   */
  public function test_user_cannot_download_other_users_receipt()
  {
    Storage::fake('local');

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user1->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user1->id,
    ]);

    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user2)->get(route('receipts.download', $receipt));

    $response->assertForbidden();
  }

  /**
   * Test that admin can download any receipt.
   */
  public function test_admin_can_download_any_receipt()
  {
    Storage::fake('local');

    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    Storage::put('receipts/test_receipt.jpg', 'fake content');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/test_receipt.jpg',
      'file_name' => 'test_receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get(route('receipts.download', $receipt));

    $response->assertOk();
    $response->assertDownload('test_receipt.jpg');
  }

  /**
   * Test that viewing a non-existent receipt returns 404.
   */
  public function test_viewing_non_existent_receipt_returns_404()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Create receipt record but don't create the actual file
    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/non_existent.jpg',
      'file_name' => 'non_existent.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('receipts.view', $receipt));

    $response->assertNotFound();
  }

  /**
   * Test that downloading a non-existent receipt returns 404.
   */
  public function test_downloading_non_existent_receipt_returns_404()
  {
    Storage::fake('local');

    $user = User::factory()->create();
    $reservation = Reservation::factory()->create(['user_id' => $user->id]);
    $payment = Payment::factory()->create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
    ]);

    // Create receipt record but don't create the actual file
    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => 'receipts/non_existent.jpg',
      'file_name' => 'non_existent.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('receipts.download', $receipt));

    $response->assertNotFound();
  }
}
