<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_type'     => 'required|string|max:255',
            'event_date'     => 'required|date|after:today',
            'event_time'     => 'nullable|date_format:H:i',
            'venue'          => 'required|string|max:255',
            'guest_count'    => 'required|integer|min:1',
            'customization'  => 'nullable|string',
            'total_amount'   => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        if (!$user) {
            abort(403); // or redirect
        }

        $validated['user_id'] = $user->id;
        $validated['status'] = 'pending';

        $reservation = Reservation::create($validated);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Reservation submitted successfully!');
    }

    public function userReservations()
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        $reservations = Reservation::where('user_id', $user->id)->latest()->get();
        return Inertia::render('Reservation/Index', ['reservations' => $reservations]);
    }
}
