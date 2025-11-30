<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    // Valid payment status values according to requirements
    public const STATUS_PAID = 'Paid';
    public const STATUS_IN_PROGRESS = 'In Progress';

    protected $fillable = [
        'reservation_id',
        'user_id',
        'payment_method',
        'amount',
        'currency',
        'status',
        'transaction_id',
        'reference_number',
        'payment_details',
        'paid_at',
    ];

    protected $casts = [
        'payment_details' => 'array',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Boot method to add model event listeners
     */
    protected static function boot()
    {
        parent::boot();

        // Validate status before creating or updating
        static::saving(function ($payment) {
            if (!\in_array($payment->status, [self::STATUS_PAID, self::STATUS_IN_PROGRESS], true)) {
                throw new \InvalidArgumentException(
                    'Payment status must be either "Paid" or "In Progress"'
                );
            }
        });
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }

    public function getFormattedAmountAttribute()
    {
        return '₱' . number_format((float) $this->amount, 2);
    }

    /**
     * Check if payment is completed (Paid status)
     */
    public function isPaid()
    {
        return $this->status === self::STATUS_PAID;
    }

    /**
     * Check if payment is in progress
     */
    public function isInProgress()
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    /**
     * Update payment status to Paid
     */
    public function markAsPaid()
    {
        $this->update([
            'status' => self::STATUS_PAID,
            'paid_at' => now(),
        ]);

        // Also update the reservation payment status
        if ($this->reservation) {
            $this->reservation->update(['payment_status' => self::STATUS_PAID]);
        }
    }

    /**
     * Update payment status to In Progress
     */
    public function markAsInProgress()
    {
        $this->update([
            'status' => self::STATUS_IN_PROGRESS,
            'paid_at' => null,
        ]);

        // Also update the reservation payment status
        if ($this->reservation) {
            $this->reservation->update(['payment_status' => self::STATUS_IN_PROGRESS]);
        }
    }

    /**
     * Update payment status with validation
     */
    public function updateStatus(string $status)
    {
        if (!\in_array($status, [self::STATUS_PAID, self::STATUS_IN_PROGRESS], true)) {
            throw new \InvalidArgumentException(
                'Payment status must be either "Paid" or "In Progress"'
            );
        }

        $this->update([
            'status' => $status,
            'paid_at' => $status === self::STATUS_PAID ? now() : null,
        ]);

        // Also update the reservation payment status
        if ($this->reservation) {
            $this->reservation->update(['payment_status' => $status]);
        }
    }

    // Legacy methods for backward compatibility
    public function isCompleted()
    {
        return $this->isPaid();
    }

    public function isPending()
    {
        return $this->isInProgress();
    }

    public function isFailed()
    {
        // No longer supported in the new system
        return false;
    }
}
