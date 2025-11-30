import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <ApplicationLogo className="h-20 w-20 fill-current text-amber-600 hover:text-amber-700 transition-colors" />
                    </Link>
                    <h2 className="mt-4 text-3xl font-bold text-slate-800">
                        Inwood Tavern
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Event Reservation System
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-amber-100 px-8 py-10">
                    {children}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        © 2024 Inwood Tavern. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
