<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReceiptAuthorizationTest extends TestCase
{
  use RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();
    Storage::fake('local');
  }

  /** @test */
  public function customer_can_view_their_own_receipt()
  {
    // Create a user and their reservation
    $user = User::factory()->create();
    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    $reservation = Reservation::create([
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'John Doe',
      'customer_address' => '123 Street',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'john@example.com',
      'event_type' => 'Wedding',
      'event_date' => now()->addDays(30)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 100,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST123',
    ]);

    // Create a receipt file
    $file = UploadedFile::fake()->image('receipt.jpg');
    $filePath = $file->storeAs('receipts', 'receipt_test.jpg');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => $filePath,
      'file_name' => 'receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: User views their own receipt
    $response = $this->actingAs($user)->get(route('receipts.view', $receipt));

    // Assert: Access is allowed
    $response->assertOk();
  }

  /** @test */
  public function customer_cannot_view_another_customers_receipt()
  {
    // Create two users
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create reservation for owner
    $reservation = Reservation::create([
      'user_id' => $owner->id,
      'package_id' => $package->id,
      'customer_full_name' => 'Owner Name',
      'customer_address' => '123 Street',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'owner@example.com',
      'event_type' => 'Birthday',
      'event_date' => now()->addDays(10)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 50,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $owner->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST456',
    ]);

    // Create a receipt file
    $file = UploadedFile::fake()->image('receipt.jpg');
    $filePath = $file->storeAs('receipts', 'receipt_owner.jpg');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => $filePath,
      'file_name' => 'receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: Other user tries to view the receipt
    $response = $this->actingAs($otherUser)->get(route('receipts.view', $receipt));

    // Assert: Access is forbidden
    $response->assertForbidden();
  }

  /** @test */
  public function admin_can_view_any_receipt()
  {
    // Create an admin and a regular user
    $admin = User::factory()->create(['is_admin' => true]);
    $regularUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create reservation for regular user
    $reservation = Reservation::create([
      'user_id' => $regularUser->id,
      'package_id' => $package->id,
      'customer_full_name' => 'Regular User',
      'customer_address' => '456 Avenue',
      'customer_contact_number' => '09987654321',
      'customer_email' => 'user@example.com',
      'event_type' => 'Conference',
      'event_date' => now()->addDays(15)->format('Y-m-d'),
      'venue' => 'Conference Hall',
      'guest_count' => 200,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $regularUser->id,
      'payment_method' => 'bank_transfer',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST789',
    ]);

    // Create a receipt file
    $file = UploadedFile::fake()->image('receipt.jpg');
    $filePath = $file->storeAs('receipts', 'receipt_user.jpg');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => $filePath,
      'file_name' => 'receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: Admin views the receipt
    $response = $this->actingAs($admin)->get(route('receipts.view', $receipt));

    // Assert: Access is allowed
    $response->assertOk();
  }

  /** @test */
  public function customer_can_download_their_own_receipt()
  {
    // Create a user and their reservation
    $user = User::factory()->create();
    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    $reservation = Reservation::create([
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'John Doe',
      'customer_address' => '123 Street',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'john@example.com',
      'event_type' => 'Wedding',
      'event_date' => now()->addDays(30)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 100,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $user->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST123',
    ]);

    // Create a receipt file
    $file = UploadedFile::fake()->image('receipt.jpg');
    $filePath = $file->storeAs('receipts', 'receipt_download.jpg');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => $filePath,
      'file_name' => 'receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: User downloads their own receipt
    $response = $this->actingAs($user)->get(route('receipts.download', $receipt));

    // Assert: Download is successful
    $response->assertOk();
    $response->assertDownload('receipt.jpg');
  }

  /** @test */
  public function customer_cannot_download_another_customers_receipt()
  {
    // Create two users
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create reservation for owner
    $reservation = Reservation::create([
      'user_id' => $owner->id,
      'package_id' => $package->id,
      'customer_full_name' => 'Owner Name',
      'customer_address' => '123 Street',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'owner@example.com',
      'event_type' => 'Birthday',
      'event_date' => now()->addDays(10)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 50,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $owner->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST456',
    ]);

    // Create a receipt file
    $file = UploadedFile::fake()->image('receipt.jpg');
    $filePath = $file->storeAs('receipts', 'receipt_owner_download.jpg');

    $receipt = Receipt::create([
      'payment_id' => $payment->id,
      'reservation_id' => $reservation->id,
      'file_path' => $filePath,
      'file_name' => 'receipt.jpg',
      'file_type' => 'image/jpeg',
      'uploaded_at' => now(),
    ]);

    // Act: Other user tries to download the receipt
    $response = $this->actingAs($otherUser)->get(route('receipts.download', $receipt));

    // Assert: Access is forbidden
    $response->assertForbidden();
  }

  /** @test */
  public function customer_can_only_upload_receipt_for_their_own_payment()
  {
    // Create two users
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create reservation for owner
    $reservation = Reservation::create([
      'user_id' => $owner->id,
      'package_id' => $package->id,
      'customer_full_name' => 'Owner Name',
      'customer_address' => '123 Street',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'owner@example.com',
      'event_type' => 'Birthday',
      'event_date' => now()->addDays(10)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 50,
      'total_amount' => 10000.00,
      'status' => 'pending',
      'payment_status' => Payment::STATUS_IN_PROGRESS,
    ]);

    $payment = Payment::create([
      'reservation_id' => $reservation->id,
      'user_id' => $owner->id,
      'payment_method' => 'gcash',
      'amount' => 10000.00,
      'currency' => 'PHP',
      'status' => Payment::STATUS_IN_PROGRESS,
      'transaction_id' => 'TEST456',
    ]);

    // Act: Other user tries to upload receipt for owner's payment
    $file = UploadedFile::fake()->image('receipt.jpg');
    $response = $this->actingAs($otherUser)->post(
      route('payment.upload-receipt', $payment),
      ['receipt_file' => $file]
    );

    // Assert: Access is forbidden
    $response->assertForbidden();
  }
}
