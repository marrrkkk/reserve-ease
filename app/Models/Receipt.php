<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Receipt extends Model
{
  use HasFactory;

  protected $fillable = [
    'payment_id',
    'reservation_id',
    'file_path',
    'file_name',
    'file_type',
    'uploaded_at',
    'verified_by',
    'verified_at',
  ];

  protected $casts = [
    'uploaded_at' => 'datetime',
    'verified_at' => 'datetime',
  ];

  /**
   * Get the payment that owns the receipt.
   */
  public function payment()
  {
    return $this->belongsTo(Payment::class);
  }

  /**
   * Get the reservation that owns the receipt.
   */
  public function reservation()
  {
    return $this->belongsTo(Reservation::class);
  }

  /**
   * Get the admin user who verified the receipt.
   */
  public function verifier()
  {
    return $this->belongsTo(User::class, 'verified_by');
  }

  /**
   * Get the full file path for storage operations.
   */
  public function getFullPathAttribute()
  {
    return storage_path('app/' . $this->file_path);
  }

  /**
   * Get the public URL for the receipt file.
   */
  public function getUrlAttribute()
  {
    return Storage::url($this->file_path);
  }

  /**
   * Check if the receipt file exists.
   */
  public function fileExists()
  {
    return Storage::exists($this->file_path);
  }

  /**
   * Get the file size in bytes.
   */
  public function getFileSizeAttribute()
  {
    if ($this->fileExists()) {
      return Storage::size($this->file_path);
    }
    return 0;
  }

  /**
   * Get the formatted file size.
   */
  public function getFormattedFileSizeAttribute()
  {
    $bytes = $this->file_size;
    $units = ['B', 'KB', 'MB', 'GB'];

    for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
      $bytes /= 1024;
    }

    return round($bytes, 2) . ' ' . $units[$i];
  }

  /**
   * Check if the receipt has been verified.
   */
  public function isVerified()
  {
    return !is_null($this->verified_at) && !is_null($this->verified_by);
  }

  /**
   * Delete the receipt file from storage.
   */
  public function deleteFile()
  {
    if ($this->fileExists()) {
      return Storage::delete($this->file_path);
    }
    return false;
  }
}
