import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export default function Page() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: true,
    });
    const [show_password, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
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
                    © 2026 AsuraTech   Host. All rights reserved.
                </div>
            </div>

            {/* Right Login Panel */}
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
                            Log in to Asura Host
                        </h2>
                        <p className="mt-2 text-base text-slate-500">
                            Manage your websites, domains, and deployments.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
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

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={show_password ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-11 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!show_password)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    aria-label={
                                        show_password
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    tabIndex={-1}
                                >
                                    {show_password ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2.5 block text-sm text-slate-600 select-none"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Primary Action Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Registration Footer */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-500"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}