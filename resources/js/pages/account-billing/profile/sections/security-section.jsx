import React from "react";
import Button from "@/components/ui/Button";

export default function SecuritySection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">Security</h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Two-factor authentication is off. Turn it on to protect your
                deployments.
            </p>

            <div className="mt-3">
                <Button
                    variant="light"
                    size="sm"
                    outlined
                    className="rounded-lg"
                >
                    Enable 2FA
                </Button>
            </div>
        </div>
    );
}
