import { CheckCircle } from "lucide-react";
import React from "react";

export default function StudentVerificationSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
                Student verification
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Verified until{" "}
                <span className="text-blue-500">June 2027</span> using your{" "}
                <span className="text-blue-500">.edu.ph email</span> address.
            </p>

            <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                </span>
            </div>
        </div>
    );
}
