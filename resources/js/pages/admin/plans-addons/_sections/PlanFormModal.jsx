import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
	useCreatePlanMutation,
	useUpdatePlanMutation,
} from "@/features/plans/plansApi";
import { Minus, Plus } from "lucide-react";

function FieldError({ error }) {
	if (!error) return null;
	return <p className="mt-1 text-xs text-red-600">{error[0]}</p>;
}

export default function PlanFormModal({ open, plan, onClose }) {
	const isEdit = Boolean(plan);

	// Form state
	const [name, setName] = useState("");
	const [subtitle, setSubtitle] = useState("");
	const [monthlyPrice, setMonthlyPrice] = useState("");
	const [currency, setCurrency] = useState("PHP");
	const [isPopular, setIsPopular] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [sortOrder, setSortOrder] = useState(0);
	const [maxWebsites, setMaxWebsites] = useState(1);
	const [maxDatabases, setMaxDatabases] = useState(1);
	const [diskSpaceMb, setDiskSpaceMb] = useState(50);
	const [dbSizeMb, setDbSizeMb] = useState(50);
	const [features, setFeatures] = useState([""]);
	const [prices, setPrices] = useState([]);
	const [periodDiscounts, setPeriodDiscounts] = useState([]);
	const [errors, setErrors] = useState({});

	const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
	const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
	const saving = creating || updating;

	useEffect(() => {
		if (open) {
			setName(plan?.name ?? "");
			setSubtitle(plan?.subtitle ?? "");
			setMonthlyPrice(
				plan?.monthly_price !== null && plan?.monthly_price !== undefined
					? String(plan.monthly_price)
					: "",
			);
			setCurrency(plan?.currency ?? "PHP");
			setIsPopular(plan?.is_popular ?? false);
			setIsActive(plan?.is_active ?? true);
			setSortOrder(plan?.sort_order ?? 0);
			setMaxWebsites(plan?.max_websites ?? 1);
			setMaxDatabases(plan?.max_databases ?? 1);
			setDiskSpaceMb(plan?.disk_space_mb ?? 50);
			setDbSizeMb(plan?.db_size_mb ?? 50);
			setFeatures(
				plan?.features?.length ? [...plan.features] : [""],
			);

			// Convert prices object to array of { months, amount }
			const pricesObj = plan?.prices ?? {};
			setPrices(
				Object.keys(pricesObj).length
					? Object.entries(pricesObj).map(([months, amount]) => ({
							months: String(months),
							amount: String(amount),
						}))
					: [],
			);

			// Convert period_discounts object to array of { months, discount }
			const discountsObj = plan?.period_discounts ?? {};
			setPeriodDiscounts(
				Object.keys(discountsObj).length
					? Object.entries(discountsObj).map(([months, discount]) => ({
							months: String(months),
							discount: String(discount),
						}))
					: [],
			);

			setErrors({});
		}
	}, [open, plan]);

	// Features helpers
	const addFeature = () => setFeatures((prev) => [...prev, ""]);
	const removeFeature = (idx) =>
		setFeatures((prev) => prev.filter((_, i) => i !== idx));
	const updateFeature = (idx, value) =>
		setFeatures((prev) => prev.map((f, i) => (i === idx ? value : f)));

	// Prices helpers
	const addPrice = () =>
		setPrices((prev) => [...prev, { months: "", amount: "" }]);
	const removePrice = (idx) =>
		setPrices((prev) => prev.filter((_, i) => i !== idx));
	const updatePrice = (idx, field, value) =>
		setPrices((prev) =>
			prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
		);

	// Period discounts helpers
	const addDiscount = () =>
		setPeriodDiscounts((prev) => [...prev, { months: "", discount: "" }]);
	const removeDiscount = (idx) =>
		setPeriodDiscounts((prev) => prev.filter((_, i) => i !== idx));
	const updateDiscount = (idx, field, value) =>
		setPeriodDiscounts((prev) =>
			prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
		);

	const submit = async () => {
		setErrors({});

		// Build prices object { months: amount }
		const pricesObj = {};
		prices.forEach(({ months, amount }) => {
			if (months && amount) pricesObj[months] = Number(amount);
		});

		// Build period_discounts object { months: discount% }
		const discountsObj = {};
		periodDiscounts.forEach(({ months, discount }) => {
			if (months && discount) discountsObj[months] = Number(discount);
		});

		const payload = {
			name,
			subtitle: subtitle || null,
			monthly_price: monthlyPrice !== "" ? Number(monthlyPrice) : null,
			currency,
			is_popular: isPopular,
			is_active: isActive,
			sort_order: Number(sortOrder),
			max_websites: Number(maxWebsites),
			max_databases: Number(maxDatabases),
			disk_space_mb: Number(diskSpaceMb),
			db_size_mb: Number(dbSizeMb),
			features: features.filter((f) => f.trim() !== ""),
			prices: Object.keys(pricesObj).length ? pricesObj : null,
			period_discounts: Object.keys(discountsObj).length
				? discountsObj
				: null,
		};

		try {
			if (isEdit) {
				await updatePlan({ id: plan.id, ...payload }).unwrap();
				message.success("Plan updated");
			} else {
				await createPlan(payload).unwrap();
				message.success("Plan created");
			}
			onClose();
		} catch (err) {
			if (err?.status === 422 && err?.data?.errors) {
				setErrors(err.data.errors);
			} else {
				message.error(err?.data?.message || "Something went wrong");
			}
		}
	};

	const inputClass = (field) =>
		`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
			errors[field]
				? "border-red-400 focus:border-red-500 focus:ring-red-500"
				: "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
		}`;

	return (
		<Modal
			title={isEdit ? `Edit plan: ${plan?.name}` : "Create new plan"}
			open={open}
			onCancel={onClose}
			footer={null}
			destroyOnClose
			width={640}
		>
			<div className="space-y-5 pt-2 max-h-[70vh] overflow-y-auto pr-1">
				{/* Name & Subtitle */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="plan-name"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Plan name *
						</label>
						<input
							id="plan-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Starter"
							className={inputClass("name")}
						/>
						<FieldError error={errors.name} />
					</div>
					<div>
						<label
							htmlFor="plan-subtitle"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Subtitle
						</label>
						<input
							id="plan-subtitle"
							type="text"
							value={subtitle}
							onChange={(e) => setSubtitle(e.target.value)}
							placeholder="e.g. For personal projects"
							className={inputClass("subtitle")}
						/>
						<FieldError error={errors.subtitle} />
					</div>
				</div>

				{/* Pricing */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label
							htmlFor="plan-monthly-price"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Monthly price (₱)
						</label>
						<input
							id="plan-monthly-price"
							type="number"
							min="0"
							step="0.01"
							value={monthlyPrice}
							onChange={(e) => setMonthlyPrice(e.target.value)}
							placeholder="Leave empty for custom"
							className={inputClass("monthly_price")}
						/>
						<FieldError error={errors.monthly_price} />
					</div>
					<div>
						<label
							htmlFor="plan-currency"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Currency
						</label>
						<input
							id="plan-currency"
							type="text"
							maxLength={3}
							value={currency}
							onChange={(e) =>
								setCurrency(e.target.value.toUpperCase())
							}
							className={inputClass("currency")}
						/>
						<FieldError error={errors.currency} />
					</div>
					<div>
						<label
							htmlFor="plan-sort-order"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Sort order
						</label>
						<input
							id="plan-sort-order"
							type="number"
							min="0"
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}
							className={inputClass("sort_order")}
						/>
						<FieldError error={errors.sort_order} />
					</div>
				</div>

				{/* Limits */}
				<div>
					<p className="mb-2 text-sm font-medium text-gray-700">
						Resource limits
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						<div>
							<label className="mb-1 block text-xs text-gray-500">
								Max websites
							</label>
							<input
								type="number"
								min="0"
								value={maxWebsites}
								onChange={(e) =>
									setMaxWebsites(e.target.value)
								}
								className={inputClass("max_websites")}
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs text-gray-500">
								Max databases
							</label>
							<input
								type="number"
								min="0"
								value={maxDatabases}
								onChange={(e) =>
									setMaxDatabases(e.target.value)
								}
								className={inputClass("max_databases")}
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs text-gray-500">
								Disk space (MB)
							</label>
							<input
								type="number"
								min="0"
								value={diskSpaceMb}
								onChange={(e) =>
									setDiskSpaceMb(e.target.value)
								}
								className={inputClass("disk_space_mb")}
							/>
						</div>
						<div>
							<label className="mb-1 block text-xs text-gray-500">
								DB size (MB)
							</label>
							<input
								type="number"
								min="0"
								value={dbSizeMb}
								onChange={(e) => setDbSizeMb(e.target.value)}
								className={inputClass("db_size_mb")}
							/>
						</div>
					</div>
				</div>

				{/* Flags */}
				<div className="flex items-center gap-6">
					<label className="flex items-center gap-2 text-sm text-gray-700 select-none">
						<input
							type="checkbox"
							checked={isPopular}
							onChange={(e) => setIsPopular(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Popular badge
					</label>
					<label className="flex items-center gap-2 text-sm text-gray-700 select-none">
						<input
							type="checkbox"
							checked={isActive}
							onChange={(e) => setIsActive(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Active
					</label>
				</div>

				{/* Features */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-gray-700">
							Features
						</p>
						<button
							type="button"
							onClick={addFeature}
							className="text-xs text-blue-600 hover:text-blue-800 font-medium"
						>
							+ Add feature
						</button>
					</div>
					<div className="space-y-2">
						{features.map((feature, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<input
									type="text"
									value={feature}
									onChange={(e) =>
										updateFeature(idx, e.target.value)
									}
									placeholder={`Feature ${idx + 1}`}
									className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
								{features.length > 1 && (
									<button
										type="button"
										onClick={() => removeFeature(idx)}
										className="p-1 text-gray-400 hover:text-red-500"
										aria-label="Remove feature"
									>
										<Minus className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
					</div>
					<FieldError error={errors.features} />
				</div>

				{/* Multi-period prices */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-gray-700">
							Multi-period prices{" "}
							<span className="font-normal text-gray-400">
								(optional)
							</span>
						</p>
						<button
							type="button"
							onClick={addPrice}
							className="text-xs text-blue-600 hover:text-blue-800 font-medium"
						>
							+ Add period
						</button>
					</div>
					{prices.length > 0 && (
						<div className="space-y-2">
							{prices.map((entry, idx) => (
								<div
									key={idx}
									className="flex items-center gap-2"
								>
									<input
										type="number"
										min="1"
										value={entry.months}
										onChange={(e) =>
											updatePrice(
												idx,
												"months",
												e.target.value,
											)
										}
										placeholder="Months"
										className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
									<span className="text-xs text-gray-400">
										→
									</span>
									<input
										type="number"
										min="0"
										step="0.01"
										value={entry.amount}
										onChange={(e) =>
											updatePrice(
												idx,
												"amount",
												e.target.value,
											)
										}
										placeholder="Total ₱"
										className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
									<button
										type="button"
										onClick={() => removePrice(idx)}
										className="p-1 text-gray-400 hover:text-red-500"
										aria-label="Remove price"
									>
										<Minus className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
					<FieldError error={errors.prices} />
				</div>

				{/* Period discounts */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-gray-700">
							Period discounts %{" "}
							<span className="font-normal text-gray-400">
								(optional)
							</span>
						</p>
						<button
							type="button"
							onClick={addDiscount}
							className="text-xs text-blue-600 hover:text-blue-800 font-medium"
						>
							+ Add discount
						</button>
					</div>
					{periodDiscounts.length > 0 && (
						<div className="space-y-2">
							{periodDiscounts.map((entry, idx) => (
								<div
									key={idx}
									className="flex items-center gap-2"
								>
									<input
										type="number"
										min="1"
										value={entry.months}
										onChange={(e) =>
											updateDiscount(
												idx,
												"months",
												e.target.value,
											)
										}
										placeholder="Months"
										className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
									<span className="text-xs text-gray-400">
										→
									</span>
									<input
										type="number"
										min="0"
										max="100"
										step="1"
										value={entry.discount}
										onChange={(e) =>
											updateDiscount(
												idx,
												"discount",
												e.target.value,
											)
										}
										placeholder="Discount %"
										className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
									<button
										type="button"
										onClick={() => removeDiscount(idx)}
										className="p-1 text-gray-400 hover:text-red-500"
										aria-label="Remove discount"
									>
										<Minus className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
					<FieldError error={errors.period_discounts} />
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-2 pt-1">
					<Button variant="light" outlined size="sm" onClick={onClose}>
						Cancel
					</Button>
					<Button
						size="sm"
						onClick={submit}
						loading={saving}
						disabled={saving || !name.trim()}
					>
						{isEdit ? "Save changes" : "Create plan"}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
