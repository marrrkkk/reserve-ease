<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    public function show(Reservation $reservation)
    {
        // Ensure user can only view their own reservation payments
        if ($reservation->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $reservation->load(['payments', 'user']);

        // Check if there's an existing payment in progress
        $existingPayment = $reservation->payments()
            ->where('status', Payment::STATUS_IN_PROGRESS)
            ->latest()
            ->first();

        return Inertia::render('Payment/Show', [
            'reservation' => $reservation,
            'paymentMethods' => $this->getPaymentMethods(),
            'payment' => $existingPayment,
        ]);
    }

    public function store(Request $request, Reservation $reservation)
    {
        // Ensure user can only pay for their own reservations
        if ($reservation->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Check if there's already a payment for this reservation
        $existingPayment = $reservation->payments()
            ->whereIn('status', [Payment::STATUS_PAID, Payment::STATUS_IN_PROGRESS])
            ->first();

        if ($existingPayment) {
            return redirect()->back()
                ->with('error', 'A payment already exists for this reservation.');
        }

        $request->validate([
            'payment_method' => 'required|string|in:cash,gcash,bank_transfer',
            'mobile_number' => 'required_if:payment_method,gcash|nullable|string',
            'reference_number' => 'required_if:payment_method,gcash,bank_transfer|nullable|string',
        ]);

        // Mock payment processing
        $paymentResult = $this->processPayment($request, $reservation);

        // Map old status to new status constants
        $status = $paymentResult['status'] === 'completed' ? Payment::STATUS_PAID : Payment::STATUS_IN_PROGRESS;

        $payment = Payment::create([
            'reservation_id' => $reservation->id,
            'user_id' => auth()->id(),
            'payment_method' => $request->payment_method,
            'amount' => $reservation->total_amount,
            'currency' => 'PHP',
            'status' => $status,
            'transaction_id' => $paymentResult['transaction_id'],
            'reference_number' => $paymentResult['reference_number'],
            'payment_details' => $paymentResult['details'],
            'paid_at' => $status === Payment::STATUS_PAID ? now() : null,
        ]);

        // Update reservation payment status
        $reservation->update([
            'payment_status' => $status
        ]);

        if ($payment->isPaid()) {
            // For cash payments that are immediately marked as paid, redirect to receipt
            return redirect()->route('payment.receipt', $payment)
                ->with('success', 'Payment completed successfully!');
        }

        // For In Progress payments (gcash, bank_transfer), stay on payment page
        // Return Inertia response with payment data for receipt upload
        return Inertia::render('Payment/Show', [
            'reservation' => $reservation->load(['payments', 'user']),
            'paymentMethods' => $this->getPaymentMethods(),
            'payment' => $payment,
            'flash' => [
                'success' => 'Payment method recorded. Please upload your receipt.'
            ]
        ]);
    }

    public function receipt(Payment $payment)
    {
        // Ensure user can only view their own payment receipts
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $payment->load(['reservation', 'user']);

        return Inertia::render('Payment/Receipt', [
            'payment' => $payment,
        ]);
    }

    public function downloadReceipt(Payment $payment)
    {
        // Ensure user can only download their own payment receipts
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $payment->load(['reservation', 'user']);

        // Generate PDF
        $pdf = Pdf::loadView('receipts.payment-receipt', compact('payment'));

        // Set paper size and orientation
        $pdf->setPaper('a4', 'portrait');

        // Generate filename
        $filename = 'receipt-' . $payment->reference_number . '-' . $payment->created_at->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    public function adminReceipt(Payment $payment)
    {
        $payment->load(['reservation', 'user']);

        return Inertia::render('Payment/Receipt', [
            'payment' => $payment,
            'isAdmin' => true,
        ]);
    }

    public function adminDownloadReceipt(Payment $payment)
    {
        $payment->load(['reservation', 'user']);

        // Generate PDF
        $pdf = Pdf::loadView('receipts.payment-receipt', compact('payment'));

        // Set paper size and orientation
        $pdf->setPaper('a4', 'portrait');

        // Generate filename
        $filename = 'receipt-' . $payment->reference_number . '-' . $payment->created_at->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    public function uploadReceipt(Request $request, Payment $payment)
    {
        // Ensure user can only upload receipts for their own payments
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Validate the uploaded file
        $request->validate([
            'receipt_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        // Get the uploaded file
        $file = $request->file('receipt_file');

        // Generate a unique filename
        $fileName = 'receipt_' . $payment->id . '_' . time() . '.' . $file->getClientOriginalExtension();

        // Store the file in storage/app/receipts
        $filePath = $file->storeAs('receipts', $fileName);

        // Create the Receipt record
        $receipt = Receipt::create([
            'payment_id' => $payment->id,
            'reservation_id' => $payment->reservation_id,
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'uploaded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Receipt uploaded successfully!');
    }

    public function viewReceipt(Receipt $receipt)
    {
        // Authorization check: user can view their own receipts or admin can view all
        $canView = auth()->user()->is_admin ||
            $receipt->reservation->user_id === auth()->id();

        if (!$canView) {
            abort(403, 'Unauthorized');
        }

        // Check if file exists
        if (!$receipt->fileExists()) {
            abort(404, 'Receipt file not found');
        }

        // Return the file for viewing
        return Storage::response($receipt->file_path);
    }

    public function downloadReceiptFile(Receipt $receipt)
    {
        // Authorization check: user can download their own receipts or admin can download all
        $canDownload = auth()->user()->is_admin ||
            $receipt->reservation->user_id === auth()->id();

        if (!$canDownload) {
            abort(403, 'Unauthorized');
        }

        // Check if file exists
        if (!$receipt->fileExists()) {
            abort(404, 'Receipt file not found');
        }

        // Return the file for download
        return Storage::download($receipt->file_path, $receipt->file_name);
    }

    private function processPayment(Request $request, Reservation $reservation)
    {
        // Mock payment processing - in real implementation, integrate with payment gateway
        $transactionId = 'TXN_' . strtoupper(Str::random(10));

        // For GCash, use the provided reference number, otherwise generate one
        $referenceNumber = $request->payment_method === 'gcash' && $request->reference_number
            ? $request->reference_number
            : 'REF_' . strtoupper(Str::random(8));

        // Cash payments are immediately completed
        // GCash and bank transfer require receipt upload, so they start as "In Progress"
        $isSuccess = $request->payment_method === 'cash';

        $details = [
            'payment_method' => $request->payment_method,
            'processed_at' => now()->toISOString(),
        ];

        if ($request->payment_method === 'gcash') {
            $details['mobile_number'] = $request->mobile_number;
            $details['gcash_reference'] = $request->reference_number;
        } elseif ($request->payment_method === 'cash') {
            $details['payment_note'] = 'Cash payment to be collected at venue';
        }

        return [
            'status' => $isSuccess ? 'completed' : 'failed',
            'transaction_id' => $transactionId,
            'reference_number' => $referenceNumber,
            'details' => $details,
        ];
    }

    private function getPaymentMethods()
    {
        return [
            'cash' => [
                'name' => 'Cash Payment',
                'icon' => 'wallet',
                'description' => 'Pay in cash at the venue',
                'details' => 'Payment will be collected at the venue on the event date.',
            ],
            'gcash' => [
                'name' => 'GCash',
                'icon' => 'smartphone',
                'description' => 'Pay using GCash mobile wallet',
                'details' => 'Send payment to GCash number: 0982 726 5178',
                'account_number' => '0982 726 5178',
            ],
            'bank_transfer' => [
                'name' => 'Bank Transfer',
                'icon' => 'bank',
                'description' => 'Pay via bank transfer',
                'details' => 'Transfer to our bank account and upload the receipt.',
            ],
        ];
    }
}
