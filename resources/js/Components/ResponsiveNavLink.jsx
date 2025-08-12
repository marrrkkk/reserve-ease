import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? "border-amber-400 bg-amber-50 text-amber-700 focus:border-amber-700 focus:bg-amber-100 focus:text-amber-800"
                    : "border-transparent text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-slate-800 focus:border-amber-300 focus:bg-amber-50 focus:text-slate-800"
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
