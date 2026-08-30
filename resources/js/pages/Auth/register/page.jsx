import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import React from "react";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        school: "",
        agree_terms: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <div className="flex min-h-screen w-full font-sans antialiased">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white relative">
                {/* Brand Header */}
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

                {/* Hero Content */}
                <div className="max-w-xl space-y-6 my-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                        Hosting that keeps up with your semester.
                    </h1>

                    <ul className="space-y-3 text-slate-300 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                Free SSL and an asuratechhost.app subdomain on
                                every plan
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                Deploy from Git or upload files — no server
                                setup
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                Verified student pricing starting at ₱49/month
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Footer Copyright */}
                <div className="text-xs text-slate-500">
                    © 2026 AsuraTech Host. All rights reserved.
                </div>
            </div>

            {/* Right Register Panel */}
            <div className="flex w-full lg:w-2/5 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to home
                    </Link>

                    {/* Form Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-black">
                            Create your student account
                        </h2>
                        <p className="mt-2 text-base text-slate-500">
                            Verified students get discounted hosting on every
                            plan.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-6" onSubmit={submit}>
                        {/* Selected Plan */}
                        <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-5 py-4">
                            <div>
                                <p className="text-sm font-medium text-blue-600">
                                    Selected plan
                                </p>
                                <p className="text-base font-semibold text-slate-900">
                                    Student Pro — ₱199/month
                                </p>
                            </div>
                            <a
                                href="#"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Change
                            </a>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Maria Clara Santos"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Student Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="you@university.edu.ph"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="At least 8 characters"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Repeat password"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                School / University
                            </label>
                            <input
                                type="text"
                                value={data.school}
                                onChange={(e) =>
                                    setData("school", e.target.value)
                                }
                                placeholder="University of the Philippines Diliman"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.school && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.school}
                                </p>
                            )}
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-start">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                checked={data.agree_terms}
                                onChange={(e) =>
                                    setData("agree_terms", e.target.checked)
                                }
                                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="agree-terms"
                                className="ml-2.5 block text-sm text-slate-600 select-none"
                            >
                                I agree to the{" "}
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Privacy Policy
                                </a>
                                .
                            </label>
                        </div>

                        {/* Primary Action Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing
                                ? "Creating account..."
                                : "Create Student Account"}
                        </button>
                    </form>

                    {/* Login Footer */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-blue-600 hover:text-blue-500"
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

