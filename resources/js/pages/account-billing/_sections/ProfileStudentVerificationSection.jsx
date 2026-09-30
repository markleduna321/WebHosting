import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { usePage } from "@inertiajs/react";

export default function ProfileStudentVerificationSection() {
    const { profile } = usePage().props;

    const isVerified = !!profile?.email_verified_at;
    const email = profile?.email ?? "";
    const isEduEmail = email.endsWith(".edu") || email.endsWith(".edu.ph") || email.includes(".edu.");

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
                Student verification
            </h2>

            {isVerified ? (
                <>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Email verified on{" "}
                        <span className="text-blue-500">
                            {new Date(profile.email_verified_at).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        {isEduEmail && (
                            <>
                                {" "}using your{" "}
                                <span className="text-blue-500">.edu email</span>{" "}
                                address.
                            </>
                        )}
                    </p>
                    <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Your email has not been verified yet. Please check your
                        inbox for the verification link.
                    </p>
                    <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-600">
                            <XCircle className="w-3.5 h-3.5" />
                            Not verified
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
