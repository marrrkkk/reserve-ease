import { Link } from "@inertiajs/react";
import { Package, Users, Check } from "lucide-react";

export default function PackageList({ packages }) {
    if (!packages || packages.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-600 mb-2">
                    No Packages Available
                </h4>
                <p className="text-slate-500">
                    Check back later for available event packages.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                    <div className="p-6">
                        {/* Package Header */}
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Package className="w-5 h-5 text-amber-600" />
                                <h3 className="text-xl font-bold text-slate-800">
                                    {pkg.name}
                                </h3>
                            </div>
                            <p className="text-slate-600 text-sm mb-3">
                                {pkg.description}
                            </p>

                            <div className="flex items-baseline space-x-2 mb-3">
                                <span className="text-3xl font-bold text-slate-800">
                                    ₱
                                    {Number(pkg.base_price).toLocaleString(
                                        "en-PH"
                                    )}
                                </span>
                            </div>

                            {pkg.category && (
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                        {pkg.category}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Features Preview */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-800 mb-3">
                                Customization Options:
                            </h4>
                            <ul className="space-y-2">
                                {pkg.available_tables &&
                                    pkg.available_tables.length > 0 && (
                                        <li className="flex items-center space-x-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-600">
                                                {pkg.available_tables.length}{" "}
                                                table options
                                            </span>
                                        </li>
                                    )}
                                {pkg.available_chairs &&
                                    pkg.available_chairs.length > 0 && (
                                        <li className="flex items-center space-x-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-600">
                                                {pkg.available_chairs.length}{" "}
                                                chair options
                                            </span>
                                        </li>
                                    )}
                                {pkg.available_foods &&
                                    pkg.available_foods.length > 0 && (
                                        <li className="flex items-center space-x-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-600">
                                                {pkg.available_foods.length}{" "}
                                                food selections
                                            </span>
                                        </li>
                                    )}
                            </ul>
                        </div>

                        {/* Action Button */}
                        <Link
                            href={route("packages.show", pkg.id)}
                            className="block w-full py-3 px-4 bg-amber-500 text-white text-center rounded-xl font-semibold hover:bg-amber-600 transition-all"
                        >
                            Select Package
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
