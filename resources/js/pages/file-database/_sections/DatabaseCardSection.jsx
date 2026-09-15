import React, { useMemo, useState } from "react";
import {
    Database,
    Eye,
    EyeOff,
    Copy,
    RefreshCw,
    Check,
    Trash2,
    TriangleAlert,
    Plus,
    ExternalLink,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Modal, message } from "antd";
import Card from "@/components/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
    useGetDatabasesQuery,
    useLazyGetDatabaseCredentialsQuery,
    useDeleteDatabaseMutation,
} from "@/features/databases/databasesApi";

const MB = 1024 * 1024;

function formatSize(bytes) {
    if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;

    return `${Math.round(bytes / 1024)} KB`;
}

function phpMyAdminLink(baseUrl, dbName) {
    if (!baseUrl) return null;

    const root = baseUrl.replace(/\/+$/, "");

    return `${root}/index.php?route=/database/structure&db=${encodeURIComponent(dbName)}`;
}

function StatusBadge({ status }) {
    if (status === "active") {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                Online
            </span>
        );
    }

    if (status === "failed") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                <TriangleAlert className="w-3 h-3" />
                Failed
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Provisioning
        </span>
    );
}

export default function DatabaseCardSection({ onCreate }) {
    const { data, isLoading, isError, refetch } = useGetDatabasesQuery();
    const [fetchCredentials] = useLazyGetDatabaseCredentialsQuery();
    const [deleteDatabase, { isLoading: isDeleting }] = useDeleteDatabaseMutation();
    const reduceMotion = useReducedMotion();

    const [revealed, setRevealed] = useState({});
    const [busyId, setBusyId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    const databases = data?.items ?? [];
    const phpMyAdminUrl = data?.meta?.phpmyadmin_url;

    const variants = useMemo(
        () =>
            reduceMotion
                ? {}
                : {
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0 },
                  },
        [reduceMotion],
    );

    const loadCredentials = async (uuid) => {
        if (revealed[uuid]) return revealed[uuid];

        setBusyId(uuid);

        try {
            const credentials = await fetchCredentials(uuid).unwrap();
            setRevealed((prev) => ({ ...prev, [uuid]: credentials }));

            return credentials;
        } catch (err) {
            message.error(err?.data?.message ?? "Could not load credentials.");

            return null;
        } finally {
            setBusyId(null);
        }
    };

    const toggleCredentials = async (uuid) => {
        if (revealed[uuid]) {
            // Drop the secret from memory as soon as it is hidden again.
            setRevealed((prev) => {
                const next = { ...prev };
                delete next[uuid];

                return next;
            });

            return;
        }

        await loadCredentials(uuid);
    };

    const handleCopy = async (uuid) => {
        const credentials = await loadCredentials(uuid);

        if (!credentials?.connection_string) return;

        try {
            await navigator.clipboard.writeText(credentials.connection_string);
            setCopiedId(uuid);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            message.error("Your browser blocked clipboard access.");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteDatabase(pendingDelete.uuid).unwrap();
            message.success(`${pendingDelete.db_name} was deleted`);
            setPendingDelete(null);
        } catch (err) {
            message.error(err?.data?.message ?? "Could not delete that database.");
        }
    };

    if (isLoading) {
        return (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1].map((key) => (
                    <div
                        key={key}
                        className="rounded-xl border border-gray-200 bg-white p-5 space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-40 rounded" />
                                <Skeleton className="h-3 w-24 rounded" />
                            </div>
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                ))}
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50/60 px-6 py-8 text-center">
                <TriangleAlert className="mx-auto h-6 w-6 text-red-500" />
                <p className="mt-2 text-sm font-semibold text-slate-900">
                    We could not load your databases
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Check your connection and try again.
                </p>
                <Button
                    variant="light"
                    outlined
                    size="sm"
                    className="mt-4"
                    onClick={refetch}
                >
                    Retry
                </Button>
            </section>
        );
    }

    if (databases.length === 0) {
        return (
            <section className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Database className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                    No databases yet
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                    Create a MySQL database to store data for your project. You
                    get a private schema and your own credentials.
                </p>
                <Button
                    variant="primary"
                    size="sm"
                    className="mt-4 gap-1.5"
                    onClick={onCreate}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Create your first database
                </Button>
            </section>
        );
    }

    return (
        <section>
            <motion.div
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                transition={{ staggerChildren: 0.07 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {databases.map((db) => {
                    const quotaBytes = db.quota_mb * MB;
                    const usagePercent =
                        quotaBytes > 0
                            ? Math.min(100, Math.round((db.size_bytes / quotaBytes) * 100))
                            : 0;
                    const credentials = revealed[db.uuid];
                    const isBusy = busyId === db.uuid;
                    const adminLink =
                        db.status === "active"
                            ? phpMyAdminLink(phpMyAdminUrl, db.db_name)
                            : null;

                    return (
                        <motion.div key={db.uuid} variants={variants} layout>
                            <Card className="justify-between cursor-default h-full">
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <Database className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-mono text-base font-bold text-slate-800 leading-tight break-all">
                                                    {db.db_name}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {db.engine} · {db.quota_mb} MB
                                                </p>
                                            </div>
                                        </div>

                                        <StatusBadge status={db.status} />
                                    </div>

                                    {db.status === "failed" && db.failure_reason && (
                                        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                                            {db.failure_reason}
                                        </p>
                                    )}

                                    <div className="mb-5">
                                        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
                                            <span>Storage</span>
                                            <span className="font-semibold text-slate-700">
                                                {formatSize(db.size_bytes)} /{" "}
                                                {db.quota_mb} MB
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-[width] duration-500"
                                                style={{ width: `${usagePercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/70 rounded-xl p-3.5 space-y-2 text-xs font-mono text-slate-600 mb-5">
                                        <div className="flex justify-between items-center gap-3">
                                            <span className="font-sans text-slate-400">
                                                Host
                                            </span>
                                            <span className="text-slate-700 font-medium truncate">
                                                {db.host}:{db.port}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center gap-3">
                                            <span className="font-sans text-slate-400">
                                                User
                                            </span>
                                            <span className="text-slate-700 font-medium truncate">
                                                {db.db_user}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center gap-3">
                                            <span className="font-sans text-slate-400">
                                                Password
                                            </span>
                                            <span className="text-slate-700 font-semibold tracking-wider truncate">
                                                {credentials
                                                    ? credentials.password
                                                    : "••••••••••••"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    {adminLink && (
                                        <a
                                            href={adminLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                                        >
                                            <Database className="w-3.5 h-3.5" />
                                            Open phpMyAdmin
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => toggleCredentials(db.uuid)}
                                        disabled={isBusy || db.status !== "active"}
                                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isBusy ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                                                Loading…
                                            </>
                                        ) : credentials ? (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                                Hide credentials
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                Reveal credentials
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(db.uuid)}
                                        disabled={isBusy || db.status !== "active"}
                                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {copiedId === db.uuid ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                                Copy connection string
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPendingDelete(db)}
                                        aria-label={`Delete ${db.db_name}`}
                                        className="ml-auto inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            <Modal
                title="Delete database"
                open={Boolean(pendingDelete)}
                onCancel={() => setPendingDelete(null)}
                footer={null}
                centered
                destroyOnClose
            >
                <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                        <TriangleAlert className="h-5 w-5 shrink-0 text-red-500" />
                        <p className="text-sm text-gray-700">
                            This permanently drops the schema{" "}
                            <span className="font-mono font-semibold">
                                {pendingDelete?.db_name}
                            </span>{" "}
                            and its user account. Every table and row inside it
                            is deleted. This cannot be undone.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="light"
                            outlined
                            size="sm"
                            onClick={() => setPendingDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={confirmDelete}
                            loading={isDeleting}
                            disabled={isDeleting}
                        >
                            Delete database
                        </Button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
