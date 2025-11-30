import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    CreditCard,
    Receipt,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Calendar,
} from "lucide-react";

export default function AdminPayments({ auth, payments }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
        })}`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                icon: CheckCircle,
                className: "bg-green-100 text-green-800",
                text: "Completed",
            },
            pending: {
                icon: Clock,
                className: "bg-yellow-100 text-yellow-800",
                text: "Pending",
            },
            failed: {
                icon: XCircle,
                className: "bg-red-100 text-red-800",
                text: "Failed",
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
            >
                <Icon className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    const getPaymentMethodDisplay = (method) => {
        const methods = {
            cash: "Cash Payment",
            gcash: "GCash",
        };
        return methods[method] || method;
    };

    const totalRevenue = payments
        .filter((payment) => payment.status === "completed")
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    const completedPayments = payments.filter(
        (payment) => payment.status === "completed"
    ).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-gray-800 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        Payment Management
                    </h2>
                </div>
            }
        >
            <Head title="Admin - Payments" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Revenue
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(totalRevenue)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Receipt className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Payments
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {payments.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {completedPayments}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                All Payments
                            </h3>
                        </div>

                        {payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transaction
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Method
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {
                                                                payment.transaction_id
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                payment.reference_number
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {payment.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {payment.user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 capitalize">
                                                            {
                                                                payment
                                                                    .reservation
                                                                    .event_type
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {formatDate(
                                                                payment
                                                                    .reservation
                                                                    .event_date
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {getPaymentMethodDisplay(
                                                            payment.payment_method
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(
                                                        payment.status
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDateTime(
                                                            payment.created_at
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        {payment.status ===
                                                            "completed" && (
                                                            <>
                                                                <Link
                                                                    href={route(
                                                                        "admin.payment.receipt",
                                                                        payment.id
                                                                    )}
                                                                    className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                                                                >
                                                                    <Receipt className="w-3 h-3 mr-1" />
                                                                    View
                                                                </Link>
                                                                <a
                                                                    href={route(
                                                                        "admin.payment.receipt.download",
                                                                        payment.id
                                                                    )}
                                                                    className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
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
                            <div className="px-6 py-12 text-center">
                                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No payments found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Payments will appear here once customers
                                    start making reservations.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
