import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import React from "react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="flex min-h-screen w-full font-sans antialiased">
            <Head title="Forgot Password" />
            
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white relative">
                <div className="flex items-center gap-1">
                    <Link href="/" className="flex items-center space-x-2.5 cursor-pointer">
                        <img src="/images/caleho.png" alt="CALEHO Host" className="w-[145px] sm:w-[155px] lg:w-[160px] h-auto object-contain block transition-transform duration-200 group-hover:scale-[1.02]" />
                    </Link>
                </div>
                <div className="max-w-xl space-y-6 my-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                        Hosting that keeps up with your semester.
                    </h1>
                    <ul className="space-y-3 text-slate-300 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Free SSL and an caleho.cloud subdomain on every plan</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Deploy from Git or upload files — no server setup</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Verified student pricing starting at ₱129/month</span>
                        </li>
                    </ul>
                </div>
                <div className="text-xs text-slate-500">
                    © 2026 AsuraTech Host. All rights reserved.
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex w-full lg:w-2/5 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-xl">
                    <Link
                        href={route("login")}
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to login
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-black">
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-base text-slate-500">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 border border-green-200">
                            {status}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="you@university.edu.ph"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? "Sending Reset Link..." : "Email Password Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
