<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
  use RefreshDatabase;

  public function test_admin_can_access_user_management_page()
  {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->get('/admin/users');
    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page->component('Admin/UserManagement'));
  }

  public function test_regular_user_cannot_access_user_management()
  {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->get('/admin/users');
    $response->assertStatus(403);
  }

  public function test_admin_can_update_user_information()
  {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}", [
      'name' => 'New Name',
      'email' => 'new@example.com',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'User updated successfully!');

    $user->refresh();
    $this->assertEquals('New Name', $user->name);
    $this->assertEquals('new@example.com', $user->email);
  }

  public function test_admin_can_promote_user_to_admin()
  {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($admin)->post("/admin/users/{$user->id}/promote");

    $response->assertRedirect();
    $response->assertSessionHas('success', 'User promoted to admin successfully!');

    $user->refresh();
    $this->assertTrue($user->is_admin);
  }

  public function test_admin_can_delete_other_users()
  {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

    $response->assertRedirect();
    $response->assertSessionHas('success', 'User deleted successfully!');
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
  }

  public function test_admin_cannot_delete_themselves()
  {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    $response->assertRedirect();
    $response->assertSessionHas('error', 'You cannot delete your own account.');
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
  }

  public function test_update_user_validates_email_uniqueness()
  {
    $admin = User::factory()->create(['is_admin' => true]);
    $user1 = User::factory()->create(['email' => 'existing@example.com']);
    $user2 = User::factory()->create(['email' => 'other@example.com']);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user2->id}", [
      'name' => 'Test Name',
      'email' => 'existing@example.com', // This email already exists
    ]);

    $response->assertSessionHasErrors('email');
  }
}
