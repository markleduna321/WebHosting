import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { CheckCircle, LoaderCircle, MailCheck, MailWarning } from "lucide-react";
import React from "react";

export default function VerifyEmail({ status }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm({});

    const linkSent = status === "verification-link-sent";

    const resend = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <div className="flex min-h-screen w-full font-sans antialiased">
            <Head title="Verify Email" />

            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white relative">
                <div className="flex items-center gap-2">
                    <img
                        src="/images/asura-logo.png"
                        alt="AsuraTechHost Logo"
                        className="w-9 h-9 object-contain"
                    />
                    <span className="text-xl font-bold tracking-wide">
                        Asura<span className="text-blue-500">Host</span>
                    </span>
                </div>

                <div className="max-w-xl space-y-6 my-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                        One last step to secure your account.
                    </h1>

                    <ul className="space-y-3 text-slate-300 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                Verifying proves the address is yours and keeps
                                your sites recoverable
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                Billing receipts and deployment alerts go to
                                this address
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="text-xs text-slate-500">
                    © 2026 AsuraTech Host. All rights reserved.
                </div>
            </div>

            <div className="flex w-full lg:w-2/5 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <MailWarning aria-hidden="true" className="h-6 w-6" />
                    </span>

                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                        Verify your email address
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        We sent a verification link to{" "}
                        <span className="font-semibold text-slate-700">
                            {auth?.user?.email ?? "your email address"}
                        </span>
                        . Click the link to finish setting up your account.
                    </p>

                    {linkSent && (
                        <div
                            role="status"
                            className="mt-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                        >
                            <MailCheck
                                aria-hidden="true"
                                className="mt-0.5 h-4 w-4 shrink-0"
                            />
                            <span>
                                A new verification link has been sent to your
                                email address.
                            </span>
                        </div>
                    )}

                    <form onSubmit={resend} className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            {processing && (
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="h-4 w-4 animate-spin"
                                />
                            )}
                            {processing
                                ? "Sending…"
                                : "Resend verification email"}
                        </button>
                    </form>

                    <div className="mt-4 flex items-center justify-between text-sm">
                        <Link
                            href="/dashboard"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Continue to dashboard
                        </Link>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            type="button"
                            className="font-medium text-slate-500 hover:text-slate-700"
                        >
                            Log out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
