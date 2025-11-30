<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Payment;
use App\Services\RevenueService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
  protected $revenueService;

  public function __construct(RevenueService $revenueService)
  {
    $this->revenueService = $revenueService;
    // Middleware is applied in routes (web.php) via AdminMiddleware
  }

  /**
   * Display the main analytics dashboard
   * Requirements: 7.1
   */
  public function index(Request $request)
  {
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    // Get booking summary
    $bookingSummary = $this->bookingSummary($startDate, $endDate);

    // Get revenue data
    $totalRevenue = $this->revenueService->calculateTotalRevenue($startDate, $endDate);
    $revenueByMethod = $this->revenueService->getRevenueByPaymentMethod($startDate, $endDate);
    $revenueByPeriod = $this->revenueService->getRevenueByPeriod('monthly', $startDate, $endDate);

    // Get recent paid reservations
    $recentPaidReservations = $this->revenueService->getPaidReservations($startDate, $endDate)
      ->take(10);

    return Inertia::render('Admin/Analytics', [
      'summary' => $bookingSummary,
      'revenue' => [
        'total' => $totalRevenue,
        'by_method' => $revenueByMethod,
        'by_period' => $revenueByPeriod,
      ],
      'recent_paid_reservations' => $recentPaidReservations,
      'filters' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
      ],
    ]);
  }

  /**
   * Get booking summary with counts and grouping
   * Requirements: 7.3
   */
  public function bookingSummary($startDate = null, $endDate = null)
  {
    $query = Reservation::query();

    if ($startDate) {
      $query->whereDate('event_date', '>=', $startDate);
    }

    if ($endDate) {
      $query->whereDate('event_date', '<=', $endDate);
    }

    // Total bookings
    $totalBookings = $query->count();

    // Bookings by status
    $bookingsByStatus = (clone $query)
      ->select('status', DB::raw('COUNT(*) as count'))
      ->groupBy('status')
      ->get()
      ->pluck('count', 'status')
      ->toArray();

    // Bookings by payment status
    $bookingsByPaymentStatus = (clone $query)
      ->select('payment_status', DB::raw('COUNT(*) as count'))
      ->groupBy('payment_status')
      ->get()
      ->pluck('count', 'payment_status')
      ->toArray();

    // Bookings by event type
    $bookingsByEventType = (clone $query)
      ->select('event_type', DB::raw('COUNT(*) as count'))
      ->groupBy('event_type')
      ->orderByDesc('count')
      ->get()
      ->map(function ($item) {
        return [
          'event_type' => $item->event_type,
          'count' => $item->count,
        ];
      })
      ->toArray();

    // Bookings by time period (last 6 months)
    $driver = DB::connection()->getDriverName();
    $isMySQL = in_array($driver, ['mysql', 'mariadb']);

    if ($isMySQL) {
      $bookingsByMonth = (clone $query)
        ->select(
          DB::raw('YEAR(event_date) as year'),
          DB::raw('MONTH(event_date) as month'),
          DB::raw('COUNT(*) as count')
        )
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->limit(6)
        ->get()
        ->map(function ($item) {
          return [
            'period' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
            'year' => $item->year,
            'month' => $item->month,
            'count' => $item->count,
          ];
        })
        ->toArray();
    } else {
      // SQLite
      $bookingsByMonth = (clone $query)
        ->select(
          DB::raw("strftime('%Y', event_date) as year"),
          DB::raw("strftime('%m', event_date) as month"),
          DB::raw('COUNT(*) as count')
        )
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->limit(6)
        ->get()
        ->map(function ($item) {
          return [
            'period' => $item->year . '-' . $item->month,
            'year' => (int) $item->year,
            'month' => (int) $item->month,
            'count' => $item->count,
          ];
        })
        ->toArray();
    }

    return [
      'total_bookings' => $totalBookings,
      'by_status' => $bookingsByStatus,
      'by_payment_status' => $bookingsByPaymentStatus,
      'by_event_type' => $bookingsByEventType,
      'by_month' => $bookingsByMonth,
    ];
  }

  /**
   * Get monthly report for a specific year and month
   * Requirements: 7.4
   */
  public function monthlyReport($year, $month)
  {
    // Validate inputs
    if (!is_numeric($year) || !is_numeric($month) || $month < 1 || $month > 12) {
      return response()->json(['error' => 'Invalid year or month'], 400);
    }

    $driver = DB::connection()->getDriverName();
    $isMySQL = in_array($driver, ['mysql', 'mariadb']);

    // Get reservations for the specified month
    if ($isMySQL) {
      $reservations = Reservation::whereRaw('YEAR(event_date) = ?', [$year])
        ->whereRaw('MONTH(event_date) = ?', [$month])
        ->with(['package', 'payments', 'user'])
        ->get();
    } else {
      // SQLite
      $reservations = Reservation::whereRaw("strftime('%Y', event_date) = ?", [(string) $year])
        ->whereRaw("strftime('%m', event_date) = ?", [str_pad($month, 2, '0', STR_PAD_LEFT)])
        ->with(['package', 'payments', 'user'])
        ->get();
    }

    // Calculate statistics
    $totalBookings = $reservations->count();
    $totalRevenue = $reservations->filter(function ($reservation) {
      return $reservation->payment_status === Payment::STATUS_PAID;
    })->sum('total_amount');

    $bookingsByStatus = $reservations->groupBy('status')->map(function ($group) {
      return $group->count();
    })->toArray();

    $bookingsByPaymentStatus = $reservations->groupBy('payment_status')->map(function ($group) {
      return $group->count();
    })->toArray();

    return response()->json([
      'year' => (int) $year,
      'month' => (int) $month,
      'period' => $year . '-' . str_pad($month, 2, '0', STR_PAD_LEFT),
      'total_bookings' => $totalBookings,
      'total_revenue' => (float) $totalRevenue,
      'by_status' => $bookingsByStatus,
      'by_payment_status' => $bookingsByPaymentStatus,
      'reservations' => $reservations,
    ]);
  }

  /**
   * Get revenue chart data for a specific period
   * Requirements: 7.5
   */
  public function revenueChart($period, Request $request)
  {
    $validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];

    if (!in_array($period, $validPeriods)) {
      return response()->json(['error' => 'Invalid period. Must be one of: daily, weekly, monthly, yearly'], 400);
    }

    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    $revenueData = $this->revenueService->getRevenueByPeriod($period, $startDate, $endDate);

    return response()->json([
      'period' => $period,
      'data' => $revenueData,
      'filters' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
      ],
    ]);
  }

  /**
   * Generate printable report
   * Requirements: 7.2
   */
  public function printReport(Request $request)
  {
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    // Get comprehensive data for the report
    $bookingSummary = $this->bookingSummary($startDate, $endDate);
    $totalRevenue = $this->revenueService->calculateTotalRevenue($startDate, $endDate);
    $revenueByMethod = $this->revenueService->getRevenueByPaymentMethod($startDate, $endDate);
    $revenueByMonth = $this->revenueService->getRevenueByPeriod('monthly', $startDate, $endDate);

    // Get all paid reservations for detailed listing
    $paidReservations = $this->revenueService->getPaidReservations($startDate, $endDate);

    return Inertia::render('Admin/AnalyticsPrint', [
      'summary' => $bookingSummary,
      'revenue' => [
        'total' => $totalRevenue,
        'by_method' => $revenueByMethod,
        'by_month' => $revenueByMonth,
      ],
      'paid_reservations' => $paidReservations,
      'filters' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
      ],
      'generated_at' => now()->format('Y-m-d H:i:s'),
    ]);
  }
}
