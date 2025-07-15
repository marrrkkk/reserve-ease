import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useMemo } from "react";
import {
    Calendar,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Bell,
    MapPin,
} from "lucide-react";

export default function AdminDashboard({
    auth,
    summary = {},
    recent_reservations = [],
    analytics = {},
}) {
    // Helper for status info (blue theme)
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return {
                    color: "blue",
                    icon: CheckCircle,
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    textColor: "text-blue-800",
                    badgeColor: "bg-blue-100",
                };
            case "pending":
                return {
                    color: "yellow",
                    icon: Clock,
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    textColor: "text-yellow-800",
                    badgeColor: "bg-yellow-100",
                };
            case "declined":
            case "cancelled":
                return {
                    color: "red",
                    icon: XCircle,
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    textColor: "text-red-800",
                    badgeColor: "bg-red-100",
                };
            default:
                return {
                    color: "gray",
                    icon: AlertCircle,
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    textColor: "text-gray-800",
                    badgeColor: "bg-gray-100",
                };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    // Summary values
    const total = summary.total ?? 0;
    const approved = summary.approved ?? 0;
    const pending = summary.pending ?? 0;
    const revenue = summary.revenue ?? 0;
    const approvalRate = summary.approval_rate ?? 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Link
                            href={route("admin.reservations")}
                            className="group bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Manage Reservations
                                    </h3>
                                    <p className="text-blue-100">
                                        View and moderate all bookings
                                    </p>
                                </div>
                                <Eye className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </Link>
                        <Link
                            href={route("admin.analytics")}
                            className="group bg-white border-2 border-blue-200 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                        Analytics Overview
                                    </h3>
                                    <p className="text-slate-600">
                                        See key metrics and trends
                                    </p>
                                </div>
                                <Bell className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </Link>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Reservations */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                        <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                                        Recent Reservations
                                    </h3>
                                    <span className="text-sm text-slate-500">
                                        Latest {recent_reservations.length}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {recent_reservations.length > 0 ? (
                                        recent_reservations.map((res) => {
                                            const statusInfo = getStatusInfo(
                                                res.status
                                            );
                                            const StatusIcon = statusInfo.icon;
                                            return (
                                                <div
                                                    key={res.id}
                                                    className={`border ${statusInfo.borderColor} ${statusInfo.bgColor} rounded-xl p-6 hover:shadow-md transition-shadow`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <StatusIcon
                                                                    className={`w-5 h-5 text-${statusInfo.color}-600`}
                                                                />
                                                                <span
                                                                    className={`px-3 py-1 ${statusInfo.badgeColor} ${statusInfo.textColor} rounded-full text-sm font-medium capitalize`}
                                                                >
                                                                    {res.status ||
                                                                        "Pending"}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-lg font-semibold text-slate-800 mb-1 capitalize">
                                                                {res.event_type ||
                                                                    "Event"}
                                                            </h4>
                                                            <div className="space-y-1 text-sm text-slate-600">
                                                                <p className="flex items-center">
                                                                    <Calendar className="w-4 h-4 mr-2" />
                                                                    {formatDate(
                                                                        res.event_date
                                                                    )}
                                                                </p>
                                                                <p className="flex items-center">
                                                                    <MapPin className="w-4 h-4 mr-2" />
                                                                    {res.venue ||
                                                                        "Venue TBD"}{" "}
                                                                    •{" "}
                                                                    {res.guest_count ||
                                                                        0}{" "}
                                                                    guests
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-slate-800">
                                                                $
                                                                {Number(
                                                                    res.total_amount ||
                                                                        0
                                                                ).toLocaleString()}
                                                            </p>
                                                            <p
                                                                className={`text-sm font-medium text-${statusInfo.color}-600`}
                                                            >
                                                                {res.status ===
                                                                "approved"
                                                                    ? "Approved"
                                                                    : res.status ===
                                                                      "pending"
                                                                    ? "Under Review"
                                                                    : res.status ===
                                                                          "declined" ||
                                                                      res.status ===
                                                                          "cancelled"
                                                                    ? "Declined"
                                                                    : "Processing"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <h4 className="text-lg font-semibold text-slate-600 mb-2">
                                                No Reservations Yet
                                            </h4>
                                            <p className="text-slate-500 mb-6">
                                                No recent reservations to show.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Analytics & Quick Info */}
                        <div className="space-y-6">
                            {/* Analytics Summary */}
                            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">
                                    Admin Event Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Total Reservations
                                        </span>
                                        <span className="text-2xl font-bold text-slate-800">
                                            {total}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Approved
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {approved}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Pending
                                        </span>
                                        <span className="text-2xl font-bold text-yellow-600">
                                            {pending}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Revenue
                                        </span>
                                        <span className="text-2xl font-bold text-blue-700">
                                            ${Number(revenue).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Approval Rate
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {approvalRate}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Placeholder for future admin quick actions */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-2">
                                    Admin Tools
                                </h3>
                                <p className="text-blue-100 text-sm mb-4">
                                    Access admin features and settings
                                </p>
                                <Link
                                    href={route("admin.reservations")}
                                    className="w-full block bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
                                >
                                    Go to Reservations
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
