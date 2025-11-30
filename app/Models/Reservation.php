<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'package_id',
        'customer_full_name',
        'customer_address',
        'customer_contact_number',
        'customer_email',
        'event_type',
        'event_date',
        'event_time',
        'venue',
        'guest_count',
        'customization',
        'status',
        'payment_status',
        'total_amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment()
    {
        return $this->hasOne(Payment::class)->latest();
    }

    public function customizationDetails()
    {
        return $this->hasOne(PackageCustomization::class);
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }

    public function getFormattedTotalAmountAttribute()
    {
        return '₱' . number_format($this->total_amount, 2);
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid' || $this->payments()->where('status', 'completed')->exists();
    }

    public function isPaymentPending()
    {
        return $this->payment_status === 'pending';
    }

    public function markAsPaid()
    {
        $this->update(['payment_status' => 'paid']);
    }
}
