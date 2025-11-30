import { Link } from "@inertiajs/react";
import {
    CreditCard,
    User,
    Calendar,
    Package as PackageIcon,
    Utensils,
    Table2,
    Armchair,
} from "lucide-react";

export default function ReservationDetails({ reservation }) {
    const formatCurrency = (amount) => {
        return `₱${parseFloat(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getPaymentStatusColor = (status) => {
        if (status === "Paid" || status === "completed") {
            return "bg-green-100 text-green-800";
        }
        return "bg-yellow-100 text-yellow-800";
    };

    const getReservationStatusColor = (status) => {
        if (status === "approved") {
            return "bg-green-100 text-green-800";
        } else if (status === "declined") {
            return "bg-red-100 text-red-800";
        }
        return "bg-blue-100 text-blue-800";
    };

    return (
        <div className="space-y-6">
            {/* Customer Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Customer Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.customer_full_name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.customer_email}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contact Number
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.customer_contact_number}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.customer_address}
                        </p>
                    </div>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Event Details
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Event Type
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.event_type}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Event Date
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {formatDate(reservation.event_date)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Event Time
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.event_time || "Not specified"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Venue
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.venue}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Guest Count
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {reservation.guest_count}
                        </p>
                    </div>
                </div>
            </div>

            {/* Package Information Section */}
            {reservation.package && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <PackageIcon className="w-5 h-5 text-amber-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Package Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Package Name
                            </label>
                            <p className="mt-1 text-sm text-gray-900 font-medium">
                                {reservation.package.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Base Price
                            </label>
                            <p className="mt-1 text-sm text-gray-900 font-semibold text-amber-700">
                                {formatCurrency(reservation.package.base_price)}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {reservation.package.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Customization Details Section */}
            {reservation.customization_details && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <Utensils className="w-5 h-5 text-amber-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Customization Details
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {/* Table and Chair Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <Table2 className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Table Type
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 font-medium">
                                        {
                                            reservation.customization_details
                                                .selected_table_type
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Armchair className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Chair Type
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 font-medium">
                                        {
                                            reservation.customization_details
                                                .selected_chair_type
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Food Selections */}
                        {reservation.customization_details.selected_foods &&
                            reservation.customization_details.selected_foods
                                .length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Food Selections
                                    </label>
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                        <ul className="space-y-2">
                                            {reservation.customization_details.selected_foods.map(
                                                (food, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0"
                                                    >
                                                        <span className="text-sm text-gray-900 flex items-center">
                                                            <Utensils className="w-4 h-4 text-amber-500 mr-2" />
                                                            {food.name}
                                                        </span>
                                                        <span className="text-sm font-medium text-amber-700">
                                                            {formatCurrency(
                                                                food.price
                                                            )}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        <div className="mt-4 pt-3 border-t border-amber-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Total Food Cost
                                                </span>
                                                <span className="text-base font-bold text-amber-700">
                                                    {formatCurrency(
                                                        reservation.customization_details.selected_foods.reduce(
                                                            (sum, food) =>
                                                                sum +
                                                                parseFloat(
                                                                    food.price
                                                                ),
                                                            0
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Additional Notes */}
                        {reservation.customization_details
                            .customization_notes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Notes
                                </label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {
                                        reservation.customization_details
                                            .customization_notes
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Payment Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Total Amount
                        </label>
                        <p className="mt-1 text-xl font-bold text-amber-700">
                            {formatCurrency(reservation.total_amount)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Payment Status
                        </label>
                        <p className="mt-1">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                    reservation.payment_status
                                )}`}
                            >
                                {reservation.payment_status}
                            </span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Reservation Status
                        </label>
                        <p className="mt-1">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReservationStatusColor(
                                    reservation.status
                                )}`}
                            >
                                {reservation.status.charAt(0).toUpperCase() +
                                    reservation.status.slice(1)}
                            </span>
                        </p>
                    </div>

                    {/* Payment Method - Show if payment exists */}
                    {reservation.payments &&
                        reservation.payments.length > 0 &&
                        reservation.payments[0].payment_method && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Payment Method
                                </label>
                                <p className="mt-1 text-sm text-gray-900 capitalize">
                                    {reservation.payments[0].payment_method.replace(
                                        "_",
                                        " "
                                    )}
                                </p>
                            </div>
                        )}
                </div>

                {/* Payment Button - Show if unpaid */}
                {reservation.payment_status !== "Paid" &&
                    reservation.payment_status !== "completed" && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <Link
                                href={route("payment.show", reservation.id)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md"
                            >
                                <CreditCard className="w-5 h-5 mr-2" />
                                Proceed to Payment
                            </Link>
                        </div>
                    )}
            </div>
        </div>
    );
}
