import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

function BarChart({ data }) {
    if (!data || data.length === 0)
        return <div className="text-gray-400">No data</div>;
    const max = Math.max(...data.map((d) => d.count));
    return (
        <svg
            viewBox={`0 0 ${data.length * 40} 120`}
            width={data.length * 40}
            height={120}
            className="w-full h-32"
        >
            {data.map((d, i) => (
                <g key={d.month}>
                    <rect
                        x={i * 40 + 10}
                        y={120 - (d.count / max) * 100 - 10}
                        width={20}
                        height={(d.count / max) * 100}
                        fill="#2563eb"
                        rx={4}
                    />
                    <text
                        x={i * 40 + 20}
                        y={115}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#888"
                    >
                        {d.month.slice(2)}
                    </text>
                    <text
                        x={i * 40 + 20}
                        y={120 - (d.count / max) * 100 - 15}
                        textAnchor="middle"
                        fontSize={11}
                        fill="#222"
                    >
                        {d.count}
                    </text>
                </g>
            ))}
        </svg>
    );
}

function PieChart({ data }) {
    if (!data || data.length === 0)
        return <div className="text-gray-400">No data</div>;
    const total = data.reduce((sum, d) => sum + d.count, 0);
    let acc = 0;
    const colors = ["#2563eb", "#60a5fa", "#818cf8", "#f59e42", "#f43f5e"];
    return (
        <svg viewBox="0 0 120 120" width={120} height={120} className="mx-auto">
            {data.map((d, i) => {
                const start = acc;
                const angle = (d.count / total) * 360;
                acc += angle;
                const x1 = 60 + 50 * Math.cos((Math.PI * (start - 90)) / 180);
                const y1 = 60 + 50 * Math.sin((Math.PI * (start - 90)) / 180);
                const x2 =
                    60 + 50 * Math.cos((Math.PI * (start + angle - 90)) / 180);
                const y2 =
                    60 + 50 * Math.sin((Math.PI * (start + angle - 90)) / 180);
                const large = angle > 180 ? 1 : 0;
                const path = `M60,60 L${x1},${y1} A50,50 0 ${large} 1 ${x2},${y2} Z`;
                return (
                    <path
                        key={d.event_type}
                        d={path}
                        fill={colors[i % colors.length]}
                    >
                        <title>
                            {d.event_type}: {d.count}
                        </title>
                    </path>
                );
            })}
            <circle cx={60} cy={60} r={30} fill="#fff" />
            <text x={60} y={65} textAnchor="middle" fontSize={14} fill="#222">
                Top Types
            </text>
        </svg>
    );
}

export default function AdminAnalytics({ auth, summary = {}, analytics = {} }) {
    const monthly = (analytics.monthly || []).slice().reverse();
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analytics" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-blue-700">
                            Analytics Overview
                        </h2>
                        <Link
                            href={route("admin")}
                            className="text-blue-600 hover:underline text-sm font-semibold"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-400">
                            <div className="text-xs text-gray-500 mb-1">
                                Total Reservations
                            </div>
                            <div className="text-3xl font-bold text-blue-700">
                                {summary.total ?? "--"}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-400">
                            <div className="text-xs text-gray-500 mb-1">
                                Approved
                            </div>
                            <div className="text-3xl font-bold text-blue-700">
                                {summary.approved ?? "--"}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-400">
                            <div className="text-xs text-gray-500 mb-1">
                                Revenue
                            </div>
                            <div className="text-3xl font-bold text-blue-700">
                                ${Number(summary.revenue ?? 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-400">
                            <div className="text-xs text-gray-500 mb-1">
                                Approval Rate
                            </div>
                            <div className="text-3xl font-bold text-blue-700">
                                {summary.approval_rate ?? 0}%
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-white rounded-2xl shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold text-slate-800">
                                    Monthly Reservations
                                </h4>
                                <span className="text-xs text-gray-500">
                                    Last 6 months
                                </span>
                            </div>
                            <BarChart data={monthly} />
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                            <h4 className="text-lg font-bold text-slate-800 mb-2">
                                Top Event Types
                            </h4>
                            <PieChart data={analytics.top_event_types} />
                            <ul className="mt-4 w-full">
                                {(analytics.top_event_types || []).map(
                                    (t, i) => (
                                        <li
                                            key={t.event_type}
                                            className="flex items-center gap-2 text-sm mb-1"
                                        >
                                            <span
                                                className="inline-block w-3 h-3 rounded-full"
                                                style={{
                                                    background: [
                                                        "#2563eb",
                                                        "#60a5fa",
                                                        "#818cf8",
                                                        "#f59e42",
                                                        "#f43f5e",
                                                    ][i % 5],
                                                }}
                                            ></span>
                                            <span className="capitalize">
                                                {t.event_type}
                                            </span>
                                            <span className="ml-auto font-bold">
                                                {t.count}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
