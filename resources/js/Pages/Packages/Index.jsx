import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import PackageList from "@/Components/PackageList";
import { Package, Check } from "lucide-react";

export default function Packages({ packages }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold leading-tight text-slate-800">
                        Event Packages
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Choose the perfect package for your special event
                    </p>
                </div>
            }
        >
            <Head title="Packages" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-bold mb-4">
                                Make Your Event Extraordinary
                            </h1>
                            <p className="text-xl text-amber-100 mb-6">
                                From intimate gatherings to grand celebrations,
                                we have the perfect package to bring your vision
                                to life.
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-amber-100">
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Professional Planning</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Premium Venues</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span>Full-Service Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Packages Grid */}
                    <PackageList packages={packages} />

                    {/* CTA Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 text-center mt-12">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                            Ready to Start Planning?
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                            Our event specialists are here to help you choose
                            the perfect package and customize every detail to
                            make your event unforgettable.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
