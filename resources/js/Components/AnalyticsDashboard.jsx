import React, { useState } from "react";
import { Calendar, TrendingUp, DollarSign, Clock } from "lucide-react";

export default function AnalyticsDashboard({
    summary,
    revenue,
    onPrint,
    onDateRangeChange,
}) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleDateRangeSubmit = (e) => {
        e.preventDefault();
        if (onDateRangeChange) {
            onDateRangeChange(startDate, endDate);
        }
    };

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    // Prepare monthly data for chart
    const monthlyData = summary?.by_month || [];
    const maxCount = Math.max(...monthlyData.map((d) => d.count || 0), 1);

    return (
        <div className="space-y-6">
            {/* Date Range Selector and Print Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <form
                        onSubmit={handleDateRangeSubmit}
                        className="flex flex-col md:flex-row gap-4 items-end"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Apply Filter
                        </button>
                    </form>
                    <button
                        onClick={handlePrint}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                        </svg>
                        Print Report
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500 font-medium">
                            Total Bookings
                        </div>
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700">
                        {summary?.total_bookings ?? 0}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500 font-medium">
                            Total Revenue
                        </div>
                        <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                        ₱
                        {Number(revenue?.total ?? 0).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                        })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500 font-medium">
                            Pending Payments
                        </div>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-700">
                        {summary?.by_payment_status?.["In Progress"] ?? 0}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500 font-medium">
                            Paid Bookings
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-purple-700">
                        {summary?.by_payment_status?.Paid ?? 0}
                    </div>
                </div>
            </div>

            {/* Monthly Report Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Monthly Report
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                                    Period
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                                    Bookings
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-blue-50">
                            {revenue?.by_period &&
                            revenue.by_period.length > 0 ? (
                                revenue.by_period.map((item) => (
                                    <tr
                                        key={item.period}
                                        className="hover:bg-blue-50"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {item.period}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {item.payment_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-green-700">
                                            ₱
                                            {Number(
                                                item.revenue ?? 0
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No monthly data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Monthly Bookings Chart
                </h3>
                {monthlyData.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <svg
                            viewBox={`0 0 ${monthlyData.length * 60} 200`}
                            className="w-full"
                            style={{ minHeight: "200px" }}
                        >
                            {monthlyData.map((item, index) => {
                                const barHeight = (item.count / maxCount) * 150;
                                const x = index * 60 + 20;
                                const y = 180 - barHeight;

                                return (
                                    <g key={item.period || index}>
                                        {/* Bar */}
                                        <rect
                                            x={x}
                                            y={y}
                                            width={30}
                                            height={barHeight}
                                            fill="#3b82f6"
                                            rx={4}
                                        />
                                        {/* Count label */}
                                        <text
                                            x={x + 15}
                                            y={y - 5}
                                            textAnchor="middle"
                                            fontSize={12}
                                            fill="#1e293b"
                                            fontWeight="bold"
                                        >
                                            {item.count}
                                        </text>
                                        {/* Period label */}
                                        <text
                                            x={x + 15}
                                            y={195}
                                            textAnchor="middle"
                                            fontSize={10}
                                            fill="#64748b"
                                        >
                                            {item.period?.slice(0, 7) || "N/A"}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No chart data available
                    </div>
                )}
            </div>
        </div>
    );
}
