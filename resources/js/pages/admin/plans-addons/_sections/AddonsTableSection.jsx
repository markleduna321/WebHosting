import { Blocks, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
			<Blocks className="h-10 w-10 text-gray-300" />
			<h3 className="mt-3 text-sm font-semibold text-gray-900">
				{hasSearch
					? "No add-ons match your search"
					: "No add-ons yet"}
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				{hasSearch
					? "Try a different search term."
					: "Create your first add-on for customers to purchase."}
			</p>
			{!hasSearch && (
				<Button size="sm" className="mt-4" onClick={onCreate}>
					<Plus className="mr-1.5 h-4 w-4" />
					New Add-on
				</Button>
			)}
		</div>
	);
}

export default function AddonsTableSection({
	addons,
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
			header: "Add-on",
			render: (addon) => (
				<span className="font-medium text-gray-900">{addon.name}</span>
			),
		},
		{
			header: "Price",
			render: (addon) => (
				<span className="text-sm text-gray-700">
					₱{(addon.price / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
				</span>
			),
		},
		{
			header: "Billing",
			render: (addon) => (
				<Badge variant="info">{addon.billing_period}</Badge>
			),
		},
		{
			header: "Status",
			render: (addon) => (
				<Badge variant={addon.is_active ? "success" : "neutral"}>
					{addon.is_active ? "Active" : "Inactive"}
				</Badge>
			),
		},
		{
			header: "Actions",
			width: "w-40",
			render: (addon) => (
				<div className="flex items-center gap-2">
					<Button
						size="xs"
						variant="light"
						outlined
						onClick={() => onEdit(addon)}
						className="gap-1"
					>
						<Pencil className="h-3.5 w-3.5" />
						Edit
					</Button>
					<Button
						size="xs"
						variant="danger"
						outlined
						onClick={() => onDelete(addon)}
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
						placeholder="Search add-ons..."
						aria-label="Search add-ons"
						className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<Button size="sm" onClick={onCreate} className="gap-1.5">
					<Plus className="h-4 w-4" />
					New Add-on
				</Button>
			</div>

			{isLoading ? (
				<LoadingRows />
			) : addons?.length ? (
				<div className={isFetching ? "opacity-60" : ""}>
					<Table columns={columns} data={addons} />
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
