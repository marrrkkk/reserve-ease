<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentMethodsTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function payment_show_page_includes_payment_methods_with_gcash_number()
  {
    // Create a user and reservation
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 10000.00,
      'payment_status' => 'In Progress',
    ]);

    // Act: Visit payment page
    $response = $this->actingAs($user)->get(route('payment.show', $reservation));

    // Assert: Response is successful
    $response->assertOk();

    // Assert: Payment methods are included in the response
    $response->assertInertia(
      fn($page) => $page
        ->component('Payment/Show')
        ->has('paymentMethods')
        ->has('paymentMethods.gcash')
        ->where('paymentMethods.gcash.account_number', '0982 726 5178')
        ->where('paymentMethods.gcash.name', 'GCash')
        ->where('paymentMethods.gcash.details', 'Send payment to GCash number: 0982 726 5178')
    );
  }

  /** @test */
  public function payment_methods_include_all_required_details()
  {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 5000.00,
    ]);

    $response = $this->actingAs($user)->get(route('payment.show', $reservation));

    $response->assertOk();

    // Assert: All payment methods are present with details
    $response->assertInertia(
      fn($page) => $page
        ->has('paymentMethods.cash')
        ->has('paymentMethods.gcash')
        ->has('paymentMethods.bank_transfer')
        ->where('paymentMethods.cash.name', 'Cash Payment')
        ->where('paymentMethods.cash.details', 'Payment will be collected at the venue on the event date.')
        ->where('paymentMethods.bank_transfer.name', 'Bank Transfer')
        ->where('paymentMethods.bank_transfer.details', 'Transfer to our bank account and upload the receipt.')
    );
  }

  /** @test */
  public function user_cannot_access_another_users_payment_page()
  {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $reservation = Reservation::factory()->create([
      'user_id' => $user1->id,
    ]);

    // Act: User 2 tries to access User 1's payment page
    $response = $this->actingAs($user2)->get(route('payment.show', $reservation));

    // Assert: Access is forbidden
    $response->assertForbidden();
  }
}
