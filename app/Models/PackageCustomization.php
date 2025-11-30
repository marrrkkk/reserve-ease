<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageCustomization extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<string>
   */
  protected $fillable = [
    'reservation_id',
    'selected_table_type',
    'selected_chair_type',
    'selected_foods',
    'customization_notes',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'selected_foods' => 'array',
    ];
  }

  /**
   * Get the reservation that owns this customization.
   */
  public function reservation()
  {
    return $this->belongsTo(Reservation::class);
  }

  /**
   * Calculate the total cost of selected food items.
   *
   * @return float
   */
  public function calculateTotalCost(): float
  {
    if (empty($this->selected_foods) || !is_array($this->selected_foods)) {
      return 0.0;
    }

    $total = 0.0;
    foreach ($this->selected_foods as $food) {
      if (isset($food['price'])) {
        $total += (float) $food['price'];
      }
    }

    return $total;
  }

  /**
   * Validate that the selected foods do not exceed the package budget.
   *
   * @param float $packagePrice The base price of the package
   * @return bool True if within budget, false if exceeds budget
   */
  public function validateBudgetConstraint(float $packagePrice): bool
  {
    $totalCost = $this->calculateTotalCost();
    return $totalCost <= $packagePrice;
  }
}
