import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Package, Check, ArrowLeft, Calendar } from "lucide-react";

export default function Show({ package: packageData }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link
                        href={route("packages.index")}
                        className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Packages</span>
                    </Link>
                    <h2 className="text-3xl font-bold leading-tight text-slate-800">
                        {packageData.name}
                    </h2>
                    <p className="text-slate-600 mt-1">
                        {packageData.description}
                    </p>
                </div>
            }
        >
            <Head title={packageData.name} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Package Overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Package className="w-8 h-8 text-amber-600" />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">
                                        {packageData.name}
                                    </h3>
                                    {packageData.category && (
                                        <span className="inline-block mt-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                            {packageData.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-600">
                                    Starting at
                                </p>
                                <p className="text-4xl font-bold text-amber-600">
                                    ₱
                                    {parseFloat(
                                        packageData.base_price
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 text-lg mb-6">
                            {packageData.description}
                        </p>

                        {/* Customization Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Tables */}
                            {packageData.available_tables &&
                                packageData.available_tables.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-slate-800 mb-3">
                                            Table Options
                                        </h4>
                                        <ul className="space-y-2">
                                            {packageData.available_tables.map(
                                                (table, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-slate-700">
                                                            {table}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {/* Chairs */}
                            {packageData.available_chairs &&
                                packageData.available_chairs.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-slate-800 mb-3">
                                            Chair Options
                                        </h4>
                                        <ul className="space-y-2">
                                            {packageData.available_chairs.map(
                                                (chair, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-slate-700">
                                                            {chair}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {/* Food Count */}
                            {packageData.available_foods &&
                                packageData.available_foods.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-slate-800 mb-3">
                                            Food Selections
                                        </h4>
                                        <p className="text-sm text-slate-700">
                                            Choose from{" "}
                                            <span className="font-semibold">
                                                {
                                                    packageData.available_foods
                                                        .length
                                                }
                                            </span>{" "}
                                            delicious food options within your
                                            package budget
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Food Items List */}
                        {packageData.available_foods &&
                            packageData.available_foods.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold text-slate-800 mb-4">
                                        Available Food Items
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {packageData.available_foods.map(
                                            (food, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                >
                                                    <span className="text-slate-700">
                                                        {food.name}
                                                    </span>
                                                    <span className="font-semibold text-slate-800">
                                                        ₱
                                                        {parseFloat(
                                                            food.price
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Book Now Button */}
                        <div className="flex justify-center">
                            <Link
                                href={route("packages.book", packageData.id)}
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all text-lg"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Book This Package</span>
                            </Link>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-3">
                            What's Included
                        </h4>
                        <ul className="space-y-2 text-slate-700">
                            <li className="flex items-start space-x-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>
                                    Customizable table and chair selections
                                </span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>
                                    Food selections within package budget
                                </span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>Professional event coordination</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>Venue setup and cleanup</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
