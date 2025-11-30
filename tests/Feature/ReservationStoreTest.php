<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationStoreTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function it_creates_reservation_with_customer_data_and_customization()
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
        ['name' => 'Fish', 'price' => 6000],
      ],
    ]);

    // Prepare reservation data
    $reservationData = [
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
      'selected_table_type' => 'Round',
      'selected_chair_type' => 'Tiffany',
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 5000],
        ['name' => 'Beef', 'price' => 8000],
      ],
      'customization_notes' => 'Please arrange tables in circular pattern',
    ];

    // Act: Create reservation
    $response = $this->actingAs($user)->post(route('reservations.store'), $reservationData);

    // Assert: Reservation was created
    $response->assertRedirect(route('dashboard'));
    $response->assertSessionHas('success');

    // Assert: Reservation exists in database with correct data
    $this->assertDatabaseHas('reservations', [
      'user_id' => $user->id,
      'package_id' => $package->id,
      'customer_full_name' => 'John Doe',
      'customer_address' => '123 Main St, City',
      'customer_contact_number' => '09123456789',
      'customer_email' => 'john@example.com',
      'event_type' => 'Wedding',
      'venue' => 'Grand Ballroom',
      'guest_count' => 100,
      'status' => 'pending',
      'payment_status' => 'In Progress',
    ]);

    // Assert: PackageCustomization was created
    $this->assertDatabaseHas('package_customizations', [
      'selected_table_type' => 'Round',
      'selected_chair_type' => 'Tiffany',
      'customization_notes' => 'Please arrange tables in circular pattern',
    ]);
  }

  /** @test */
  public function it_validates_required_customer_information_fields()
  {
    $user = User::factory()->create();
    $package = Package::create([
      'name' => 'Test Package',
      'base_price' => 10000.00,
      'is_active' => true,
    ]);

    // Missing customer information
    $response = $this->actingAs($user)->post(route('reservations.store'), [
      'package_id' => $package->id,
      'event_type' => 'Birthday',
      'event_date' => now()->addDays(10)->format('Y-m-d'),
      'venue' => 'Test Venue',
      'guest_count' => 50,
      'selected_table_type' => 'Round',
      'selected_chair_type' => 'Monoblock',
      'selected_foods' => [],
    ]);

    $response->assertSessionHasErrors([
      'customer_full_name',
      'customer_address',
      'customer_contact_number',
      'customer_email',
    ]);
  }

  /** @test */
  public function it_rejects_food_selection_exceeding_package_price()
  {
    $user = User::factory()->create();
    $package = Package::create([
      'name' => 'Budget Package',
      'base_price' => 10000.00,
      'is_active' => true,
      'available_foods' => [
        ['name' => 'Expensive Item', 'price' => 15000],
      ],
    ]);

    $reservationData = [
      'package_id' => $package->id,
      'customer_full_name' => 'Jane Doe',
      'customer_address' => '456 Oak Ave',
      'customer_contact_number' => '09987654321',
      'customer_email' => 'jane@example.com',
      'event_type' => 'Birthday',
      'event_date' => now()->addDays(20)->format('Y-m-d'),
      'venue' => 'Small Hall',
      'guest_count' => 30,
      'selected_table_type' => 'Round',
      'selected_chair_type' => 'Monoblock',
      'selected_foods' => [
        ['name' => 'Expensive Item', 'price' => 15000],
      ],
    ];

    $response = $this->actingAs($user)->post(route('reservations.store'), $reservationData);

    $response->assertSessionHasErrors('selected_foods');
  }
}
