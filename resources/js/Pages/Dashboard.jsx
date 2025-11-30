import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Calendar,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Bell,
    Eye,
    CreditCard,
    MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import CreateReservationModal from "@/Components/CreateReservationModal";
import axios from "axios";

export default function Dashboard({ auth, reservation = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reservations, setReservations] = useState(
        Array.isArray(reservation) ? reservation : []
    );
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            axios
                .get("/api/user/reservations")
                .then((res) => setReservations(res.data))
                .catch(() => {});
            axios
                .get("/api/user/notifications")
                .then((res) => setNotifications(res.data))
                .catch(() => {});
        }, 10000);
        // Initial fetch
        axios
            .get("/api/user/notifications")
            .then((res) => setNotifications(res.data))
            .catch(() => {});
        return () => clearInterval(interval);
    }, []);

    // Helper function to get status color and icon
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return {
                    color: "green",
                    icon: CheckCircle,
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    textColor: "text-green-800",
                    badgeColor: "bg-green-100",
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

    // Helper function to format date
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

    // Helper function to format time
    const formatTime = (timeString) => {
        if (!timeString) return "";
        try {
            const time = new Date(`2000-01-01T${timeString}`);
            return time.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            return "";
        }
    };

    // Event summary stats
    const totalReservations = reservations.length;
    const confirmedCount = reservations.filter(
        (r) => r.status === "confirmed" || r.status === "approved"
    ).length;
    const pendingCount = reservations.filter(
        (r) => r.status === "pending"
    ).length;
    const declinedCount = reservations.filter(
        (r) => r.status === "declined" || r.status === "cancelled"
    ).length;
    const totalSpent = reservations
        .filter((r) => r.status === "confirmed" || r.status === "approved")
        .reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Create New Reservation
                                    </h3>
                                    <p className="text-amber-100">
                                        Book your next event at Inwood Tavern
                                    </p>
                                </div>
                                <Plus className="w-12 h-12 text-white group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                        </button>
                        <Link
                            href={route("reservations.index")}
                            className="group bg-white border-2 border-amber-200 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                        View My Reservations
                                    </h3>
                                    <p className="text-slate-600">
                                        Manage your existing bookings
                                    </p>
                                </div>
                                <Eye className="w-12 h-12 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </Link>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Reservations */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                        <Calendar className="w-6 h-6 text-amber-600 mr-2" />
                                        Recent Reservations
                                    </h3>
                                    <span className="text-sm text-slate-500">
                                        Latest {reservations.length}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {reservations.length > 0 ? (
                                        reservations.map((res) => {
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
                                                                    {res.event_time &&
                                                                        ` • ${formatTime(
                                                                            res.event_time
                                                                        )}`}
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
                                                            {res.customization && (
                                                                <p className="text-sm text-slate-500 mt-2 italic">
                                                                    "
                                                                    {res.customization.substring(
                                                                        0,
                                                                        100
                                                                    )}
                                                                    {res
                                                                        .customization
                                                                        .length >
                                                                    100
                                                                        ? "..."
                                                                        : ""}
                                                                    "
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-slate-800">
                                                                ₱
                                                                {Number(
                                                                    res.total_amount ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "en-PH",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </p>
                                                            <p
                                                                className={`text-sm font-medium text-${statusInfo.color}-600`}
                                                            >
                                                                {res.status ===
                                                                "confirmed"
                                                                    ? "Confirmed"
                                                                    : res.status ===
                                                                      "pending"
                                                                    ? "Under Review"
                                                                    : res.status ===
                                                                      "cancelled"
                                                                    ? "Cancelled"
                                                                    : "Processing"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`mt-4 pt-4 border-t ${statusInfo.borderColor}`}
                                                    >
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                className={`px-4 py-2 bg-white text-${statusInfo.color}-700 border border-${statusInfo.color}-300 rounded-lg hover:bg-${statusInfo.color}-50 transition-colors text-sm font-medium`}
                                                            >
                                                                View Details
                                                            </button>
                                                            {(res.status ===
                                                                "approved" ||
                                                                res.status ===
                                                                    "confirmed") &&
                                                                (res.payment_status ===
                                                                    "pending" ||
                                                                    !res.payment_status) &&
                                                                res.total_amount && (
                                                                    <Link
                                                                        href={route(
                                                                            "payment.show",
                                                                            res.id
                                                                        )}
                                                                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                                                                    >
                                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                                        Pay Now
                                                                    </Link>
                                                                )}
                                                            {res.payment_status ===
                                                                "completed" && (
                                                                <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Paid
                                                                </span>
                                                            )}
                                                            {res.status ===
                                                                "confirmed" && (
                                                                <button
                                                                    className={`px-4 py-2 bg-${statusInfo.color}-600 text-white rounded-lg hover:bg-${statusInfo.color}-700 transition-colors text-sm font-medium`}
                                                                >
                                                                    Contact
                                                                    Venue
                                                                </button>
                                                            )}
                                                            {res.status ===
                                                                "pending" && (
                                                                <button
                                                                    className={`px-4 py-2 bg-${statusInfo.color}-600 text-white rounded-lg hover:bg-${statusInfo.color}-700 transition-colors text-sm font-medium`}
                                                                >
                                                                    Edit Request
                                                                </button>
                                                            )}
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
                                                Create your first reservation to
                                                get started!
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setIsModalOpen(true)
                                                }
                                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium"
                                            >
                                                Create Reservation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notifications & Quick Info */}
                        <div className="space-y-6">
                            {/* Notifications */}
                            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                    <Bell className="w-5 h-5 text-amber-600 mr-2" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => {
                                            const statusInfo = getStatusInfo(
                                                notif.status
                                            );
                                            const StatusIcon = statusInfo.icon;

                                            return (
                                                <div
                                                    key={notif.id}
                                                    className={`flex items-start space-x-3 p-3 ${statusInfo.bgColor} rounded-lg border ${statusInfo.borderColor}`}
                                                >
                                                    <StatusIcon
                                                        className={`w-5 h-5 text-${statusInfo.color}-600 mt-0.5 flex-shrink-0`}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {notif.status ===
                                                            "confirmed"
                                                                ? "Reservation Confirmed"
                                                                : notif.status ===
                                                                  "pending"
                                                                ? "Reservation Submitted"
                                                                : "Reservation Updated"}
                                                        </p>
                                                        <p className="text-xs text-slate-600 capitalize">
                                                            {notif.event_type ||
                                                                "Event"}{" "}
                                                            on{" "}
                                                            {formatDate(
                                                                notif.event_date
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {notif.created_at
                                                                ? new Date(
                                                                      notif.created_at
                                                                  ).toLocaleDateString()
                                                                : "Recently"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-slate-500">
                                                No recent activity
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button className="w-full mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">
                                    View All Activity
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">
                                    Your Event Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Total Reservations
                                        </span>
                                        <span className="text-2xl font-bold text-slate-800">
                                            {totalReservations}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Confirmed
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {confirmedCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Pending
                                        </span>
                                        <span className="text-2xl font-bold text-yellow-600">
                                            {pendingCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Declined/Cancelled
                                        </span>
                                        <span className="text-2xl font-bold text-red-600">
                                            {declinedCount}
                                        </span>
                                    </div>
                                    {confirmedCount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">
                                                Total Spent
                                            </span>
                                            <span className="text-2xl font-bold text-slate-800">
                                                ₱
                                                {totalSpent.toLocaleString(
                                                    "en-PH",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-amber-100 text-sm mb-4">
                                    Our event coordinators are here to assist
                                    you
                                </p>
                                <button className="w-full bg-white text-amber-600 py-2 px-4 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
