import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Check, Eye, EyeOff, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import PasswordChecklist from "../../../../components/ui/PasswordChecklist";
import { evaluatePassword } from "../../../../utils/passwordRules";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data) {
    const nextErrors = {};

    if (!data.name.trim()) {
        nextErrors.name = "Full name is required.";
    } else if (data.name.trim().length > 255) {
        nextErrors.name = "Full name may not be longer than 255 characters.";
    }

    if (!data.email.trim()) {
        nextErrors.email = "Student email is required.";
    } else if (!EMAIL_PATTERN.test(data.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
    }

    if (!data.password) {
        nextErrors.password = "Password is required.";
    } else if (!evaluatePassword(data.password).isValid) {
        nextErrors.password = "Password does not meet all requirements below.";
    }

    if (!data.password_confirmation) {
        nextErrors.password_confirmation = "Please confirm your password.";
    } else if (data.password !== data.password_confirmation) {
        nextErrors.password_confirmation = "Passwords do not match.";
    }

    if (data.school.trim().length > 255) {
        nextErrors.school = "School name may not be longer than 255 characters.";
    }

    if (!data.agree_terms) {
        nextErrors.agree_terms =
            "You must agree to the Terms of Service and Privacy Policy.";
    }

    return nextErrors;
}

const inputBaseClass =
    "w-full rounded-lg border bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-1";

function inputClass(hasError, isValid = false) {
    if (hasError) {
        return `${inputBaseClass} border-red-400 focus:border-red-500 focus:ring-red-500`;
    }

    if (isValid) {
        return `${inputBaseClass} border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500`;
    }

    return `${inputBaseClass} border-slate-200 focus:border-blue-500 focus:ring-blue-500`;
}

export default function CreateAccountSection() {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        school: "",
        agree_terms: false,
    });

    const [touched, setTouched] = useState({});
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const clientErrors = useMemo(() => validateForm(data), [data]);
    const isFormValid = Object.keys(clientErrors).length === 0;

    // Server messages win over client hints so 422 responses are never masked.
    const errorFor = (field) =>
        errors[field] || (touched[field] ? clientErrors[field] : undefined);

    const passwordIsValid = evaluatePassword(data.password).isValid;
    const passwordsMatch =
        data.password.length > 0 &&
        data.password === data.password_confirmation;

    const handleChange = (field, value) => {
        setData(field, value);

        if (errors[field]) {
            clearErrors(field);
        }
    };

    const markTouched = (field) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    const submit = (e) => {
        e.preventDefault();

        setTouched({
            name: true,
            email: true,
            password: true,
            password_confirmation: true,
            school: true,
            agree_terms: true,
        });

        if (!isFormValid) return;

        post(route("register"), {
            onFinish: () => {
                setData("password", "");
                setData("password_confirmation", "");
                setTouched((prev) => ({
                    ...prev,
                    password: false,
                    password_confirmation: false,
                }));
            },
        });
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

            <form className="space-y-8" onSubmit={submit} noValidate>
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-2"
                    >
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => markTouched("name")}
                        placeholder="Maria Clara Santos"
                        autoComplete="name"
                        aria-invalid={Boolean(errorFor("name"))}
                        aria-describedby={
                            errorFor("name") ? "name-error" : undefined
                        }
                        className={inputClass(Boolean(errorFor("name")))}
                    />
                    {errorFor("name") && (
                        <p
                            id="name-error"
                            className="mt-1.5 text-xs text-red-600"
                        >
                            {errorFor("name")}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-2"
                    >
                        Student Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => markTouched("email")}
                        placeholder="you@university.edu.ph"
                        autoComplete="email"
                        aria-invalid={Boolean(errorFor("email"))}
                        aria-describedby={
                            errorFor("email") ? "email-error" : undefined
                        }
                        className={inputClass(Boolean(errorFor("email")))}
                    />
                    {errorFor("email") && (
                        <p
                            id="email-error"
                            className="mt-1.5 text-xs text-red-600"
                        >
                            {errorFor("email")}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => markTouched("password")}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errorFor("password"))}
                                aria-describedby="password-requirements"
                                className={`${inputClass(
                                    Boolean(errorFor("password")),
                                    passwordIsValid,
                                )} pr-11`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errorFor("password") && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errorFor("password")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirmation ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    handleChange(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                onBlur={() =>
                                    markTouched("password_confirmation")
                                }
                                placeholder="Repeat password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(
                                    errorFor("password_confirmation"),
                                )}
                                aria-describedby="password-match-status"
                                className={`${inputClass(
                                    Boolean(errors.password_confirmation) ||
                                        (data.password_confirmation.length >
                                            0 &&
                                            !passwordsMatch),
                                    passwordsMatch,
                                )} pr-11`}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmation((prev) => !prev)
                                }
                                aria-label={
                                    showConfirmation
                                        ? "Hide confirmation password"
                                        : "Show confirmation password"
                                }
                                aria-pressed={showConfirmation}
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {showConfirmation ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div
                            id="password-match-status"
                            role="status"
                            aria-live="polite"
                            className="mt-1.5 min-h-[1rem]"
                        >
                            {errors.password_confirmation ? (
                                <p className="text-xs text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            ) : data.password_confirmation.length > 0 ? (
                                passwordsMatch ? (
                                    <p className="flex items-center gap-1 text-xs text-emerald-600">
                                        <Check className="h-3.5 w-3.5 shrink-0" />
                                        Passwords match
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-1 text-xs text-red-600">
                                        <X className="h-3.5 w-3.5 shrink-0" />
                                        Passwords do not match
                                    </p>
                                )
                            ) : (
                                touched.password_confirmation && (
                                    <p className="text-xs text-red-600">
                                        {clientErrors.password_confirmation}
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div id="password-requirements" className="!mt-3">
                    <PasswordChecklist
                        password={data.password}
                        visible={
                            passwordFocused ||
                            data.password.length > 0 ||
                            Boolean(errorFor("password"))
                        }
                    />
                </div>

                <div>
                    <label
                        htmlFor="school"
                        className="block text-sm font-medium text-slate-700 mb-2"
                    >
                        School / University (optional)
                    </label>
                    <input
                        id="school"
                        type="text"
                        value={data.school}
                        onChange={(e) => handleChange("school", e.target.value)}
                        onBlur={() => markTouched("school")}
                        placeholder="University of the Philippines Diliman"
                        aria-invalid={Boolean(errorFor("school"))}
                        aria-describedby={
                            errorFor("school") ? "school-error" : undefined
                        }
                        className={inputClass(Boolean(errorFor("school")))}
                    />
                    {errorFor("school") && (
                        <p
                            id="school-error"
                            className="mt-1.5 text-xs text-red-600"
                        >
                            {errorFor("school")}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-start">
                        <input
                            id="agree-terms"
                            type="checkbox"
                            checked={data.agree_terms}
                            onChange={(e) => {
                                markTouched("agree_terms");
                                handleChange("agree_terms", e.target.checked);
                            }}
                            aria-invalid={Boolean(errorFor("agree_terms"))}
                            aria-describedby={
                                errorFor("agree_terms")
                                    ? "agree-terms-error"
                                    : undefined
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
                    {errorFor("agree_terms") && (
                        <p
                            id="agree-terms-error"
                            className="mt-1.5 text-xs text-red-600"
                        >
                            {errorFor("agree_terms")}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || !isFormValid}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing
                        ? "Creating account..."
                        : "Create Student Account"}
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
