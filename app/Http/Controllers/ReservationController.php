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
            'package_id'                => 'required|exists:packages,id',
            'customer_full_name'        => 'required|string|max:255',
            'customer_address'          => 'required|string|max:1000',
            'customer_contact_number'   => 'required|string|regex:/^[0-9]{10,15}$/',
            'customer_email'            => 'required|email|max:255',
            'event_type'                => 'required|string|max:255',
            'event_date'                => 'required|date|after:today',
            'event_time'                => 'nullable|date_format:H:i',
            'venue'                     => 'required|string|max:255',
            'guest_count'               => 'required|integer|min:1',
            'customization'             => 'nullable|string',
            'total_amount'              => 'nullable|numeric|min:0',
            'selected_table_type'       => 'required|string',
            'selected_chair_type'       => 'required|string',
            'selected_foods'            => 'required|array',
            'selected_foods.*.name'     => 'required|string',
            'selected_foods.*.price'    => 'required|numeric|min:0',
            'customization_notes'       => 'nullable|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Validate budget constraint
        $package = \App\Models\Package::findOrFail($validated['package_id']);
        $totalFoodCost = collect($validated['selected_foods'])->sum('price');

        if ($totalFoodCost > $package->base_price) {
            return back()->withErrors([
                'selected_foods' => 'The total food cost exceeds the package price by ₱' . number_format($totalFoodCost - $package->base_price, 2)
            ])->withInput();
        }

        // Create reservation
        $reservationData = [
            'user_id'                   => $user->id,
            'package_id'                => $validated['package_id'],
            'customer_full_name'        => $validated['customer_full_name'],
            'customer_address'          => $validated['customer_address'],
            'customer_contact_number'   => $validated['customer_contact_number'],
            'customer_email'            => $validated['customer_email'],
            'event_type'                => $validated['event_type'],
            'event_date'                => $validated['event_date'],
            'event_time'                => $validated['event_time'] ?? null,
            'venue'                     => $validated['venue'],
            'guest_count'               => $validated['guest_count'],
            'customization'             => $validated['customization'] ?? null,
            'total_amount'              => $validated['total_amount'] ?? $package->base_price,
            'status'                    => 'pending',
            'payment_status'            => 'In Progress',
        ];

        $reservation = Reservation::create($reservationData);

        // Create associated PackageCustomization record
        $reservation->customizationDetails()->create([
            'selected_table_type'   => $validated['selected_table_type'],
            'selected_chair_type'   => $validated['selected_chair_type'],
            'selected_foods'        => $validated['selected_foods'],
            'customization_notes'   => $validated['customization_notes'] ?? null,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Reservation submitted successfully!');
    }

    public function show(Reservation $reservation)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Ensure user can only view their own reservations (unless admin)
        if ($reservation->user_id !== $user->id && !$user->is_admin) {
            abort(403, 'Unauthorized access to reservation');
        }

        // Eager load all required relationships
        $reservation->load([
            'package',
            'customizationDetails',
            'payments',
            'receipts'
        ]);

        return Inertia::render('Reservation/Show', [
            'reservation' => $reservation
        ]);
    }

    public function userReservations()
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Ensure only user's own reservations are returned with eager loaded relationships
        $reservations = Reservation::with([
            'package',
            'customizationDetails',
            'latestPayment',
            'payments',
            'receipts'
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Reservation/Index', ['reservations' => $reservations]);
    }
}
