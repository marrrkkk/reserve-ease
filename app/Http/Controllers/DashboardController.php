<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect admin users to admin dashboard
        if ($user->is_admin) {
            return redirect()->route('admin');
        }

        // Regular user dashboard logic - load with payment status
        $reservations = Reservation::with('latestPayment')
            ->where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'reservation' => $reservations,
        ]);
    }

    public function userReservations()
    {
        $user = Auth::user();
        $reservations = Reservation::with('latestPayment')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
        return response()->json($reservations);
    }

    public function notifications()
    {
        $user = Auth::user();
        $notifications = $user->notifications()->latest()->take(10)->get();
        return response()->json($notifications);
    }
}
