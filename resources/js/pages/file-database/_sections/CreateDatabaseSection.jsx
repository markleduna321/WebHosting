import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { Database, Eye, EyeOff, Shuffle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordChecklist from "@/components/ui/PasswordChecklist";
import {
    useCreateDatabaseMutation,
    useGetDatabasesQuery,
} from "@/features/databases/databasesApi";

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
// Mirrors the server whitelist: no quote, double quote, backtick or backslash.
const SYMBOLS = "!#$%&()*+,-.:;<=>?@[]^_{|}~";

const NAME_PATTERN = /^[a-z][a-z0-9_]*$/;
const PASSWORD_CHARSET = /^[A-Za-z0-9!#$%&()*+,\-.:;<=>?@[\]^_{|}~]*$/;

function pick(pool, count) {
    const values = new Uint32Array(count);
    crypto.getRandomValues(values);

    return Array.from(values, (value) => pool[value % pool.length]);
}

function generatePassword() {
    const chars = [
        ...pick(UPPER, 1),
        ...pick(LOWER, 1),
        ...pick(DIGITS, 1),
        ...pick(SYMBOLS, 1),
        ...pick(UPPER + LOWER + DIGITS + SYMBOLS, 16),
    ];
    const order = new Uint32Array(chars.length);
    crypto.getRandomValues(order);

    return chars
        .map((char, index) => ({ char, key: order[index] }))
        .sort((a, b) => a.key - b.key)
        .map((entry) => entry.char)
        .join("");
}

/** Mirrors the server-side normalisation so the preview matches what gets created. */
function normalizeName(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+/, "");
}

export default function CreateDatabaseSection({ open, onClose }) {
    const { data } = useGetDatabasesQuery();
    const [createDatabase, { isLoading }] = useCreateDatabaseMutation();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [touchedPassword, setTouchedPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);

    const prefix = data?.meta?.name_prefix ?? "";

    useEffect(() => {
        if (open) {
            setName("");
            setPassword("");
            setConfirmation("");
            setShowPassword(false);
            setTouchedPassword(false);
            setErrors({});
            setServerError(null);
        }
    }, [open]);

    const nameIsValid = name.length >= 3 && name.length <= 32 && NAME_PATTERN.test(name);
    const charsetIsValid = PASSWORD_CHARSET.test(password);
    const passwordIsValid =
        password.length >= 8 &&
        password.length <= 64 &&
        charsetIsValid &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
    const confirmationIsValid = confirmation.length > 0 && confirmation === password;
    const canSubmit = nameIsValid && passwordIsValid && confirmationIsValid;

    const handleGenerate = () => {
        const generated = generatePassword();

        setPassword(generated);
        setConfirmation(generated);
        setShowPassword(true);
        setTouchedPassword(true);
        setErrors((prev) => ({ ...prev, password: null, password_confirmation: null }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setServerError(null);

        try {
            const created = await createDatabase({
                name,
                password,
                password_confirmation: confirmation,
            }).unwrap();

            message.success(`Database ${created?.data?.db_name ?? name} is ready`);
            onClose();
        } catch (err) {
            if (err?.status === 422) {
                const fieldErrors = err?.data?.errors ?? {};

                setErrors({
                    name: fieldErrors.name?.[0] ?? null,
                    password: fieldErrors.password?.[0] ?? null,
                    password_confirmation: fieldErrors.password_confirmation?.[0] ?? null,
                });

                return;
            }

            setServerError(
                err?.data?.message ?? "We could not create that database. Please try again.",
            );
        }
    };

    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus-visible:text-blue-600"
        >
            {showPassword ? (
                <EyeOff className="h-4 w-4" />
            ) : (
                <Eye className="h-4 w-4" />
            )}
        </button>
    );

    return (
        <Modal
            title="Create database"
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={520}
            destroyOnClose
        >
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="flex items-start gap-3 rounded-xl bg-blue-50/70 px-3.5 py-3">
                    <Database className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <p className="text-xs text-slate-600">
                        We create a private MySQL schema and a dedicated account
                        that can only reach that schema. Save your password — you
                        will need it to sign in to phpMyAdmin.
                    </p>
                </div>

                <div>
                    <Input
                        label="Database name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(normalizeName(e.target.value))}
                        error={errors.name}
                        disabled={isLoading}
                        maxLength={32}
                        required
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                        {name ? (
                            <>
                                Your schema will be{" "}
                                <span className="font-mono text-slate-600">
                                    {prefix}
                                    {name}
                                </span>
                                .
                            </>
                        ) : (
                            "Lowercase letters, numbers and underscores. 3–32 characters."
                        )}
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor="password"
                            className="text-xs font-medium text-slate-600"
                        >
                            Database password
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 focus:outline-none focus-visible:underline disabled:opacity-50"
                        >
                            <Shuffle className="h-3 w-3" />
                            Generate
                        </button>
                    </div>

                    <div className="mt-1.5">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setTouchedPassword(true)}
                            error={
                                errors.password ??
                                (password && !charsetIsValid
                                    ? "Avoid quotes, backticks and backslashes."
                                    : null)
                            }
                            iconRight={passwordToggle}
                            disabled={isLoading}
                            maxLength={64}
                            required
                        />
                    </div>

                    <PasswordChecklist
                        password={password}
                        visible={touchedPassword}
                    />
                </div>

                <div>
                    <Input
                        label="Confirm password"
                        name="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        error={
                            errors.password_confirmation ??
                            (confirmation && confirmation !== password
                                ? "Passwords do not match."
                                : null)
                        }
                        disabled={isLoading}
                        maxLength={64}
                        required
                    />
                </div>

                {serverError && (
                    <p
                        role="alert"
                        className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                        {serverError}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <Button
                        variant="light"
                        outlined
                        size="sm"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={isLoading}
                        disabled={isLoading || !canSubmit}
                    >
                        Create database
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
