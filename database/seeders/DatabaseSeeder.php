<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        // Create a regular test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_admin' => false,
        ]);

        // Create additional sample users for demonstration
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'is_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'is_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Mike Johnson',
            'email' => 'mike@example.com',
            'is_admin' => true,
        ]);

        // Create a few more random users
        User::factory(5)->create();
    }
}
