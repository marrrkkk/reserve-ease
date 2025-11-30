<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\RevenueService;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RevenueServiceTest extends TestCase
{
  use RefreshDatabase;

  protected RevenueService $revenueService;

  protected function setUp(): void
  {
    parent::setUp();
    $this->revenueService = new RevenueService();
  }

  /** @test */
  public function it_calculates_total_revenue_from_paid_payments_only()
  {
    // Arrange: Create user and reservations
    $user = User::factory()->create();

    $reservation1 = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 1000,
    ]);

    $reservation2 = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 2000,
    ]);

    $reservation3 = Reservation::factory()->create([
      'user_id' => $user->id,
      'total_amount' => 1500,
    ]);

    // Create payments with different statuses
    Payment::factory()->create([
      'reservation_id' => $reservation1->id,
      'user_id' => $user->id,
      'amount' => 1000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation2->id,
      'user_id' => $user->id,
      'amount' => 2000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation3->id,
      'user_id' => $user->id,
      'amount' => 1500,
      'status' => Payment::STATUS_IN_PROGRESS,
      'paid_at' => null,
    ]);

    // Act: Calculate total revenue
    $totalRevenue = $this->revenueService->calculateTotalRevenue();

    // Assert: Only paid payments are included
    $this->assertEquals(3000.00, $totalRevenue);
  }

  /** @test */
  public function it_gets_revenue_by_payment_method()
  {
    // Arrange: Create user and reservations
    $user = User::factory()->create();

    $reservation1 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation2 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation3 = Reservation::factory()->create(['user_id' => $user->id]);

    // Create payments with different methods
    Payment::factory()->create([
      'reservation_id' => $reservation1->id,
      'user_id' => $user->id,
      'amount' => 1000,
      'payment_method' => 'gcash',
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation2->id,
      'user_id' => $user->id,
      'amount' => 2000,
      'payment_method' => 'gcash',
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation3->id,
      'user_id' => $user->id,
      'amount' => 1500,
      'payment_method' => 'bank_transfer',
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    // Act: Get revenue by payment method
    $revenueByMethod = $this->revenueService->getRevenueByPaymentMethod();

    // Assert: Revenue is grouped correctly
    $this->assertCount(2, $revenueByMethod);

    $gcashRevenue = collect($revenueByMethod)->firstWhere('payment_method', 'gcash');
    $this->assertEquals(3000.00, $gcashRevenue['revenue']);
    $this->assertEquals(2, $gcashRevenue['payment_count']);

    $bankRevenue = collect($revenueByMethod)->firstWhere('payment_method', 'bank_transfer');
    $this->assertEquals(1500.00, $bankRevenue['revenue']);
    $this->assertEquals(1, $bankRevenue['payment_count']);
  }

  /** @test */
  public function it_gets_revenue_by_period_monthly()
  {
    // Arrange: Create user and reservations
    $user = User::factory()->create();

    $reservation1 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation2 = Reservation::factory()->create(['user_id' => $user->id]);

    // Create payments in different months
    Payment::factory()->create([
      'reservation_id' => $reservation1->id,
      'user_id' => $user->id,
      'amount' => 1000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now()->startOfMonth(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation2->id,
      'user_id' => $user->id,
      'amount' => 2000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now()->startOfMonth(),
    ]);

    // Act: Get revenue by month
    $revenueByPeriod = $this->revenueService->getRevenueByPeriod('monthly');

    // Assert: Revenue is grouped by month
    $this->assertNotEmpty($revenueByPeriod);
    $this->assertEquals(3000.00, $revenueByPeriod[0]['revenue']);
    $this->assertEquals(2, $revenueByPeriod[0]['payment_count']);
  }

  /** @test */
  public function it_gets_paid_reservations()
  {
    // Arrange: Create user and reservations
    $user = User::factory()->create();

    $reservation1 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation2 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation3 = Reservation::factory()->create(['user_id' => $user->id]);

    // Create payments
    Payment::factory()->create([
      'reservation_id' => $reservation1->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation2->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now(),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation3->id,
      'user_id' => $user->id,
      'status' => Payment::STATUS_IN_PROGRESS,
      'paid_at' => null,
    ]);

    // Act: Get paid reservations
    $paidReservations = $this->revenueService->getPaidReservations();

    // Assert: Only reservations with paid payments are returned
    $this->assertCount(2, $paidReservations);
    $this->assertTrue($paidReservations->contains($reservation1));
    $this->assertTrue($paidReservations->contains($reservation2));
    $this->assertFalse($paidReservations->contains($reservation3));
  }

  /** @test */
  public function it_filters_revenue_by_date_range()
  {
    // Arrange: Create user and reservations
    $user = User::factory()->create();

    $reservation1 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation2 = Reservation::factory()->create(['user_id' => $user->id]);
    $reservation3 = Reservation::factory()->create(['user_id' => $user->id]);

    // Create payments on different dates
    Payment::factory()->create([
      'reservation_id' => $reservation1->id,
      'user_id' => $user->id,
      'amount' => 1000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now()->subDays(10),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation2->id,
      'user_id' => $user->id,
      'amount' => 2000,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now()->subDays(5),
    ]);

    Payment::factory()->create([
      'reservation_id' => $reservation3->id,
      'user_id' => $user->id,
      'amount' => 1500,
      'status' => Payment::STATUS_PAID,
      'paid_at' => now()->subDays(1),
    ]);

    // Act: Calculate revenue for last 7 days
    $recentRevenue = $this->revenueService->calculateTotalRevenue(
      now()->subDays(7)->format('Y-m-d'),
      now()->format('Y-m-d')
    );

    // Assert: Only payments within date range are included
    $this->assertEquals(3500.00, $recentRevenue);
  }
}
