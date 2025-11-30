import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Wallet,
    Smartphone,
    Shield,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import InputError from "./InputError";

export default function PaymentForm({
    reservation,
    paymentMethods,
    onSuccess,
}) {
    const [selectedMethod, setSelectedMethod] = useState("");
    const { data, setData, post, processing, errors } = useForm({
        payment_method: "",
        mobile_number: "",
        reference_number: "",
    });

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        setData("payment_method", method);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("payment.store", reservation.id), {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case "cash":
                return Wallet;
            case "gcash":
                return Smartphone;
            default:
                return Wallet;
        }
    };

    const formatPHPCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
        })}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                Secure Payment
            </h3>

            {/* Amount Display */}
            <div className="flex items-center justify-between py-4 bg-amber-50 rounded-lg px-4 mb-6">
                <span className="text-lg font-bold text-slate-800">
                    Total Amount
                </span>
                <span className="text-2xl font-bold text-amber-600">
                    {formatPHPCurrency(reservation.total_amount)}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Choose Payment Method
                    </label>
                    <div className="space-y-3">
                        {/* Cash Payment Option */}
                        {paymentMethods?.cash && (
                            <div
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedMethod === "cash"
                                        ? "border-green-500 bg-green-50"
                                        : "border-slate-200 hover:border-green-300"
                                }`}
                                onClick={() => handleMethodSelect("cash")}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cash"
                                        checked={selectedMethod === "cash"}
                                        onChange={() =>
                                            handleMethodSelect("cash")
                                        }
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <Wallet className="w-6 h-6 text-green-600 ml-3 mr-3" />
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {paymentMethods.cash.name}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {paymentMethods.cash.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GCash Payment Option */}
                        {paymentMethods?.gcash && (
                            <div
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedMethod === "gcash"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 hover:border-blue-300"
                                }`}
                                onClick={() => handleMethodSelect("gcash")}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="gcash"
                                        checked={selectedMethod === "gcash"}
                                        onChange={() =>
                                            handleMethodSelect("gcash")
                                        }
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <Smartphone className="w-6 h-6 text-blue-600 ml-3 mr-3" />
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {paymentMethods.gcash.name}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {paymentMethods.gcash.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bank Transfer Payment Option */}
                        {paymentMethods?.bank_transfer && (
                            <div
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedMethod === "bank_transfer"
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-slate-200 hover:border-purple-300"
                                }`}
                                onClick={() =>
                                    handleMethodSelect("bank_transfer")
                                }
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="bank_transfer"
                                        checked={
                                            selectedMethod === "bank_transfer"
                                        }
                                        onChange={() =>
                                            handleMethodSelect("bank_transfer")
                                        }
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <Wallet className="w-6 h-6 text-purple-600 ml-3 mr-3" />
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {paymentMethods.bank_transfer.name}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {
                                                paymentMethods.bank_transfer
                                                    .description
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <InputError
                        message={errors.payment_method}
                        className="mt-2"
                    />
                </div>

                {/* Cash Payment Instructions */}
                {selectedMethod === "cash" && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-green-800 mb-2">
                                    Cash Payment Instructions
                                </h4>
                                <p className="text-sm text-green-700 mb-3">
                                    {paymentMethods?.cash?.details ||
                                        "Payment will be collected at the venue on the event date."}
                                </p>
                                <div className="bg-white rounded p-3 border border-green-200">
                                    <p className="text-sm font-medium text-slate-700">
                                        Amount to Pay:{" "}
                                        <span className="text-green-700 font-bold">
                                            {formatPHPCurrency(
                                                reservation.total_amount
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GCash Payment Details */}
                {selectedMethod === "gcash" && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start mb-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-blue-800 mb-1">
                                    GCash Payment Instructions
                                </h4>
                                <p className="text-sm text-blue-700">
                                    {paymentMethods?.gcash?.details ||
                                        "Send payment to our GCash number and enter your mobile number and reference number below."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <p className="text-sm font-medium text-slate-700 mb-1">
                                Send payment to:
                            </p>
                            <p className="text-2xl font-bold text-blue-700">
                                {paymentMethods?.gcash?.account_number ||
                                    "0982 726 5178"}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                                Account Name: ReserveEase Catering
                            </p>
                            <p className="text-lg font-semibold text-green-700 mt-2">
                                Amount:{" "}
                                {formatPHPCurrency(reservation.total_amount)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Your GCash Mobile Number
                            </label>
                            <input
                                type="text"
                                value={data.mobile_number}
                                onChange={(e) =>
                                    setData("mobile_number", e.target.value)
                                }
                                placeholder="09XX XXX XXXX"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <InputError
                                message={errors.mobile_number}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                GCash Reference Number
                            </label>
                            <input
                                type="text"
                                value={data.reference_number}
                                onChange={(e) =>
                                    setData("reference_number", e.target.value)
                                }
                                placeholder="Enter 13-digit reference number"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <InputError
                                message={errors.reference_number}
                                className="mt-1"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                You can find this in your GCash transaction
                                history
                            </p>
                        </div>
                    </div>
                )}

                {/* Bank Transfer Payment Details */}
                {selectedMethod === "bank_transfer" && (
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start mb-3">
                            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-purple-800 mb-1">
                                    Bank Transfer Instructions
                                </h4>
                                <p className="text-sm text-purple-700">
                                    {paymentMethods?.bank_transfer?.details ||
                                        "Transfer to our bank account and upload the receipt."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-lg font-semibold text-green-700">
                                Amount:{" "}
                                {formatPHPCurrency(reservation.total_amount)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Bank Reference Number
                            </label>
                            <input
                                type="text"
                                value={data.reference_number}
                                onChange={(e) =>
                                    setData("reference_number", e.target.value)
                                }
                                placeholder="Enter bank reference number"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <InputError
                                message={errors.reference_number}
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
                            Pay {formatPHPCurrency(reservation.total_amount)}
                        </>
                    )}
                </PrimaryButton>

                {/* Security Notice */}
                <div className="flex items-center justify-center text-sm text-slate-500 mt-4">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Your payment information is secure and encrypted
                </div>
            </form>
        </div>
    );
}
