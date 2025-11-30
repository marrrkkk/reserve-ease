import { useState } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function CustomerInformationForm({ data, setData, errors }) {
    const [clientErrors, setClientErrors] = useState({});

    // Client-side validation functions
    const validateFullName = (value) => {
        if (!value || value.trim() === "") {
            return "Full name is required.";
        }
        if (value.length > 255) {
            return "Full name must not exceed 255 characters.";
        }
        return null;
    };

    const validateEmail = (value) => {
        if (!value || value.trim() === "") {
            return "Email address is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "Please enter a valid email address.";
        }
        if (value.length > 255) {
            return "Email must not exceed 255 characters.";
        }
        return null;
    };

    const validateContactNumber = (value) => {
        if (!value || value.trim() === "") {
            return "Contact number is required.";
        }
        const phoneRegex = /^[0-9]{10,15}$/;
        const cleanedValue = value.replace(/[\s\-()]/g, "");
        if (!phoneRegex.test(cleanedValue)) {
            return "Contact number must be 10-15 digits.";
        }
        return null;
    };

    const validateAddress = (value) => {
        if (!value || value.trim() === "") {
            return "Address is required.";
        }
        if (value.length > 1000) {
            return "Address must not exceed 1000 characters.";
        }
        return null;
    };

    // Handle field changes with validation
    const handleFieldChange = (field, value, validator) => {
        setData(field, value);

        // Validate on change
        const error = validator(value);
        setClientErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    };

    // Get the error message to display (prioritize server errors over client errors)
    const getErrorMessage = (field) => {
        return errors[field] || clientErrors[field];
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Customer Information
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                    Please provide your contact details so we can reach you
                    about your reservation.
                </p>
            </div>

            {/* Full Name */}
            <div>
                <InputLabel htmlFor="customer_full_name" value="Full Name *" />
                <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="customer_full_name"
                        type="text"
                        value={data.customer_full_name || ""}
                        onChange={(e) =>
                            handleFieldChange(
                                "customer_full_name",
                                e.target.value,
                                validateFullName
                            )
                        }
                        onBlur={(e) =>
                            handleFieldChange(
                                "customer_full_name",
                                e.target.value,
                                validateFullName
                            )
                        }
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                            getErrorMessage("customer_full_name")
                                ? "border-red-500"
                                : "border-slate-300"
                        }`}
                        required
                        maxLength={255}
                    />
                </div>
                <InputError
                    message={getErrorMessage("customer_full_name")}
                    className="mt-2"
                />
            </div>

            {/* Email */}
            <div>
                <InputLabel htmlFor="customer_email" value="Email Address *" />
                <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="customer_email"
                        type="email"
                        value={data.customer_email || ""}
                        onChange={(e) =>
                            handleFieldChange(
                                "customer_email",
                                e.target.value,
                                validateEmail
                            )
                        }
                        onBlur={(e) =>
                            handleFieldChange(
                                "customer_email",
                                e.target.value,
                                validateEmail
                            )
                        }
                        placeholder="your.email@example.com"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                            getErrorMessage("customer_email")
                                ? "border-red-500"
                                : "border-slate-300"
                        }`}
                        required
                        maxLength={255}
                    />
                </div>
                <InputError
                    message={getErrorMessage("customer_email")}
                    className="mt-2"
                />
            </div>

            {/* Contact Number */}
            <div>
                <InputLabel
                    htmlFor="customer_contact_number"
                    value="Contact Number *"
                />
                <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        id="customer_contact_number"
                        type="tel"
                        value={data.customer_contact_number || ""}
                        onChange={(e) =>
                            handleFieldChange(
                                "customer_contact_number",
                                e.target.value,
                                validateContactNumber
                            )
                        }
                        onBlur={(e) =>
                            handleFieldChange(
                                "customer_contact_number",
                                e.target.value,
                                validateContactNumber
                            )
                        }
                        placeholder="09XX XXX XXXX"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                            getErrorMessage("customer_contact_number")
                                ? "border-red-500"
                                : "border-slate-300"
                        }`}
                        required
                    />
                </div>
                <InputError
                    message={getErrorMessage("customer_contact_number")}
                    className="mt-2"
                />
            </div>

            {/* Address */}
            <div>
                <InputLabel htmlFor="customer_address" value="Address *" />
                <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                        id="customer_address"
                        value={data.customer_address || ""}
                        onChange={(e) =>
                            handleFieldChange(
                                "customer_address",
                                e.target.value,
                                validateAddress
                            )
                        }
                        onBlur={(e) =>
                            handleFieldChange(
                                "customer_address",
                                e.target.value,
                                validateAddress
                            )
                        }
                        placeholder="Enter your complete address"
                        rows={3}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                            getErrorMessage("customer_address")
                                ? "border-red-500"
                                : "border-slate-300"
                        }`}
                        required
                        maxLength={1000}
                    />
                </div>
                <InputError
                    message={getErrorMessage("customer_address")}
                    className="mt-2"
                />
            </div>
        </div>
    );
}
