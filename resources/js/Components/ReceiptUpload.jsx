import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Upload, FileImage, X, CheckCircle, AlertCircle } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import InputError from "./InputError";

export default function ReceiptUpload({ payment, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        receipt_file: null,
    });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "application/pdf",
            ];
            if (!validTypes.includes(file.type)) {
                alert(
                    "Invalid file type. Please upload a JPG, PNG, or PDF file."
                );
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert("File is too large. Maximum size is 5MB.");
                return;
            }

            setData("receipt_file", file);

            // Create preview for images
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview("pdf");
            }
        }
    };

    const handleRemoveFile = () => {
        setData("receipt_file", null);
        setPreview(null);
        setUploadProgress(0);
        // Reset file input
        const fileInput = document.getElementById("receipt-file-input");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.receipt_file) {
            alert("Please select a file to upload.");
            return;
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        post(route("payment.upload-receipt", payment.id), {
            forceFormData: true,
            onSuccess: () => {
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    reset();
                    setPreview(null);
                    setUploadProgress(0);
                }, 500);
            },
            onError: () => {
                clearInterval(progressInterval);
                setUploadProgress(0);
            },
        });
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 text-blue-600 mr-2" />
                Upload Payment Receipt
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Input Area */}
                {!preview ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                            id="receipt-file-input"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <label
                            htmlFor="receipt-file-input"
                            className="cursor-pointer"
                        >
                            <FileImage className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-slate-700 mb-1">
                                Click to upload receipt
                            </p>
                            <p className="text-xs text-slate-500">
                                JPG, PNG, or PDF (max 5MB)
                            </p>
                        </label>
                    </div>
                ) : (
                    <div className="border border-slate-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                                <FileImage className="w-8 h-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        {data.receipt_file?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(
                                            data.receipt_file?.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview */}
                        {preview === "pdf" ? (
                            <div className="bg-slate-100 rounded p-8 text-center">
                                <FileImage className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">
                                    PDF Preview Not Available
                                </p>
                            </div>
                        ) : (
                            <img
                                src={preview}
                                alt="Receipt preview"
                                className="w-full h-auto rounded border border-slate-200"
                            />
                        )}

                        {/* Upload Progress */}
                        {processing && uploadProgress > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-600">
                                        Uploading...
                                    </span>
                                    <span className="text-xs text-slate-600">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Validation Errors */}
                <InputError message={errors.receipt_file} />

                {/* Upload Instructions */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-xs text-blue-700">
                            <p className="font-medium mb-1">
                                Upload Requirements:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li>File must be JPG, PNG, or PDF format</li>
                                <li>Maximum file size: 5MB</li>
                                <li>
                                    Ensure receipt shows transaction details
                                    clearly
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                {preview && (
                    <PrimaryButton
                        type="submit"
                        disabled={processing || !data.receipt_file}
                        className="w-full justify-center"
                    >
                        {processing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Receipt
                            </>
                        )}
                    </PrimaryButton>
                )}

                {/* Success Message */}
                {uploadProgress === 100 && !processing && (
                    <div className="flex items-center justify-center text-green-600 text-sm">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Receipt uploaded successfully!
                    </div>
                )}
            </form>
        </div>
    );
}
