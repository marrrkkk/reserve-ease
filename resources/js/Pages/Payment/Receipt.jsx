import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    CheckCircle,
    Download,
    Calendar,
    MapPin,
    Users,
    Clock,
    CreditCard,
    Receipt as ReceiptIcon,
    ArrowLeft,
    Printer,
} from "lucide-react";

export default function Receipt({ auth, payment }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentMethodDisplay = (method) => {
        const methods = {
            cash: "Cash Payment",
            gcash: "GCash",
        };
        return methods[method] || method;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        window.location.href = route("payment.receipt.download", payment.id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Payment Receipt
                    </h2>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </button>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Payment Receipt" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                            <div>
                                <h3 className="text-lg font-bold text-green-800">
                                    Payment Successful!
                                </h3>
                                <p className="text-green-700">
                                    Your reservation has been confirmed and
                                    payment has been processed successfully.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Receipt */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">
                                        ReserveEase
                                    </h1>
                                    <p className="text-blue-100">
                                        Event Reservation & Catering Services
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        RECEIPT
                                    </div>
                                    <div className="text-blue-100">
                                        #{payment.transaction_id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Payment Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                                        Payment Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Transaction ID:
                                            </span>
                                            <span className="font-mono text-slate-800">
                                                {payment.transaction_id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Reference Number:
                                            </span>
                                            <span className="font-mono text-slate-800">
                                                {payment.reference_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Payment Method:
                                            </span>
                                            <span className="text-slate-800">
                                                {getPaymentMethodDisplay(
                                                    payment.payment_method
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Payment Date:
                                            </span>
                                            <span className="text-slate-800">
                                                {formatDateTime(
                                                    payment.paid_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Status:
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                                        Customer Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Name:
                                            </span>
                                            <span className="text-slate-800">
                                                {payment.user.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Email:
                                            </span>
                                            <span className="text-slate-800">
                                                {payment.user.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Customer ID:
                                            </span>
                                            <span className="font-mono text-slate-800">
                                                #{payment.user.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reservation Details */}
                            <div className="border-t border-slate-200 pt-8 mb-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                    Reservation Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-slate-600">
                                                    Event Type
                                                </div>
                                                <div className="font-semibold text-slate-800 capitalize">
                                                    {
                                                        payment.reservation
                                                            .event_type
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-slate-600">
                                                    Event Date
                                                </div>
                                                <div className="font-semibold text-slate-800">
                                                    {formatDate(
                                                        payment.reservation
                                                            .event_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {payment.reservation.event_time && (
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-slate-400 mr-3" />
                                                <div>
                                                    <div className="text-sm text-slate-600">
                                                        Event Time
                                                    </div>
                                                    <div className="font-semibold text-slate-800">
                                                        {
                                                            payment.reservation
                                                                .event_time
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 text-slate-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-slate-600">
                                                    Venue
                                                </div>
                                                <div className="font-semibold text-slate-800">
                                                    {payment.reservation.venue}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-slate-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-slate-600">
                                                    Guest Count
                                                </div>
                                                <div className="font-semibold text-slate-800">
                                                    {
                                                        payment.reservation
                                                            .guest_count
                                                    }{" "}
                                                    guests
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="border-t border-slate-200 pt-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">
                                    Payment Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal:</span>
                                        <span>
                                            ₱
                                            {Number(
                                                payment.amount
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Processing Fee:</span>
                                        <span>₱0.00</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-slate-800">
                                            <span>Total Paid:</span>
                                            <span className="text-green-600">
                                                ₱
                                                {Number(
                                                    payment.amount
                                                ).toLocaleString("en-PH", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-200 pt-8 mt-8">
                                <div className="text-center text-sm text-slate-500">
                                    <p className="mb-2">
                                        Thank you for choosing ReserveEase!
                                    </p>
                                    <p>
                                        For questions about this receipt, please
                                        contact us at support@reserveease.com
                                    </p>
                                    <p className="mt-4 font-mono">
                                        Generated on{" "}
                                        {formatDateTime(new Date())}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route("reservations.index")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Reservations
                        </Link>
                        <Link
                            href={route("dashboard")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <ReceiptIcon className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
