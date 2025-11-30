<?php

namespace Database\Factories;

use App\Models\Package;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
  protected $model = Reservation::class;

  public function definition(): array
  {
    return [
      'user_id' => User::factory(),
      'package_id' => Package::factory(),
      'customer_full_name' => $this->faker->name(),
      'customer_address' => $this->faker->address(),
      'customer_contact_number' => $this->faker->phoneNumber(),
      'customer_email' => $this->faker->safeEmail(),
      'event_type' => $this->faker->randomElement(['Wedding', 'Birthday', 'Corporate Event', 'Anniversary']),
      'event_date' => $this->faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
      'event_time' => $this->faker->time('H:i'),
      'venue' => $this->faker->address(),
      'guest_count' => $this->faker->numberBetween(20, 200),
      'status' => $this->faker->randomElement(['pending', 'approved', 'declined']),
      'payment_status' => $this->faker->randomElement(['pending', 'paid', 'completed']),
      'total_amount' => $this->faker->randomFloat(2, 5000, 50000),
    ];
  }
}
