import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "border-amber-400 text-slate-900 focus:border-amber-700"
                    : "border-transparent text-slate-500 hover:border-amber-300 hover:text-slate-700 focus:border-amber-300 focus:text-slate-700 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
