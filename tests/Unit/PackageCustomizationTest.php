<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PackageCustomization;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PackageCustomizationTest extends TestCase
{
  use RefreshDatabase;

  /** @test */
  public function it_calculates_total_cost_correctly()
  {
    $customization = new PackageCustomization([
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 500.00],
        ['name' => 'Beef', 'price' => 750.00],
        ['name' => 'Salad', 'price' => 250.00],
      ]
    ]);

    $this->assertEquals(1500.00, $customization->calculateTotalCost());
  }

  /** @test */
  public function it_returns_zero_for_empty_foods()
  {
    $customization = new PackageCustomization([
      'selected_foods' => []
    ]);

    $this->assertEquals(0.0, $customization->calculateTotalCost());
  }

  /** @test */
  public function it_validates_budget_constraint_within_budget()
  {
    $customization = new PackageCustomization([
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 500.00],
        ['name' => 'Beef', 'price' => 400.00],
      ]
    ]);

    $this->assertTrue($customization->validateBudgetConstraint(1000.00));
  }

  /** @test */
  public function it_validates_budget_constraint_exceeds_budget()
  {
    $customization = new PackageCustomization([
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 500.00],
        ['name' => 'Beef', 'price' => 600.00],
      ]
    ]);

    $this->assertFalse($customization->validateBudgetConstraint(1000.00));
  }

  /** @test */
  public function it_validates_budget_constraint_exactly_at_budget()
  {
    $customization = new PackageCustomization([
      'selected_foods' => [
        ['name' => 'Chicken', 'price' => 500.00],
        ['name' => 'Beef', 'price' => 500.00],
      ]
    ]);

    $this->assertTrue($customization->validateBudgetConstraint(1000.00));
  }
}
