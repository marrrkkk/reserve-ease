<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_type',
        'event_date',
        'event_time',
        'venue',
        'guest_count',
        'customization',
        'status',
        'total_amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
