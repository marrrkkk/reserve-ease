<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $packages = [
      [
        'name' => 'Basic Event Package',
        'description' => 'Perfect for intimate gatherings and small celebrations. Includes essential event services with customizable options.',
        'base_price' => 15000.00,
        'category' => 'Basic',
        'is_active' => true,
        'available_tables' => ['Round', 'Rectangular'],
        'available_chairs' => ['Monoblock', 'Plastic'],
        'available_foods' => [
          ['name' => 'Pancit Canton', 'price' => 500.00],
          ['name' => 'Fried Chicken', 'price' => 800.00],
          ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ['name' => 'Fruit Salad', 'price' => 400.00],
          ['name' => 'Soft Drinks', 'price' => 300.00],
        ],
      ],
      [
        'name' => 'Standard Event Package',
        'description' => 'Ideal for medium-sized events and celebrations. Offers a wider selection of customization options and premium choices.',
        'base_price' => 25000.00,
        'category' => 'Standard',
        'is_active' => true,
        'available_tables' => ['Round', 'Rectangular', 'Square'],
        'available_chairs' => ['Tiffany', 'Monoblock', 'Plastic'],
        'available_foods' => [
          ['name' => 'Pancit Canton', 'price' => 500.00],
          ['name' => 'Fried Chicken', 'price' => 800.00],
          ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ['name' => 'Beef Caldereta', 'price' => 1200.00],
          ['name' => 'Grilled Fish', 'price' => 1000.00],
          ['name' => 'Fruit Salad', 'price' => 400.00],
          ['name' => 'Leche Flan', 'price' => 700.00],
          ['name' => 'Soft Drinks', 'price' => 300.00],
          ['name' => 'Iced Tea', 'price' => 350.00],
        ],
      ],
      [
        'name' => 'Premium Event Package',
        'description' => 'Designed for grand celebrations and special occasions. Features premium food selections and elegant furniture options.',
        'base_price' => 40000.00,
        'category' => 'Premium',
        'is_active' => true,
        'available_tables' => ['Round', 'Rectangular', 'Square', 'Oval'],
        'available_chairs' => ['Tiffany', 'Monoblock', 'Chiavari'],
        'available_foods' => [
          ['name' => 'Pancit Canton', 'price' => 500.00],
          ['name' => 'Fried Chicken', 'price' => 800.00],
          ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ['name' => 'Beef Caldereta', 'price' => 1200.00],
          ['name' => 'Grilled Fish', 'price' => 1000.00],
          ['name' => 'Roasted Pork Belly', 'price' => 1500.00],
          ['name' => 'Seafood Platter', 'price' => 2000.00],
          ['name' => 'Fruit Salad', 'price' => 400.00],
          ['name' => 'Leche Flan', 'price' => 700.00],
          ['name' => 'Chocolate Cake', 'price' => 900.00],
          ['name' => 'Soft Drinks', 'price' => 300.00],
          ['name' => 'Iced Tea', 'price' => 350.00],
          ['name' => 'Fresh Juice', 'price' => 450.00],
        ],
      ],
      [
        'name' => 'Deluxe Event Package',
        'description' => 'Our most comprehensive package for luxury events. Includes premium amenities and an extensive menu selection.',
        'base_price' => 60000.00,
        'category' => 'Deluxe',
        'is_active' => true,
        'available_tables' => ['Round', 'Rectangular', 'Square', 'Oval', 'Banquet'],
        'available_chairs' => ['Tiffany', 'Chiavari', 'Ghost Chair'],
        'available_foods' => [
          ['name' => 'Pancit Canton', 'price' => 500.00],
          ['name' => 'Fried Chicken', 'price' => 800.00],
          ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ['name' => 'Beef Caldereta', 'price' => 1200.00],
          ['name' => 'Grilled Fish', 'price' => 1000.00],
          ['name' => 'Roasted Pork Belly', 'price' => 1500.00],
          ['name' => 'Seafood Platter', 'price' => 2000.00],
          ['name' => 'Prime Rib Roast', 'price' => 2500.00],
          ['name' => 'Lobster Thermidor', 'price' => 3000.00],
          ['name' => 'Fruit Salad', 'price' => 400.00],
          ['name' => 'Leche Flan', 'price' => 700.00],
          ['name' => 'Chocolate Cake', 'price' => 900.00],
          ['name' => 'Tiramisu', 'price' => 1100.00],
          ['name' => 'Soft Drinks', 'price' => 300.00],
          ['name' => 'Iced Tea', 'price' => 350.00],
          ['name' => 'Fresh Juice', 'price' => 450.00],
          ['name' => 'Wine Selection', 'price' => 1200.00],
        ],
      ],
      [
        'name' => 'Corporate Event Package',
        'description' => 'Tailored for business events, conferences, and corporate gatherings. Professional setup with flexible catering options.',
        'base_price' => 35000.00,
        'category' => 'Corporate',
        'is_active' => true,
        'available_tables' => ['Rectangular', 'Square', 'Conference'],
        'available_chairs' => ['Tiffany', 'Office Chair', 'Monoblock'],
        'available_foods' => [
          ['name' => 'Pancit Canton', 'price' => 500.00],
          ['name' => 'Fried Chicken', 'price' => 800.00],
          ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ['name' => 'Beef Caldereta', 'price' => 1200.00],
          ['name' => 'Grilled Fish', 'price' => 1000.00],
          ['name' => 'Sandwich Platter', 'price' => 900.00],
          ['name' => 'Pasta Carbonara', 'price' => 1100.00],
          ['name' => 'Fruit Salad', 'price' => 400.00],
          ['name' => 'Cookies & Brownies', 'price' => 500.00],
          ['name' => 'Coffee & Tea', 'price' => 400.00],
          ['name' => 'Soft Drinks', 'price' => 300.00],
          ['name' => 'Bottled Water', 'price' => 200.00],
        ],
      ],
    ];

    foreach ($packages as $packageData) {
      Package::create($packageData);
    }
  }
}
