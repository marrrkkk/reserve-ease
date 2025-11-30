import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    CreditCard,
    Receipt,
    Download,
    Calendar,
    Plus,
    Eye,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function ReservationIndex({ auth, reservations }) {
    const formatPHPCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
        })}`;
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        // Normalize payment status to handle both "Paid" and "In Progress"
        const normalizedStatus =
            paymentStatus?.toLowerCase().replace(/\s+/g, "_") || "in_progress";

        const statusConfig = {
            pending: { color: "bg-yellow-500", text: "Payment Pending" },
            in_progress: { color: "bg-yellow-500", text: "In Progress" },
            completed: { color: "bg-green-600", text: "Paid" },
            paid: { color: "bg-green-600", text: "Paid" },
            failed: { color: "bg-red-600", text: "Payment Failed" },
        };

        const config = statusConfig[normalizedStatus] || {
            color: "bg-gray-500",
            text: paymentStatus || "Unknown",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-white text-xs ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    const getReservationStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "bg-blue-500", text: "Pending Review" },
            approved: { color: "bg-green-600", text: "Approved" },
            declined: { color: "bg-red-600", text: "Declined" },
        };

        const config = statusConfig[status] || {
            color: "bg-gray-500",
            text: status,
        };

        return (
            <span
                className={`px-2 py-1 rounded text-white text-xs ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-amber-700 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-amber-500" />
                    My Reservations
                </h2>
            }
        >
            <Head title="My Reservations" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <Calendar className="w-6 h-6 text-amber-600 mr-2" />
                                All Reservations
                            </h3>
                            <span className="text-sm text-slate-500">
                                Total: {reservations.length}
                            </span>
                        </div>
                        {reservations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-amber-100 rounded-lg">
                                    <thead className="bg-amber-50">
                                        <tr>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Event Type
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Date
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Time
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Venue
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Guests
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Amount
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-amber-700 uppercase">
                                                Payment
                                            </th>
                                            <th className="px-4 py-2 border-b text-center text-xs font-medium text-amber-700 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((res) => (
                                            <tr
                                                key={res.id}
                                                className="hover:bg-amber-50"
                                            >
                                                <td className="px-4 py-4 border-b">
                                                    {res.event_type}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    {res.event_date}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    {res.event_time || "—"}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    {res.venue}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    {res.guest_count}
                                                </td>
                                                <td className="px-4 py-4 border-b font-semibold text-amber-700">
                                                    {res.total_amount
                                                        ? formatPHPCurrency(
                                                              res.total_amount
                                                          )
                                                        : "—"}
                                                </td>
                                                <td className="px-4 py-4 border-b capitalize">
                                                    {getReservationStatusBadge(
                                                        res.status
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    {getPaymentStatusBadge(
                                                        res.payment_status ||
                                                            "pending"
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 border-b">
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {/* View button - always show */}
                                                        <Link
                                                            href={route(
                                                                "reservations.show",
                                                                res.id
                                                            )}
                                                            className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            View
                                                        </Link>

                                                        {/* Show Pay Now button if reservation is approved and payment is pending */}
                                                        {res.status ===
                                                            "approved" &&
                                                            (res.payment_status ===
                                                                "pending" ||
                                                                res.payment_status ===
                                                                    "In Progress" ||
                                                                !res.payment_status) &&
                                                            res.total_amount && (
                                                                <Link
                                                                    href={route(
                                                                        "payment.show",
                                                                        res.id
                                                                    )}
                                                                    className="inline-flex items-center px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                                >
                                                                    <CreditCard className="w-3 h-3 mr-1" />
                                                                    Pay Now
                                                                </Link>
                                                            )}

                                                        {/* Show View Receipt and Download buttons if payment is completed */}
                                                        {(res.payment_status ===
                                                            "completed" ||
                                                            res.payment_status ===
                                                                "Paid") &&
                                                            res.latest_payment && (
                                                                <>
                                                                    <Link
                                                                        href={route(
                                                                            "payment.receipt",
                                                                            res
                                                                                .latest_payment
                                                                                .id
                                                                        )}
                                                                        className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                                    >
                                                                        <Receipt className="w-3 h-3 mr-1" />
                                                                        Receipt
                                                                    </Link>
                                                                    <a
                                                                        href={route(
                                                                            "payment.receipt.download",
                                                                            res
                                                                                .latest_payment
                                                                                .id
                                                                        )}
                                                                        className="inline-flex items-center px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                                    >
                                                                        <Download className="w-3 h-3 mr-1" />
                                                                        PDF
                                                                    </a>
                                                                </>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600 mb-2">
                                    No Reservations Yet
                                </h4>
                                <p className="text-slate-500 mb-6">
                                    Create your first reservation to get
                                    started!
                                </p>
                                <Link
                                    href={route("dashboard")}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Reservation
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
