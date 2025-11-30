<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
  protected $model = Package::class;

  public function definition(): array
  {
    return [
      'name' => $this->faker->words(3, true),
      'description' => $this->faker->paragraph(),
      'base_price' => $this->faker->randomFloat(2, 10000, 100000),
      'category' => $this->faker->randomElement(['Wedding', 'Birthday', 'Corporate', 'Anniversary']),
      'is_active' => true,
      'available_tables' => ['Round', 'Rectangular', 'Square'],
      'available_chairs' => ['Tiffany', 'Monoblock', 'Plastic'],
      'available_foods' => [
        ['name' => 'Chicken', 'price' => 500],
        ['name' => 'Beef', 'price' => 800],
        ['name' => 'Fish', 'price' => 600],
        ['name' => 'Pasta', 'price' => 400],
      ],
    ];
  }
}
