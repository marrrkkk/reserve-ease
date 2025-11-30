import React from "react";
import {
    DollarSign,
    CreditCard,
    Wallet,
    Banknote,
    TrendingUp,
    Clock,
} from "lucide-react";

export default function RevenueDisplay({ revenue, summary }) {
    const totalRevenue = revenue?.total ?? 0;
    const revenueByMethod = revenue?.by_method || [];
    const revenueByPeriod = revenue?.by_period || [];

    // Calculate paid vs pending amounts
    const paidCount = summary?.by_payment_status?.Paid ?? 0;
    const pendingCount = summary?.by_payment_status?.["In Progress"] ?? 0;
    const totalBookings = summary?.total_bookings ?? 0;
    const paidPercentage =
        totalBookings > 0 ? (paidCount / totalBookings) * 100 : 0;
    const pendingPercentage =
        totalBookings > 0 ? (pendingCount / totalBookings) * 100 : 0;

    // Get icon for payment method
    const getPaymentMethodIcon = (method) => {
        switch (method?.toLowerCase()) {
            case "gcash":
            case "e-wallet":
                return <Wallet className="w-5 h-5" />;
            case "bank_transfer":
            case "bank transfer":
                return <Banknote className="w-5 h-5" />;
            case "credit_card":
            case "credit card":
                return <CreditCard className="w-5 h-5" />;
            default:
                return <DollarSign className="w-5 h-5" />;
        }
    };

    // Format payment method name
    const formatPaymentMethod = (method) => {
        if (!method) return "Unknown";
        return method
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="space-y-6">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold opacity-90">
                        Total Revenue
                    </h3>
                    <DollarSign className="w-8 h-8 opacity-80" />
                </div>
                <div className="text-5xl font-bold mb-2">
                    ₱
                    {Number(totalRevenue).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                    })}
                </div>
                <p className="text-sm opacity-80">
                    From paid reservations only
                </p>
            </div>

            {/* Revenue by Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Revenue by Payment Method
                </h3>
                {revenueByMethod.length > 0 ? (
                    <div className="space-y-3">
                        {revenueByMethod.map((item, index) => {
                            const percentage =
                                totalRevenue > 0
                                    ? (item.revenue / totalRevenue) * 100
                                    : 0;
                            const colors = [
                                "bg-blue-500",
                                "bg-green-500",
                                "bg-purple-500",
                                "bg-yellow-500",
                                "bg-pink-500",
                            ];
                            const bgColor = colors[index % colors.length];

                            return (
                                <div
                                    key={item.payment_method || index}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`p-2 rounded-lg ${bgColor} text-white`}
                                            >
                                                {getPaymentMethodIcon(
                                                    item.payment_method
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {formatPaymentMethod(
                                                        item.payment_method
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.payment_count} payment
                                                    {item.payment_count !== 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">
                                                ₱
                                                {Number(
                                                    item.revenue
                                                ).toLocaleString("en-PH", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${bgColor} h-2 rounded-full transition-all duration-300`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No payment method data available
                    </div>
                )}
            </div>

            {/* Revenue by Time Period */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Revenue by Time Period
                </h3>
                {revenueByPeriod.length > 0 ? (
                    <div className="space-y-2">
                        {revenueByPeriod.slice(0, 6).map((item) => (
                            <div
                                key={item.period}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                            >
                                <div className="text-sm text-gray-700">
                                    {item.period}
                                </div>
                                <div className="font-semibold text-green-700">
                                    ₱
                                    {Number(item.revenue).toLocaleString(
                                        "en-PH",
                                        {
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No time period data available
                    </div>
                )}
            </div>

            {/* Paid vs Pending Visualization */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Payment Status Overview
                </h3>
                <div className="space-y-4">
                    {/* Paid */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Paid
                                </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                                {paidCount} ({paidPercentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${paidPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Pending */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    In Progress
                                </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                                {pendingCount} ({pendingPercentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${pendingPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Total Bookings
                            </span>
                            <span className="font-bold text-gray-900">
                                {totalBookings}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
