<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RevenueService
{
  /**
   * Calculate total revenue from paid reservations only
   * 
   * @param string|null $startDate Start date for filtering (Y-m-d format)
   * @param string|null $endDate End date for filtering (Y-m-d format)
   * @return float Total revenue amount
   */
  public function calculateTotalRevenue($startDate = null, $endDate = null)
  {
    $query = Payment::where('status', Payment::STATUS_PAID);

    if ($startDate) {
      $query->whereDate('paid_at', '>=', $startDate);
    }

    if ($endDate) {
      $query->whereDate('paid_at', '<=', $endDate);
    }

    return (float) $query->sum('amount');
  }

  /**
   * Get revenue data grouped by time period
   * 
   * @param string $period Period type: 'daily', 'weekly', 'monthly', 'yearly'
   * @param string|null $startDate Start date for filtering (Y-m-d format)
   * @param string|null $endDate End date for filtering (Y-m-d format)
   * @return array Revenue data grouped by period
   */
  public function getRevenueByPeriod($period, $startDate = null, $endDate = null)
  {
    $query = Payment::where('status', Payment::STATUS_PAID);

    if ($startDate) {
      $query->whereDate('paid_at', '>=', $startDate);
    }

    if ($endDate) {
      $query->whereDate('paid_at', '<=', $endDate);
    }

    // Detect database driver for compatibility
    $driver = DB::connection()->getDriverName();
    $isMySQL = in_array($driver, ['mysql', 'mariadb']);

    switch ($period) {
      case 'daily':
        return $query
          ->select(
            DB::raw('DATE(paid_at) as period'),
            DB::raw('SUM(amount) as revenue'),
            DB::raw('COUNT(*) as payment_count')
          )
          ->groupBy('period')
          ->orderBy('period')
          ->get()
          ->map(function ($item) {
            return [
              'period' => $item->period,
              'revenue' => (float) $item->revenue,
              'payment_count' => $item->payment_count,
            ];
          })
          ->toArray();

      case 'weekly':
        if ($isMySQL) {
          return $query
            ->select(
              DB::raw('YEAR(paid_at) as year'),
              DB::raw('WEEK(paid_at) as week'),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year', 'week')
            ->orderBy('year')
            ->orderBy('week')
            ->get()
            ->map(function ($item) {
              return [
                'period' => $item->year . '-W' . str_pad($item->week, 2, '0', STR_PAD_LEFT),
                'year' => $item->year,
                'week' => $item->week,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        } else {
          // SQLite: Use strftime
          return $query
            ->select(
              DB::raw("strftime('%Y', paid_at) as year"),
              DB::raw("strftime('%W', paid_at) as week"),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year', 'week')
            ->orderBy('year')
            ->orderBy('week')
            ->get()
            ->map(function ($item) {
              return [
                'period' => $item->year . '-W' . str_pad($item->week, 2, '0', STR_PAD_LEFT),
                'year' => (int) $item->year,
                'week' => (int) $item->week,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        }

      case 'monthly':
        if ($isMySQL) {
          return $query
            ->select(
              DB::raw('YEAR(paid_at) as year'),
              DB::raw('MONTH(paid_at) as month'),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
              return [
                'period' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                'year' => $item->year,
                'month' => $item->month,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        } else {
          // SQLite: Use strftime
          return $query
            ->select(
              DB::raw("strftime('%Y', paid_at) as year"),
              DB::raw("strftime('%m', paid_at) as month"),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
              return [
                'period' => $item->year . '-' . $item->month,
                'year' => (int) $item->year,
                'month' => (int) $item->month,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        }

      case 'yearly':
        if ($isMySQL) {
          return $query
            ->select(
              DB::raw('YEAR(paid_at) as year'),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year')
            ->orderBy('year')
            ->get()
            ->map(function ($item) {
              return [
                'period' => (string) $item->year,
                'year' => $item->year,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        } else {
          // SQLite: Use strftime
          return $query
            ->select(
              DB::raw("strftime('%Y', paid_at) as year"),
              DB::raw('SUM(amount) as revenue'),
              DB::raw('COUNT(*) as payment_count')
            )
            ->groupBy('year')
            ->orderBy('year')
            ->get()
            ->map(function ($item) {
              return [
                'period' => $item->year,
                'year' => (int) $item->year,
                'revenue' => (float) $item->revenue,
                'payment_count' => $item->payment_count,
              ];
            })
            ->toArray();
        }

      default:
        throw new \InvalidArgumentException(
          'Invalid period. Must be one of: daily, weekly, monthly, yearly'
        );
    }
  }

  /**
   * Get revenue breakdown by payment method
   * 
   * @param string|null $startDate Start date for filtering (Y-m-d format)
   * @param string|null $endDate End date for filtering (Y-m-d format)
   * @return array Revenue data grouped by payment method
   */
  public function getRevenueByPaymentMethod($startDate = null, $endDate = null)
  {
    $query = Payment::where('status', Payment::STATUS_PAID);

    if ($startDate) {
      $query->whereDate('paid_at', '>=', $startDate);
    }

    if ($endDate) {
      $query->whereDate('paid_at', '<=', $endDate);
    }

    return $query
      ->select(
        'payment_method',
        DB::raw('SUM(amount) as revenue'),
        DB::raw('COUNT(*) as payment_count')
      )
      ->groupBy('payment_method')
      ->orderBy('revenue', 'desc')
      ->get()
      ->map(function ($item) {
        return [
          'payment_method' => $item->payment_method,
          'revenue' => (float) $item->revenue,
          'payment_count' => $item->payment_count,
        ];
      })
      ->toArray();
  }

  /**
   * Get all paid reservations with their payment details
   * 
   * @param string|null $startDate Start date for filtering (Y-m-d format)
   * @param string|null $endDate End date for filtering (Y-m-d format)
   * @return \Illuminate\Database\Eloquent\Collection Collection of reservations
   */
  public function getPaidReservations($startDate = null, $endDate = null)
  {
    $query = Reservation::whereHas('payments', function ($q) {
      $q->where('status', Payment::STATUS_PAID);
    })->with(['payments' => function ($q) {
      $q->where('status', Payment::STATUS_PAID);
    }, 'package', 'user']);

    if ($startDate) {
      $query->whereDate('event_date', '>=', $startDate);
    }

    if ($endDate) {
      $query->whereDate('event_date', '<=', $endDate);
    }

    return $query->get();
  }
}
