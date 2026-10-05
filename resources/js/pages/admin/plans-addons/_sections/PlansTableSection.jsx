import { Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import Table from "@/components/ui/Table";

function LoadingRows() {
	return (
		<div className="space-y-3 p-4">
			{Array.from({ length: 5 }).map((_, idx) => (
				<Skeleton key={idx} className="h-10 w-full rounded" />
			))}
		</div>
	);
}

function EmptyState({ hasSearch, onCreate }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Package className="h-10 w-10 text-gray-300" />
			<h3 className="mt-3 text-sm font-semibold text-gray-900">
				{hasSearch ? "No plans match your search" : "No plans yet"}
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				{hasSearch
					? "Try a different search term."
					: "Create your first hosting plan."}
			</p>
			{!hasSearch && (
				<Button size="sm" className="mt-4" onClick={onCreate}>
					<Plus className="mr-1.5 h-4 w-4" />
					New Plan
				</Button>
			)}
		</div>
	);
}

export default function PlansTableSection({
	plans,
	meta,
	isLoading,
	isFetching,
	search,
	onSearch,
	onPageChange,
	onCreate,
	onEdit,
	onDelete,
}) {
	const columns = [
		{
			header: "Plan",
			render: (plan) => (
				<div>
					<span className="font-medium text-gray-900">{plan.name}</span>
					{plan.subtitle && (
						<p className="text-xs text-gray-500">{plan.subtitle}</p>
					)}
				</div>
			),
		},
		{
			header: "Price",
			render: (plan) => (
				<span className="text-sm text-gray-700">
					{plan.monthly_price !== null
						? `₱${Number(plan.monthly_price).toLocaleString()}/mo`
						: "Custom"}
				</span>
			),
		},
		{
			header: "Status",
			render: (plan) => (
				<div className="flex items-center gap-2">
					<Badge variant={plan.is_active ? "success" : "neutral"}>
						{plan.is_active ? "Active" : "Inactive"}
					</Badge>
					{plan.is_popular && <Badge variant="warning">Popular</Badge>}
				</div>
			),
		},
		{
			header: "Limits",
			render: (plan) => (
				<span className="text-xs text-gray-500">
					{plan.max_websites} sites · {plan.max_databases} DBs ·{" "}
					{plan.disk_space_mb} MB
				</span>
			),
		},
		{
			header: "Subs",
			render: (plan) => (
				<Badge variant={plan.subscriptions_count ? "info" : "neutral"}>
					{plan.subscriptions_count ?? 0}
				</Badge>
			),
		},
		{
			header: "Actions",
			width: "w-40",
			render: (plan) => (
				<div className="flex items-center gap-2">
					<Button
						size="xs"
						variant="light"
						outlined
						onClick={() => onEdit(plan)}
						className="gap-1"
					>
						<Pencil className="h-3.5 w-3.5" />
						Edit
					</Button>
					<Button
						size="xs"
						variant="danger"
						outlined
						onClick={() => onDelete(plan)}
						className="gap-1"
					>
						<Trash2 className="h-3.5 w-3.5" />
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<section className="rounded-xl border border-gray-200 bg-white">
			<div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="search"
						value={search}
						onChange={(e) => onSearch(e.target.value)}
						placeholder="Search plans..."
						aria-label="Search plans"
						className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<Button size="sm" onClick={onCreate} className="gap-1.5">
					<Plus className="h-4 w-4" />
					New Plan
				</Button>
			</div>

			{isLoading ? (
				<LoadingRows />
			) : plans?.length ? (
				<div className={isFetching ? "opacity-60" : ""}>
					<Table columns={columns} data={plans} />
					<Pagination
						meta={meta}
						onPageChange={onPageChange}
						className="border-t border-gray-100 p-4"
					/>
				</div>
			) : (
				<EmptyState hasSearch={Boolean(search)} onCreate={onCreate} />
			)}
		</section>
	);
}
