<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageCustomization;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $users = User::where('is_admin', false)->get();
    $packages = Package::all();

    if ($users->isEmpty() || $packages->isEmpty()) {
      $this->command->warn('No users or packages found. Please run UserSeeder and PackageSeeder first.');
      return;
    }

    $sampleReservations = [
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Basic Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Maria Santos',
        'customer_address' => '123 Mabini Street, Quezon City, Metro Manila',
        'customer_contact_number' => '09171234567',
        'customer_email' => 'maria.santos@email.com',
        'event_type' => 'Birthday Party',
        'event_date' => now()->addDays(30)->format('Y-m-d'),
        'event_time' => '14:00:00',
        'venue' => 'Garden Hall',
        'guest_count' => 50,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_PAID,
        'customization' => [
          'table_type' => 'Round',
          'chair_type' => 'Monoblock',
          'foods' => [
            ['name' => 'Pancit Canton', 'price' => 500.00],
            ['name' => 'Fried Chicken', 'price' => 800.00],
            ['name' => 'Lumpia Shanghai', 'price' => 600.00],
          ],
        ],
        'payment_method' => 'GCash',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Standard Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Juan Dela Cruz',
        'customer_address' => '456 Rizal Avenue, Makati City, Metro Manila',
        'customer_contact_number' => '09189876543',
        'customer_email' => 'juan.delacruz@email.com',
        'event_type' => 'Wedding Reception',
        'event_date' => now()->addDays(60)->format('Y-m-d'),
        'event_time' => '18:00:00',
        'venue' => 'Grand Ballroom',
        'guest_count' => 100,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_IN_PROGRESS,
        'customization' => [
          'table_type' => 'Round',
          'chair_type' => 'Tiffany',
          'foods' => [
            ['name' => 'Beef Caldereta', 'price' => 1200.00],
            ['name' => 'Grilled Fish', 'price' => 1000.00],
            ['name' => 'Leche Flan', 'price' => 700.00],
          ],
        ],
        'payment_method' => 'Bank Transfer',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Premium Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Ana Reyes',
        'customer_address' => '789 Bonifacio Street, Pasig City, Metro Manila',
        'customer_contact_number' => '09201234567',
        'customer_email' => 'ana.reyes@email.com',
        'event_type' => 'Corporate Event',
        'event_date' => now()->addDays(45)->format('Y-m-d'),
        'event_time' => '10:00:00',
        'venue' => 'Conference Center',
        'guest_count' => 150,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_PAID,
        'customization' => [
          'table_type' => 'Rectangular',
          'chair_type' => 'Tiffany',
          'foods' => [
            ['name' => 'Roasted Pork Belly', 'price' => 1500.00],
            ['name' => 'Seafood Platter', 'price' => 2000.00],
            ['name' => 'Chocolate Cake', 'price' => 900.00],
          ],
        ],
        'payment_method' => 'GCash',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Deluxe Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Roberto Garcia',
        'customer_address' => '321 Luna Street, Taguig City, Metro Manila',
        'customer_contact_number' => '09156789012',
        'customer_email' => 'roberto.garcia@email.com',
        'event_type' => 'Anniversary Celebration',
        'event_date' => now()->addDays(90)->format('Y-m-d'),
        'event_time' => '19:00:00',
        'venue' => 'Luxury Hall',
        'guest_count' => 200,
        'status' => 'pending',
        'payment_status' => Payment::STATUS_IN_PROGRESS,
        'customization' => [
          'table_type' => 'Round',
          'chair_type' => 'Chiavari',
          'foods' => [
            ['name' => 'Prime Rib Roast', 'price' => 2500.00],
            ['name' => 'Lobster Thermidor', 'price' => 3000.00],
            ['name' => 'Tiramisu', 'price' => 1100.00],
          ],
        ],
        'payment_method' => 'Bank Transfer',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Corporate Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Carmen Lopez',
        'customer_address' => '654 Aguinaldo Highway, Cavite',
        'customer_contact_number' => '09178901234',
        'customer_email' => 'carmen.lopez@email.com',
        'event_type' => 'Business Conference',
        'event_date' => now()->addDays(15)->format('Y-m-d'),
        'event_time' => '09:00:00',
        'venue' => 'Executive Meeting Room',
        'guest_count' => 75,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_PAID,
        'customization' => [
          'table_type' => 'Rectangular',
          'chair_type' => 'Office Chair',
          'foods' => [
            ['name' => 'Sandwich Platter', 'price' => 900.00],
            ['name' => 'Pasta Carbonara', 'price' => 1100.00],
            ['name' => 'Coffee & Tea', 'price' => 400.00],
          ],
        ],
        'payment_method' => 'GCash',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Basic Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Pedro Ramos',
        'customer_address' => '987 Del Pilar Street, Manila',
        'customer_contact_number' => '09192345678',
        'customer_email' => 'pedro.ramos@email.com',
        'event_type' => 'Christening',
        'event_date' => now()->addDays(20)->format('Y-m-d'),
        'event_time' => '11:00:00',
        'venue' => 'Community Hall',
        'guest_count' => 40,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_IN_PROGRESS,
        'customization' => [
          'table_type' => 'Round',
          'chair_type' => 'Plastic',
          'foods' => [
            ['name' => 'Pancit Canton', 'price' => 500.00],
            ['name' => 'Fruit Salad', 'price' => 400.00],
            ['name' => 'Soft Drinks', 'price' => 300.00],
          ],
        ],
        'payment_method' => 'Cash',
      ],
      [
        'user' => $users->random(),
        'package' => $packages->where('name', 'Standard Event Package')->first() ?? $packages->random(),
        'customer_full_name' => 'Sofia Mendoza',
        'customer_address' => '147 Magsaysay Boulevard, Caloocan City',
        'customer_contact_number' => '09203456789',
        'customer_email' => 'sofia.mendoza@email.com',
        'event_type' => 'Graduation Party',
        'event_date' => now()->addDays(50)->format('Y-m-d'),
        'event_time' => '16:00:00',
        'venue' => 'Garden Pavilion',
        'guest_count' => 80,
        'status' => 'confirmed',
        'payment_status' => Payment::STATUS_PAID,
        'customization' => [
          'table_type' => 'Square',
          'chair_type' => 'Monoblock',
          'foods' => [
            ['name' => 'Fried Chicken', 'price' => 800.00],
            ['name' => 'Lumpia Shanghai', 'price' => 600.00],
            ['name' => 'Iced Tea', 'price' => 350.00],
          ],
        ],
        'payment_method' => 'GCash',
      ],
    ];

    foreach ($sampleReservations as $reservationData) {
      $package = $reservationData['package'];
      $customization = $reservationData['customization'];

      // Calculate total amount
      $totalAmount = $package->base_price;

      // Create reservation
      $reservation = Reservation::create([
        'user_id' => $reservationData['user']->id,
        'package_id' => $package->id,
        'customer_full_name' => $reservationData['customer_full_name'],
        'customer_address' => $reservationData['customer_address'],
        'customer_contact_number' => $reservationData['customer_contact_number'],
        'customer_email' => $reservationData['customer_email'],
        'event_type' => $reservationData['event_type'],
        'event_date' => $reservationData['event_date'],
        'event_time' => $reservationData['event_time'],
        'venue' => $reservationData['venue'],
        'guest_count' => $reservationData['guest_count'],
        'status' => $reservationData['status'],
        'payment_status' => $reservationData['payment_status'],
        'total_amount' => $totalAmount,
      ]);

      // Create package customization
      PackageCustomization::create([
        'reservation_id' => $reservation->id,
        'selected_table_type' => $customization['table_type'],
        'selected_chair_type' => $customization['chair_type'],
        'selected_foods' => $customization['foods'],
        'customization_notes' => 'Sample customization for ' . $reservationData['event_type'],
      ]);

      // Create payment record
      $payment = Payment::create([
        'reservation_id' => $reservation->id,
        'user_id' => $reservationData['user']->id,
        'payment_method' => $reservationData['payment_method'],
        'amount' => $totalAmount,
        'currency' => 'PHP',
        'status' => $reservationData['payment_status'],
        'transaction_id' => 'TXN-' . strtoupper(uniqid()),
        'reference_number' => 'REF-' . strtoupper(uniqid()),
        'payment_details' => [
          'method' => $reservationData['payment_method'],
          'account_info' => $reservationData['payment_method'] === 'GCash' ? '0982 726 5178' : null,
        ],
        'paid_at' => $reservationData['payment_status'] === Payment::STATUS_PAID ? now() : null,
      ]);
    }

    $this->command->info('Created ' . count($sampleReservations) . ' sample reservations with customizations and payments.');
  }
}
