import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    CreditCard,
    Calendar,
    MapPin,
    Users,
    Clock,
    Shield,
    CheckCircle,
} from "lucide-react";
import PaymentMethodSelector from "@/Components/PaymentMethodSelector";
import ReceiptUpload from "@/Components/ReceiptUpload";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export default function PaymentShow({
    auth,
    reservation,
    paymentMethods,
    payment,
    flash,
}) {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [showReceiptUpload, setShowReceiptUpload] = useState(!!payment);
    const [createdPayment, setCreatedPayment] = useState(payment || null);

    const { data, setData, post, processing, errors } = useForm({
        payment_method: "",
        mobile_number: "",
        reference_number: "",
    });

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        setData("payment_method", method);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(route("payment.store", reservation.id), {
            preserveScroll: true,
            onSuccess: () => {
                // The page will be re-rendered with payment data
                // The payment prop will be set, which will show the receipt upload
            },
        });
    };

    const handleReceiptUploadSuccess = () => {
        // Redirect to reservations page after successful receipt upload
        window.location.href = route("reservations.index");
    };

    const formatPHPCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
        })}`;
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-blue-700 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    Payment
                </h2>
            }
        >
            <Head title="Payment" />

            <div className="py-8">
                {/* Success Message */}
                {flash?.success && (
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 mb-4">
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {flash.success}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {flash?.error && (
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 mb-4">
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            {flash.error}
                        </div>
                    </div>
                )}
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Reservation Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                                Reservation Summary
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600">
                                        Event Type
                                    </span>
                                    <span className="font-semibold text-slate-800 capitalize">
                                        {reservation.event_type}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Date
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {formatDate(reservation.event_date)}
                                    </span>
                                </div>

                                {reservation.event_time && (
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                        <span className="text-slate-600 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Time
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {reservation.event_time}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Venue
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {reservation.venue}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-slate-600 flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Guests
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {reservation.guest_count}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-4 bg-amber-50 rounded-lg px-4 mt-6">
                                    <span className="text-lg font-bold text-slate-800">
                                        Total Amount
                                    </span>
                                    <span className="text-2xl font-bold text-amber-600">
                                        ₱
                                        {Number(
                                            reservation.total_amount
                                        ).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <Shield className="w-6 h-6 text-green-600 mr-2" />
                                Secure Payment
                            </h3>

                            {!showReceiptUpload ? (
                                <form
                                    onSubmit={handlePaymentSubmit}
                                    className="space-y-6"
                                >
                                    {/* Payment Method Selection */}
                                    <PaymentMethodSelector
                                        paymentMethods={paymentMethods}
                                        selectedMethod={selectedMethod}
                                        onMethodSelect={handleMethodSelect}
                                        error={errors.payment_method}
                                    />

                                    {/* GCash Additional Fields */}
                                    {selectedMethod === "gcash" && (
                                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Your GCash Mobile Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.mobile_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "mobile_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="09XX XXX XXXX"
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.mobile_number
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    GCash Reference Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.reference_number
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "reference_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter 13-digit reference number"
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.reference_number
                                                    }
                                                    className="mt-1"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">
                                                    You can find this in your
                                                    GCash transaction history
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bank Transfer Additional Fields */}
                                    {selectedMethod === "bank_transfer" && (
                                        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Bank Reference Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.reference_number
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "reference_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter bank reference number"
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.reference_number
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <PrimaryButton
                                        type="submit"
                                        disabled={!selectedMethod || processing}
                                        className="w-full justify-center py-4"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5 mr-2" />
                                                Pay{" "}
                                                {formatPHPCurrency(
                                                    reservation.total_amount
                                                )}
                                            </>
                                        )}
                                    </PrimaryButton>
                                </form>
                            ) : (
                                <ReceiptUpload
                                    payment={createdPayment}
                                    onSuccess={handleReceiptUploadSuccess}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
