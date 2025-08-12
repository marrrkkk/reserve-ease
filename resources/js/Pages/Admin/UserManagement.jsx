import React, { useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Users,
    User as UserIcon,
    Mail,
    Shield,
    Edit3,
    Trash2,
    UserPlus,
    Check,
    X,
    Crown,
    AlertTriangle,
} from "lucide-react";

// Simple Toast component
function Toast({ message, type = "success", onClose }) {
    if (!message) return null;
    const bgColor =
        type === "success"
            ? "bg-green-600"
            : type === "error"
            ? "bg-red-600"
            : "bg-blue-600";
    return (
        <div
            className={`fixed top-5 right-5 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in`}
        >
            {message}
            <button
                className="ml-4 text-white font-bold hover:text-gray-200"
                onClick={onClose}
            >
                &times;
            </button>
        </div>
    );
}

// Confirmation Modal component
function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    type = "danger",
}) {
    if (!show) return null;
    const buttonColor =
        type === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[400px] max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                    <h3 className="text-lg font-bold text-slate-800">
                        {title}
                    </h3>
                </div>
                <p className="text-slate-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${buttonColor} text-white font-medium transition-colors`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// User Avatar component
function UserAvatar({ name, isAdmin = false }) {
    if (!name)
        return (
            <span className="inline-block w-10 h-10 rounded-full bg-slate-200" />
        );

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const bgColor = isAdmin ? "bg-amber-500" : "bg-blue-500";

    return (
        <div className="relative">
            <span
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${bgColor} text-white font-bold text-sm`}
            >
                {initials}
            </span>
            {isAdmin && (
                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 fill-current" />
            )}
        </div>
    );
}

// Role Badge component
function RoleBadge({ role, isCurrentUser = false }) {
    const isAdmin = role === "admin" || role === true;
    const badgeClass = isAdmin
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-blue-100 text-blue-800 border-blue-200";

    return (
        <div className="flex items-center space-x-2">
            <span
                className={`px-3 py-1 rounded-full border text-xs font-semibold ${badgeClass} flex items-center`}
            >
                {isAdmin && <Shield className="w-3 h-3 mr-1" />}
                {isAdmin ? "Admin" : "User"}
            </span>
            {isCurrentUser && (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    You
                </span>
            )}
        </div>
    );
}

export default function UserManagement({ auth, users, flash }) {
    const { patch, post, delete: destroy, processing } = useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "" });
    const [toast, setToast] = useState({
        message: flash?.success || flash?.error || "",
        type: flash?.success ? "success" : "error",
    });
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        type: "",
        userId: null,
        userName: "",
    });

    // Show toast for flash messages
    React.useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: "success" });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: "error" });
        }
    }, [flash]);

    const startEdit = (user) => {
        setEditingUser(user.id);
        setEditForm({
            name: user.name || "",
            email: user.email || "",
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: "", email: "" });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const submitEdit = (id) => {
        patch(route("admin.users.update", id), editForm, {
            onSuccess: () => {
                setToast({
                    message: "User updated successfully!",
                    type: "success",
                });
                cancelEdit();
            },
            onError: () => {
                setToast({ message: "Failed to update user.", type: "error" });
            },
        });
    };

    const handleAction = (type, userId, userName) => {
        if (type === "delete") {
            setConfirmModal({
                show: true,
                type: "delete",
                userId,
                userName,
            });
        } else if (type === "promote") {
            setConfirmModal({
                show: true,
                type: "promote",
                userId,
                userName,
            });
        }
    };

    const confirmAction = () => {
        const { type, userId } = confirmModal;

        if (type === "delete") {
            destroy(route("admin.users.destroy", userId), {
                onSuccess: () => {
                    setToast({
                        message: "User deleted successfully!",
                        type: "success",
                    });
                    setConfirmModal({
                        show: false,
                        type: "",
                        userId: null,
                        userName: "",
                    });
                },
                onError: () => {
                    setToast({
                        message: "Failed to delete user.",
                        type: "error",
                    });
                    setConfirmModal({
                        show: false,
                        type: "",
                        userId: null,
                        userName: "",
                    });
                },
            });
        } else if (type === "promote") {
            post(
                route("admin.users.promote", userId),
                {},
                {
                    onSuccess: () => {
                        setToast({
                            message: "User promoted to admin successfully!",
                            type: "success",
                        });
                        setConfirmModal({
                            show: false,
                            type: "",
                            userId: null,
                            userName: "",
                        });
                    },
                    onError: () => {
                        setToast({
                            message: "Failed to promote user.",
                            type: "error",
                        });
                        setConfirmModal({
                            show: false,
                            type: "",
                            userId: null,
                            userName: "",
                        });
                    },
                }
            );
        }
    };

    const closeModal = () => {
        setConfirmModal({ show: false, type: "", userId: null, userName: "" });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-blue-700 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "success" })}
            />

            <ConfirmModal
                show={confirmModal.show}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={
                    confirmModal.type === "delete"
                        ? "Delete User"
                        : "Promote User"
                }
                message={
                    confirmModal.type === "delete"
                        ? `Are you sure you want to delete "${confirmModal.userName}"? This action cannot be undone.`
                        : `Are you sure you want to promote "${confirmModal.userName}" to admin? They will have full administrative access.`
                }
                confirmText={
                    confirmModal.type === "delete" ? "Delete" : "Promote"
                }
                type={confirmModal.type === "delete" ? "danger" : "warning"}
            />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <UserIcon className="w-6 h-6 text-blue-600 mr-2" />
                                System Users
                            </h3>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-slate-500">
                                    Total: {users.length} users
                                </span>
                                <span className="text-sm text-slate-500">
                                    Admins:{" "}
                                    {
                                        users.filter(
                                            (u) =>
                                                u.is_admin || u.role === "admin"
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>

                        {users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-blue-100 rounded-lg">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-6 py-4 border-b text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 border-b text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 border-b text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 border-b text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-4 border-b text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-blue-50">
                                        {users.map((user) => {
                                            const isCurrentUser =
                                                auth.user.id === user.id;
                                            const isAdmin =
                                                user.is_admin ||
                                                user.role === "admin";
                                            const isEditing =
                                                editingUser === user.id;

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-blue-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 border-b">
                                                        <div className="flex items-center space-x-3">
                                                            <UserAvatar
                                                                name={user.name}
                                                                isAdmin={
                                                                    isAdmin
                                                                }
                                                            />
                                                            <div>
                                                                {isEditing ? (
                                                                    <input
                                                                        name="name"
                                                                        value={
                                                                            editForm.name
                                                                        }
                                                                        onChange={
                                                                            handleEditChange
                                                                        }
                                                                        className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Full name"
                                                                    />
                                                                ) : (
                                                                    <div className="font-medium text-slate-900">
                                                                        {user.name ||
                                                                            "No name"}
                                                                    </div>
                                                                )}
                                                                <div className="text-sm text-slate-500">
                                                                    ID:{" "}
                                                                    {user.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 border-b">
                                                        {isEditing ? (
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                value={
                                                                    editForm.email
                                                                }
                                                                onChange={
                                                                    handleEditChange
                                                                }
                                                                className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Email address"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center text-slate-900">
                                                                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                                                                {user.email}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 border-b">
                                                        <RoleBadge
                                                            role={
                                                                user.is_admin ||
                                                                user.role
                                                            }
                                                            isCurrentUser={
                                                                isCurrentUser
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 border-b text-sm text-slate-500">
                                                        {user.created_at
                                                            ? new Date(
                                                                  user.created_at
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </td>
                                                    <td className="px-6 py-4 border-b">
                                                        <div className="flex items-center space-x-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            submitEdit(
                                                                                user.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                                                                    >
                                                                        <Check className="w-4 h-4 mr-1" />
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={
                                                                            cancelEdit
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm leading-4 font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                                                    >
                                                                        <X className="w-4 h-4 mr-1" />
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            startEdit(
                                                                                user
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                                                    >
                                                                        <Edit3 className="w-4 h-4 mr-1" />
                                                                        Edit
                                                                    </button>

                                                                    {!isAdmin &&
                                                                        !isCurrentUser && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleAction(
                                                                                        "promote",
                                                                                        user.id,
                                                                                        user.name
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    processing
                                                                                }
                                                                                className="inline-flex items-center px-3 py-2 border border-amber-300 text-sm leading-4 font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                                                                            >
                                                                                <UserPlus className="w-4 h-4 mr-1" />
                                                                                Promote
                                                                            </button>
                                                                        )}

                                                                    {!isCurrentUser && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    "delete",
                                                                                    user.id,
                                                                                    user.name
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600 mb-2">
                                    No Users Found
                                </h4>
                                <p className="text-slate-500">
                                    No users are currently registered in the
                                    system.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
