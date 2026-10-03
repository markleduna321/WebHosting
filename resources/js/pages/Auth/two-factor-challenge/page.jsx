import { Head, Link, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

export default function Page({ email, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
    });
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const [resending, setResending] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const submit = (e) => {
        e.preventDefault();
        post(route("two-factor.verify"), {
            onError: () => {
                reset("code");
                inputRef.current?.focus();
            },
        });
    };

    const resend = () => {
        router.post(
            route("two-factor.resend"),
            {},
            {
                preserveScroll: true,
                onStart: () => setResending(true),
                onFinish: () => {
                    setResending(false);
                    setCooldown(RESEND_COOLDOWN_SECONDS);
                    inputRef.current?.focus();
                },
            },
        );
    };

    const handleChange = (value) => {
        setData("code", value.replace(/\D/g, "").slice(0, 6));
    };

    return (
        <div className="flex min-h-screen w-full font-sans antialiased">
            <Head title="Verify it's you" />

            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white">
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

                <div className="max-w-xl space-y-4 my-auto">
                    <ShieldCheck className="h-12 w-12 text-blue-500" />
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                        One more step to keep your sites safe.
                    </h1>
                    <p className="text-slate-300">
                        Two-factor authentication is on for this account, so
                        we confirm it's really you before signing in.
                    </p>
                </div>

                <div className="text-xs text-slate-500">
                    © 2026 AsuraTech Host. All rights reserved.
                </div>
            </div>

            <div className="flex w-full lg:w-2/5 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-xl">
                    <Link
                        href={route("login")}
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to login
                    </Link>

                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-black">
                            Check your email
                        </h2>
                        <p className="mt-2 text-base text-slate-500">
                            We sent a 6-digit code to{" "}
                            <span className="font-medium text-slate-700">
                                {email}
                            </span>
                            . It expires in 10 minutes.
                        </p>
                    </div>

                    {status && (
                        <div
                            role="status"
                            className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                        >
                            {status}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={submit} noValidate>
                        <div>
                            <label
                                htmlFor="code"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Verification code
                            </label>
                            <input
                                ref={inputRef}
                                id="code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={data.code}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="000000"
                                aria-invalid={Boolean(errors.code)}
                                aria-describedby={
                                    errors.code ? "code-error" : undefined
                                }
                                className={`w-full rounded-lg border bg-white px-4 py-3.5 text-center font-mono text-2xl tracking-[0.5em] text-slate-900 placeholder-slate-300 shadow-sm focus:outline-none focus:ring-1 ${
                                    errors.code
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                }`}
                            />
                            {errors.code && (
                                <p
                                    id="code-error"
                                    className="mt-1.5 text-xs text-red-600"
                                >
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.code.length !== 6}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing && (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            )}
                            {processing ? "Verifying..." : "Verify and log in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Didn't get the code?{" "}
                        <button
                            type="button"
                            onClick={resend}
                            disabled={cooldown > 0 || resending}
                            className="font-semibold text-blue-600 hover:text-blue-500 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                            {resending
                                ? "Sending..."
                                : cooldown > 0
                                  ? `Resend in ${cooldown}s`
                                  : "Resend code"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
