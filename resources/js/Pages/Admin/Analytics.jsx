import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import AnalyticsDashboard from "@/Components/AnalyticsDashboard";
import RevenueDisplay from "@/Components/RevenueDisplay";

export default function AdminAnalytics({
    auth,
    summary = {},
    revenue = {},
    filters = {},
}) {
    const handleDateRangeChange = (startDate, endDate) => {
        router.get(
            route("admin.analytics"),
            { start_date: startDate, end_date: endDate },
            { preserveState: true }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analytics" />

            {/* Print styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                }
            `}</style>

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between no-print">
                        <h2 className="text-2xl font-bold text-blue-700">
                            Analytics Overview
                        </h2>
                        <Link
                            href={route("admin")}
                            className="text-blue-600 hover:underline text-sm font-semibold"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="print-area">
                        {/* Print Header */}
                        <div className="hidden print:block mb-8">
                            <h1 className="text-3xl font-bold text-center mb-2">
                                Analytics Report
                            </h1>
                            <p className="text-center text-gray-600">
                                Generated on{" "}
                                {new Date().toLocaleDateString("en-PH", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            {(filters.start_date || filters.end_date) && (
                                <p className="text-center text-gray-600 mt-2">
                                    Period: {filters.start_date || "Start"} to{" "}
                                    {filters.end_date || "End"}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Analytics Dashboard (2/3 width) */}
                            <div className="lg:col-span-2">
                                <AnalyticsDashboard
                                    summary={summary}
                                    revenue={revenue}
                                    onPrint={handlePrint}
                                    onDateRangeChange={handleDateRangeChange}
                                />
                            </div>

                            {/* Right Column - Revenue Display (1/3 width) */}
                            <div className="lg:col-span-1">
                                <RevenueDisplay
                                    revenue={revenue}
                                    summary={summary}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
