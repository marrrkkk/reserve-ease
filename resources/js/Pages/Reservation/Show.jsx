import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ReservationDetails from "@/Components/ReservationDetails";
import { ArrowLeft } from "lucide-react";

export default function Show({ reservation }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-amber-700">
                        Reservation Details
                    </h2>
                    <Link
                        href={route("reservations.index")}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Reservations
                    </Link>
                </div>
            }
        >
            <Head title="Reservation Details" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ReservationDetails reservation={reservation} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
