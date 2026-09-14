import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle, MailWarning } from "lucide-react";
import { message } from "antd";
import React from "react";

export default function VerifyEmailBanner() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { post, processing, errors } = useForm({});

    if (!user || user.has_verified_email) {
        return null;
    }

    const resend = () => {
        post(route("verification.send"), {
            preserveScroll: true,
            onSuccess: () =>
                message.success(
                    "Verification email sent. Check your inbox.",
                    4,
                ),
            onError: () =>
                message.error("Could not send the email. Please try again.", 4),
        });
    };

    return (
        <div
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <MailWarning
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-amber-900">
                            Verify your email address
                        </p>
                        <p className="mt-0.5 text-sm text-amber-800">
                            We sent a link to{" "}
                            <span className="font-semibold">{user.email}</span>.
                            Verify it to secure your account and keep your sites
                            recoverable.
                        </p>
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={resend}
                    disabled={processing}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
                >
                    {processing && (
                        <LoaderCircle
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin"
                        />
                    )}
                    {processing ? "Sending…" : "Resend verification email"}
                </button>
            </div>
        </div>
    );
}
