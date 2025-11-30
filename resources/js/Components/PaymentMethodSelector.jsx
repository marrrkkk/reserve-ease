import React from "react";
import { Wallet, Smartphone, AlertCircle } from "lucide-react";
import InputError from "./InputError";

export default function PaymentMethodSelector({
    paymentMethods,
    selectedMethod,
    onMethodSelect,
    error,
}) {
    const getMethodIcon = (method) => {
        switch (method) {
            case "cash":
                return Wallet;
            case "gcash":
                return Smartphone;
            case "bank_transfer":
                return Wallet;
            default:
                return Wallet;
        }
    };

    const getMethodColor = (method) => {
        switch (method) {
            case "cash":
                return "green";
            case "gcash":
                return "blue";
            case "bank_transfer":
                return "purple";
            default:
                return "slate";
        }
    };

    return (
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
                        onClick={() => onMethodSelect("cash")}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedMethod === "cash"}
                                onChange={() => onMethodSelect("cash")}
                                className="text-green-600 focus:ring-green-500 rounded"
                            />
                            <Wallet className="w-6 h-6 text-green-600 ml-3 mr-3" />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">
                                    {paymentMethods.cash.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {paymentMethods.cash.description}
                                </div>
                                {selectedMethod === "cash" && (
                                    <div className="mt-2 p-2 bg-white rounded border border-green-200">
                                        <div className="flex items-start">
                                            <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-xs text-green-700">
                                                {paymentMethods.cash.details}
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                        onClick={() => onMethodSelect("gcash")}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedMethod === "gcash"}
                                onChange={() => onMethodSelect("gcash")}
                                className="text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <Smartphone className="w-6 h-6 text-blue-600 ml-3 mr-3" />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">
                                    {paymentMethods.gcash.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {paymentMethods.gcash.description}
                                </div>
                                {selectedMethod === "gcash" && (
                                    <div className="mt-2 p-3 bg-white rounded border border-blue-200">
                                        <div className="flex items-start mb-2">
                                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-xs text-blue-700">
                                                {paymentMethods.gcash.details}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 rounded p-2 mt-2">
                                            <p className="text-xs font-medium text-slate-700">
                                                GCash Number:
                                            </p>
                                            <p className="text-lg font-bold text-blue-700">
                                                {paymentMethods.gcash
                                                    .account_number ||
                                                    "0982 726 5178"}
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                        onClick={() => onMethodSelect("bank_transfer")}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedMethod === "bank_transfer"}
                                onChange={() => onMethodSelect("bank_transfer")}
                                className="text-purple-600 focus:ring-purple-500 rounded"
                            />
                            <Wallet className="w-6 h-6 text-purple-600 ml-3 mr-3" />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">
                                    {paymentMethods.bank_transfer.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {paymentMethods.bank_transfer.description}
                                </div>
                                {selectedMethod === "bank_transfer" && (
                                    <div className="mt-2 p-2 bg-white rounded border border-purple-200">
                                        <div className="flex items-start">
                                            <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-xs text-purple-700">
                                                {
                                                    paymentMethods.bank_transfer
                                                        .details
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}
