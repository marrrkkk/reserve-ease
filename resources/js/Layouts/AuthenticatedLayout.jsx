import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    ChevronDown,
    Menu,
    X,
    Calendar,
    Package,
    User,
    CreditCard,
    Bell,
    Heart,
    MessageCircle,
    LayoutDashboard,
    Users,
    BarChart,
    Shield,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <nav className="border-b border-amber-200 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-2"
                                >
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-amber-600" />
                                    <span className="text-xl font-bold text-slate-800">
                                        Reserve
                                        <span className="text-amber-600">
                                            Ease
                                        </span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user.is_admin ? (
                                    <NavLink
                                        href={route("admin")}
                                        active={
                                            route().current("admin") &&
                                            !route().current("admin.*")
                                        }
                                        className="inline-flex items-center space-x-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                        className="inline-flex items-center space-x-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </NavLink>
                                )}

                                {user.is_admin ? (
                                    // Admin Navigation
                                    <>
                                        <NavLink
                                            href={route("admin.reservations")}
                                            active={route().current(
                                                "admin.reservations*"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>Reservations</span>
                                        </NavLink>

                                        <NavLink
                                            href={route("admin.users")}
                                            active={route().current(
                                                "admin.users*"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Users</span>
                                        </NavLink>

                                        <NavLink
                                            href={route("admin.analytics")}
                                            active={route().current(
                                                "admin.analytics*"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <BarChart className="w-4 h-4" />
                                            <span>Analytics</span>
                                        </NavLink>

                                        <NavLink
                                            href={route("admin.payments")}
                                            active={route().current(
                                                "admin.payments*"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            <span>Payments</span>
                                        </NavLink>
                                    </>
                                ) : (
                                    // Regular User Navigation
                                    <>
                                        <NavLink
                                            href={route("packages.index")}
                                            active={route().current(
                                                "packages*"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <Package className="w-4 h-4" />
                                            <span>Packages</span>
                                        </NavLink>

                                        <NavLink
                                            href={route("reservations.index")}
                                            active={route().current(
                                                "reservations.index"
                                            )}
                                            className="inline-flex items-center space-x-2"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>My Reservations</span>
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></span>
                                </button>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-lg border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-500 transition duration-150 ease-in-out hover:text-slate-700 hover:bg-amber-50 focus:outline-none focus:bg-amber-50 active:bg-amber-50"
                                            >
                                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                                                    <span className="text-amber-600 font-semibold text-sm">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    {user.name}
                                                    {user.is_admin && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <ChevronDown className="ms-2 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="flex items-center"
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="flex items-center"
                                        >
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Billing & Payments
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="flex items-center"
                                        >
                                            <Bell className="w-4 h-4 mr-2" />
                                            Notifications
                                        </Dropdown.Link>
                                        <div className="border-t border-amber-100"></div>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition duration-150 ease-in-out hover:bg-amber-100 hover:text-amber-500 focus:bg-amber-100 focus:text-amber-500 focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2 bg-white border-t border-amber-200">
                        {user.is_admin ? (
                            <ResponsiveNavLink
                                href={route("admin")}
                                active={
                                    route().current("admin") &&
                                    !route().current("admin.*")
                                }
                                className="flex items-center space-x-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </ResponsiveNavLink>
                        ) : (
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="flex items-center space-x-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Dashboard</span>
                            </ResponsiveNavLink>
                        )}

                        {user.is_admin ? (
                            // Admin Mobile Navigation
                            <>
                                <ResponsiveNavLink
                                    href={route("admin.reservations")}
                                    active={route().current(
                                        "admin.reservations*"
                                    )}
                                    className="flex items-center space-x-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Reservations</span>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("admin.users")}
                                    active={route().current("admin.users*")}
                                    className="flex items-center space-x-2"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Users</span>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("admin.analytics")}
                                    active={route().current("admin.analytics*")}
                                    className="flex items-center space-x-2"
                                >
                                    <BarChart className="w-4 h-4" />
                                    <span>Analytics</span>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("admin.payments")}
                                    active={route().current("admin.payments*")}
                                    className="flex items-center space-x-2"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Payments</span>
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            // Regular User Mobile Navigation
                            <>
                                <ResponsiveNavLink
                                    href={route("packages.index")}
                                    active={route().current("packages*")}
                                    className="flex items-center space-x-2"
                                >
                                    <Package className="w-4 h-4" />
                                    <span>Packages</span>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("reservations.index")}
                                    active={route().current(
                                        "reservations.index"
                                    )}
                                    className="flex items-center space-x-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>My Reservations</span>
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-amber-200 bg-amber-50 pb-1 pt-4">
                        <div className="px-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-base font-medium text-slate-800 flex items-center">
                                        {user.name}
                                        {user.is_admin && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Billing & Payments
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Notifications
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-200">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
