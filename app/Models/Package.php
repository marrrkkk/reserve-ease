<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<string>
   */
  protected $fillable = [
    'name',
    'description',
    'base_price',
    'category',
    'is_active',
    'available_tables',
    'available_chairs',
    'available_foods',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'available_tables' => 'array',
      'available_chairs' => 'array',
      'available_foods' => 'array',
      'base_price' => 'decimal:2',
      'is_active' => 'boolean',
    ];
  }

  /**
   * Get the reservations for this package.
   */
  public function reservations()
  {
    return $this->hasMany(Reservation::class);
  }

  /**
   * Get all available customization options for this package.
   *
   * @return array
   */
  public function getAvailableOptions(): array
  {
    return [
      'tables' => $this->available_tables ?? [],
      'chairs' => $this->available_chairs ?? [],
      'foods' => $this->available_foods ?? [],
    ];
  }
}
