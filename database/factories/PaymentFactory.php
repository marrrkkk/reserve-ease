<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
  protected $model = Payment::class;

  public function definition(): array
  {
    return [
      'reservation_id' => Reservation::factory(),
      'user_id' => User::factory(),
      'payment_method' => $this->faker->randomElement(['cash', 'gcash', 'bank_transfer']),
      'amount' => $this->faker->randomFloat(2, 1000, 50000),
      'currency' => 'PHP',
      'status' => $this->faker->randomElement([Payment::STATUS_IN_PROGRESS, Payment::STATUS_PAID]),
      'transaction_id' => 'TXN_' . strtoupper($this->faker->bothify('??########')),
      'reference_number' => 'REF_' . strtoupper($this->faker->bothify('??######')),
      'payment_details' => [
        'payment_method' => $this->faker->randomElement(['cash', 'gcash', 'bank_transfer']),
        'processed_at' => now()->toISOString(),
      ],
      'paid_at' => $this->faker->optional(0.7)->dateTimeBetween('-1 month', 'now'),
    ];
  }
}
