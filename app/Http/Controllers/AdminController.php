<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Middleware is applied in routes (web.php) via AdminMiddleware

    public function index()
    {
        $total = Reservation::count();
        $approved = Reservation::where('status', 'approved')->count();
        $pending = Reservation::where('status', 'pending')->count();
        $recent = Reservation::with('user')->latest()->take(5)->get();

        // Analytics: Monthly reservations (last 6 months)
        $monthly = Reservation::selectRaw("strftime('%Y-%m', event_date) as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        // Analytics: Revenue (sum of total_amount for approved)
        $revenue = Reservation::where('status', 'approved')->sum('total_amount');

        // Analytics: Approval rate
        $approval_rate = $total > 0 ? round(($approved / $total) * 100, 1) : 0;

        // Analytics: Top event types
        $top_event_types = Reservation::selectRaw('event_type, COUNT(*) as count')
            ->groupBy('event_type')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Index', [
            'summary' => [
                'total' => $total,
                'approved' => $approved,
                'pending' => $pending,
                'revenue' => $revenue,
                'approval_rate' => $approval_rate,
            ],
            'recent_reservations' => $recent,
            'analytics' => [
                'monthly' => $monthly,
                'top_event_types' => $top_event_types,
            ],
        ]);
    }

    public function reservations()
    {
        $reservations = Reservation::with(['user', 'payments', 'receipts'])->latest()->get();
        $flash = session('success') ? ['success' => session('success')] : [];
        return Inertia::render('Admin/Reservations', [
            'reservations' => $reservations,
            'flash' => $flash,
        ]);
    }

    public function approve($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->status = 'approved';
        $reservation->save();
        // Create notification
        \App\Models\Notification::create([
            'user_id' => $reservation->user_id,
            'event_type' => $reservation->event_type,
            'event_date' => $reservation->event_date,
            'status' => 'approved',
            'message' => 'Your reservation has been approved.',
        ]);
        return redirect()->back()->with('success', 'Reservation approved.');
    }

    public function decline($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->status = 'declined';
        $reservation->save();
        // Create notification
        \App\Models\Notification::create([
            'user_id' => $reservation->user_id,
            'event_type' => $reservation->event_type,
            'event_date' => $reservation->event_date,
            'status' => 'declined',
            'message' => 'Your reservation has been declined.',
        ]);
        return redirect()->back()->with('success', 'Reservation declined.');
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        // Create notification before deleting
        \App\Models\Notification::create([
            'user_id' => $reservation->user_id,
            'event_type' => $reservation->event_type,
            'event_date' => $reservation->event_date,
            'status' => 'deleted',
            'message' => 'Your reservation has been deleted by admin.',
        ]);
        $reservation->delete();
        return redirect()->back()->with('success', 'Reservation deleted.');
    }

    public function analytics()
    {
        $total = Reservation::count();
        $approved = Reservation::where('status', 'approved')->count();
        $pending = Reservation::where('status', 'pending')->count();
        $recent = Reservation::with('user')->latest()->take(5)->get();
        $monthly = Reservation::selectRaw("strftime('%Y-%m', event_date) as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();
        $revenue = Reservation::where('status', 'approved')->sum('total_amount');
        $approval_rate = $total > 0 ? round(($approved / $total) * 100, 1) : 0;
        $top_event_types = Reservation::selectRaw('event_type, COUNT(*) as count')
            ->groupBy('event_type')
            ->orderByDesc('count')
            ->limit(5)
            ->get();
        return Inertia::render('Admin/Analytics', [
            'summary' => [
                'total' => $total,
                'approved' => $approved,
                'pending' => $pending,
                'revenue' => $revenue,
                'approval_rate' => $approval_rate,
            ],
            'analytics' => [
                'monthly' => $monthly,
                'top_event_types' => $top_event_types,
            ],
        ]);
    }

    public function payments()
    {
        $payments = Payment::with(['reservation', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
        ]);
    }
}
