import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function CreateAccountSection() {
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
        <div className="mx-auto w-full max-w-xl">
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
            </Link>

            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-black">
                    Create your student account
                </h2>
                <p className="mt-2 text-base text-slate-500">
                    Verified students get discounted hosting on every plan.
                </p>
            </div>

            <form className="space-y-8" onSubmit={submit}>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Maria Clara Santos"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="you@university.edu.ph"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                    e.target.value,
                                )
                            }
                            placeholder="Repeat password"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                        School / University (optional)
                    </label>
                    <input
                        type="text"
                        value={data.school}
                        onChange={(e) => setData("school", e.target.value)}
                        placeholder="University of the Philippines Diliman"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.school && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.school}
                        </p>
                    )}
                </div>

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

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? "Creating account..." : "Create Student Account"}
                </button>
            </form>

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
    );
}
