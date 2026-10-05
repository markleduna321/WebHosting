import React, { useEffect, useState } from "react";
import { AlertTriangle, Search, ShieldCheck, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import Table from "@/components/ui/Table";
import { useGetAdminUsersQuery } from "@/features/users/usersApi";

function initials(name = "") {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "?"
    );
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function PlanBadge({ plan }) {
    if (!plan) return <Badge variant="neutral">No plan</Badge>;

    if (plan.status === "pending_payment") {
        return (
            <div className="flex flex-col items-end gap-1 md:items-start">
                <span className="text-sm font-medium text-slate-800">{plan.name}</span>
                <Badge variant="warning">Pending payment</Badge>
            </div>
        );
    }

    return <Badge variant="info">{plan.name}</Badge>;
}

function EmptyState({ hasSearch, onClear, onRefresh }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <Users className="h-10 w-10 text-slate-300" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {hasSearch ? "No users match your search" : "No users yet"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
                {hasSearch
                    ? "Try a different name or email address."
                    : "Registered users will appear here."}
            </p>
            <Button size="sm" variant="light" outlined className="mt-4" onClick={hasSearch ? onClear : onRefresh}>
                {hasSearch ? "Clear search" : "Refresh"}
            </Button>
        </div>
    );
}

export default function UsersTableSection() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const id = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(id);
    }, [searchInput]);

    const { data, isLoading, isFetching, isError, refetch } = useGetAdminUsersQuery({ page, search });
    const users = data?.data ?? [];
    const meta = data?.meta;

    const columns = [
        {
            header: "User",
            key: "user",
            width: "min-w-[240px]",
            render: (user) => (
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600"
                    >
                        {initials(user.name)}
                    </span>
                    <div className="min-w-0 text-left">
                        <p className="truncate font-medium text-slate-900">{user.name}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Roles",
            key: "roles",
            width: "min-w-[120px]",
            render: (user) =>
                user.roles.length ? (
                    <div className="flex flex-wrap justify-end gap-1 md:justify-start">
                        {user.roles.map((role) => (
                            <Badge key={role} variant={role === "admin" ? "error" : "neutral"} className="capitalize">
                                {role}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">None</span>
                ),
        },
        {
            header: "Plan",
            key: "plan",
            width: "min-w-[130px]",
            render: (user) => <PlanBadge plan={user.plan} />,
        },
        {
            header: "Email",
            key: "email_verified",
            width: "w-[110px]",
            render: (user) =>
                user.email_verified ? (
                    <Badge variant="success">Verified</Badge>
                ) : (
                    <Badge variant="warning">Unverified</Badge>
                ),
        },
        {
            header: "2FA",
            key: "two_factor",
            width: "w-[80px]",
            render: (user) =>
                user.two_factor_enabled ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        On
                    </span>
                ) : (
                    <span className="text-xs text-slate-400">Off</span>
                ),
        },
        {
            header: "Joined",
            key: "created_at",
            width: "w-[120px]",
            render: (user) => <span className="text-slate-600">{formatDate(user.created_at)}</span>,
        },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 sm:max-w-[360px]">
                    <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only">Search users</span>
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="Search by name or email..."
                        maxLength={100}
                        className="w-full border-0 bg-transparent p-0 outline-none placeholder:text-slate-400 focus:ring-0"
                    />
                </label>
                {meta && (
                    <p className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-900">{meta.total}</span> user{meta.total === 1 ? "" : "s"}
                        {search && " found"}
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="p-4" aria-busy="true" aria-label="Loading users">
                    <Skeleton variant="table" lines={6} />
                </div>
            ) : isError ? (
                <div role="alert" className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                    <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
                    <p className="text-sm text-slate-600">The user list could not be loaded.</p>
                    <Button size="sm" variant="light" outlined onClick={refetch}>
                        Try again
                    </Button>
                </div>
            ) : users.length === 0 ? (
                <EmptyState hasSearch={Boolean(search)} onClear={() => setSearchInput("")} onRefresh={refetch} />
            ) : (
                <div className={`p-4 transition-opacity md:p-0 ${isFetching ? "opacity-60" : ""}`} aria-busy={isFetching}>
                    <Table columns={columns} data={users} />
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="border-t border-slate-200 px-4 py-3">
                    <Pagination meta={meta} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
