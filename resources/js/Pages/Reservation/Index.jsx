import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ReservationIndex({ auth, reservations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Reservations</h2>}
        >
            <Head title="My Reservations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {reservations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reservations.map((res) => (
                                                <tr key={res.id}>
                                                    <td className="px-4 py-2 whitespace-nowrap">{res.event_type}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">{res.event_date}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">{res.event_time || '—'}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">{res.venue}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">{res.guest_count}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap capitalize">
                                                        <span
                                                            className={`px-2 py-1 rounded text-white text-xs ${
                                                                res.status === 'pending'
                                                                    ? 'bg-yellow-500'
                                                                    : res.status === 'approved'
                                                                    ? 'bg-green-600'
                                                                    : res.status === 'declined'
                                                                    ? 'bg-red-600'
                                                                    : 'bg-gray-500'
                                                            }`}
                                                        >
                                                            {res.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">You have no reservations yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
