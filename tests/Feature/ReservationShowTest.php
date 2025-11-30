<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\PackageCustomization;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationShowTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function it_displays_complete_reservation_details_with_all_relationships()
  {
    // Create a user and package
    $user = User::factory()->create();
    $package = Package::create([
      'name' => 'Wedding Package',
      'description' => 'Complete wedding package',
      'base_price' => 50000.00,
      'category' => 'Wedding',
      'is_active' => true,
      'available_tables' => ['Round', 'Rectangular'],
      'available_chairs' => ['Tiffany', 'Monoblock'],
      'available_foods' => [
        ['name' => 'Chicken', 'price' => 5000],
        ['name' => 'Beef', 'price' => 8000],
      ],
    ]);

    // Create a reservation
    $reservation = Reservation::create([
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'John Doe',
      'customer_address' => '123 Main St, City',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'john@example.com',
      'event_type' => 'Wedding',
      'event_date' => now()->addDays(30)->format('Y-m-d'),
      'event_time' => '14:00',
      'venue' => 'Grand Ballroom',
      'guest_count' => 100,
      'total_amount' => 50000.00,
      'status' => 'pending',
      'payment_status' => 'In Progress',
    ]);

    // Create customization
    PackageCustomization::create([
      'reservation_id' => $reservation->id,
      'selected_table_type' => 'Round',
      'selected_chair_type' => 'Tiffany',
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 5000],
        ['name' => 'Beef', 'price' => 8000],
      ],
      'customization_notes' => 'Special arrangement',
    ]);

    // Act: View reservation details
    $response = $this->actingAs($user)->get(route('reservations.show', $reservation));

    // Assert: Response is successful
    $response->assertOk();

    // Assert: All required data is present in the response
    $response->assertInertia(
      fn($page) => $page
        ->component('Reservation/Show')
        ->has(
          'reservation',
          fn($reservation) => $reservation
            ->where('customer_full_name', 'John Doe')
            ->where('customer_address', '123 Main St, City')
            ->where('customer_contact_number', '09123456789')
            ->where('customer_email', 'john@example.com')
            ->where('event_type', 'Wedding')
            ->where('venue', 'Grand Ballroom')
            ->where('guest_count', 100)
            ->where('payment_status', 'In Progress')
            ->has(
              'package',
              fn($package) => $package
                ->where('name', 'Wedding Package')
                ->where('base_price', '50000.00')
                ->etc()
            )
            ->has(
              'customization_details',
              fn($customization) => $customization
                ->where('selected_table_type', 'Round')
                ->where('selected_chair_type', 'Tiffany')
                ->has('selected_foods', 2)
                ->etc()
            )
            ->etc()
        )
    );
  }

  /** @test */
  public function it_prevents_unauthorized_users_from_viewing_other_users_reservations()
  {
    // Create two users
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create a reservation for the owner
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
      'payment_status' => 'In Progress',
    ]);

    // Act: Other user tries to view the reservation
    $response = $this->actingAs($otherUser)->get(route('reservations.show', $reservation));

    // Assert: Access is forbidden
    $response->assertForbidden();
  }

  /** @test */
  public function it_allows_admin_to_view_any_reservation()
  {
    // Create an admin user and a regular user
    $admin = User::factory()->create(['is_admin' => true]);
    $regularUser = User::factory()->create();

    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Create a reservation for the regular user
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
      'payment_status' => 'In Progress',
    ]);

    // Act: Admin views the reservation
    $response = $this->actingAs($admin)->get(route('reservations.show', $reservation));

    // Assert: Access is allowed
    $response->assertOk();
  }
}
