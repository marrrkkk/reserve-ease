<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }

        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }

        .receipt-header {
            background: #2563eb;
            color: white;
            padding: 30px;
            text-align: center;
        }

        .receipt-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }

        .receipt-header p {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }

        .receipt-body {
            padding: 30px;
        }

        .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .info-section {
            flex: 1;
            min-width: 250px;
            margin-bottom: 20px;
        }

        .info-section h3 {
            margin: 0 0 10px 0;
            color: #2563eb;
            font-size: 16px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .info-section p {
            margin: 5px 0;
            font-size: 14px;
        }

        .payment-details {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }

        .payment-details h3 {
            margin: 0 0 15px 0;
            color: #2563eb;
            font-size: 18px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #059669;
        }

        .detail-label {
            font-weight: 500;
        }

        .detail-value {
            font-weight: 600;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-completed {
            background: #d1fae5;
            color: #065f46;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-failed {
            background: #fee2e2;
            color: #991b1b;
        }

        .receipt-footer {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }

        .thank-you {
            font-size: 18px;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 10px;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }

            .receipt-container {
                border: none;
                border-radius: 0;
                box-shadow: none;
            }
        }
    </style>
</head>

<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <h1>Payment Receipt</h1>
            <p>Thank you for your payment</p>
        </div>

        <div class="receipt-body">
            <div class="receipt-info">
                <div class="info-section">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {{ $payment->user->name }}</p>
                    <p><strong>Email:</strong> {{ $payment->user->email }}</p>
                    <p><strong>Receipt Date:</strong> {{ $payment->created_at->format('F j, Y') }}</p>
                </div>

                <div class="info-section">
                    <h3>Transaction Details</h3>
                    <p><strong>Transaction ID:</strong> {{ $payment->transaction_id }}</p>
                    <p><strong>Reference Number:</strong> {{ $payment->reference_number }}</p>
                    <p><strong>Payment Method:</strong> {{ ucwords(str_replace('_', ' ', $payment->payment_method)) }}
                    </p>
                    <p><strong>Status:</strong>
                        <span class="status-badge status-{{ $payment->status }}">
                            {{ ucfirst($payment->status) }}
                        </span>
                    </p>
                </div>
            </div>

            <div class="payment-details">
                <h3>Reservation Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Event Type:</span>
                    <span class="detail-value">{{ ucfirst($payment->reservation->event_type) }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event Date:</span>
                    <span
                        class="detail-value">{{ \Carbon\Carbon::parse($payment->reservation->event_date)->format('F j, Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event Time:</span>
                    <span
                        class="detail-value">{{ \Carbon\Carbon::parse($payment->reservation->event_time)->format('g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Venue:</span>
                    <span class="detail-value">{{ $payment->reservation->venue }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guest Count:</span>
                    <span class="detail-value">{{ $payment->reservation->guest_count }} guests</span>
                </div>
                @if ($payment->reservation->customization)
                    <div class="detail-row">
                        <span class="detail-label">Customization:</span>
                        <span class="detail-value">{{ $payment->reservation->customization }}</span>
                    </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">₱{{ number_format($payment->amount, 2) }}</span>
                </div>
            </div>

            @if ($payment->payment_details)
                <div class="payment-details">
                    <h3>Payment Information</h3>
                    @if (isset($payment->payment_details['mobile_number']))
                        <div class="detail-row">
                            <span class="detail-label">GCash Mobile Number:</span>
                            <span class="detail-value">{{ $payment->payment_details['mobile_number'] }}</span>
                        </div>
                    @endif
                    @if (isset($payment->payment_details['gcash_reference']))
                        <div class="detail-row">
                            <span class="detail-label">GCash Reference:</span>
                            <span class="detail-value">{{ $payment->payment_details['gcash_reference'] }}</span>
                        </div>
                    @endif
                    @if (isset($payment->payment_details['payment_note']))
                        <div class="detail-row">
                            <span class="detail-label">Payment Note:</span>
                            <span class="detail-value">{{ $payment->payment_details['payment_note'] }}</span>
                        </div>
                    @endif
                    @if (isset($payment->payment_details['processed_at']))
                        <div class="detail-row">
                            <span class="detail-label">Processed At:</span>
                            <span
                                class="detail-value">{{ \Carbon\Carbon::parse($payment->payment_details['processed_at'])->format('F j, Y g:i A') }}</span>
                        </div>
                    @else
                        <div class="detail-row">
                            <span class="detail-label">Processed At:</span>
                            <span
                                class="detail-value">{{ $payment->paid_at ? $payment->paid_at->format('F j, Y g:i A') : $payment->created_at->format('F j, Y g:i A') }}</span>
                        </div>
                    @endif
                </div>
            @endif
        </div>

        <div class="receipt-footer">
            <div class="thank-you">Thank you for choosing our services!</div>
            <p>This is an official receipt for your payment. Please keep this for your records.</p>
            <p>For any questions or concerns, please contact our support team.</p>
            <p>Generated on {{ now()->format('F j, Y g:i A') }}</p>
        </div>
    </div>
</body>

</html>
