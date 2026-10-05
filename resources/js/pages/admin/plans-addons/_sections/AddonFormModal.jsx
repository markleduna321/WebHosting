import { Modal, message } from "antd";
import { Minus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
	useCreateAddonMutation,
	useUpdateAddonMutation,
} from "@/features/addons/addonsApi";

function FieldError({ error }) {
	if (!error) return null;
	return <p className="mt-1 text-xs text-red-600">{error[0]}</p>;
}

export default function AddonFormModal({ open, addon, onClose }) {
	const isEdit = Boolean(addon);

	const [name, setName] = useState("");
	const [pricePesos, setPricePesos] = useState("");
	const [billingPeriod, setBillingPeriod] = useState("month");
	const [isActive, setIsActive] = useState(true);
	const [description, setDescription] = useState([""]);
	const [errors, setErrors] = useState({});

	const [createAddon, { isLoading: creating }] = useCreateAddonMutation();
	const [updateAddon, { isLoading: updating }] = useUpdateAddonMutation();
	const saving = creating || updating;

	useEffect(() => {
		if (open) {
			setName(addon?.name ?? "");
			// DB stores centavos, admin edits in pesos
			setPricePesos(
				addon?.price !== undefined && addon?.price !== null
					? String(addon.price / 100)
					: "",
			);
			setBillingPeriod(addon?.billing_period ?? "month");
			setIsActive(addon?.is_active ?? true);
			setDescription(
				addon?.description?.length ? [...addon.description] : [""],
			);
			setErrors({});
		}
	}, [open, addon]);

	// Description helpers
	const addLine = () => setDescription((prev) => [...prev, ""]);
	const removeLine = (idx) =>
		setDescription((prev) => prev.filter((_, i) => i !== idx));
	const updateLine = (idx, value) =>
		setDescription((prev) =>
			prev.map((d, i) => (i === idx ? value : d)),
		);

	const submit = async () => {
		setErrors({});

		const payload = {
			name,
			price: pricePesos !== "" ? Math.round(Number(pricePesos) * 100) : 0,
			billing_period: billingPeriod,
			is_active: isActive,
			description: description.filter((d) => d.trim() !== ""),
		};

		try {
			if (isEdit) {
				await updateAddon({ id: addon.id, ...payload }).unwrap();
				message.success("Add-on updated");
			} else {
				await createAddon(payload).unwrap();
				message.success("Add-on created");
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
			title={isEdit ? `Edit add-on: ${addon?.name}` : "Create new add-on"}
			open={open}
			onCancel={onClose}
			footer={null}
			destroyOnClose
			width={520}
		>
			<div className="space-y-5 pt-2">
				{/* Name */}
				<div>
					<label
						htmlFor="addon-name"
						className="mb-1.5 block text-sm font-medium text-gray-700"
					>
						Add-on name *
					</label>
					<input
						id="addon-name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Extra Storage"
						className={inputClass("name")}
					/>
					<FieldError error={errors.name} />
				</div>

				{/* Price & Period */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="addon-price"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Price (₱) *
						</label>
						<input
							id="addon-price"
							type="number"
							min="0"
							step="0.01"
							value={pricePesos}
							onChange={(e) => setPricePesos(e.target.value)}
							placeholder="e.g. 99.00"
							className={inputClass("price")}
						/>
						<FieldError error={errors.price} />
					</div>
					<div>
						<label
							htmlFor="addon-billing-period"
							className="mb-1.5 block text-sm font-medium text-gray-700"
						>
							Billing period
						</label>
						<select
							id="addon-billing-period"
							value={billingPeriod}
							onChange={(e) => setBillingPeriod(e.target.value)}
							className={inputClass("billing_period")}
						>
							<option value="month">Monthly</option>
							<option value="year">Yearly</option>
							<option value="one-time">One-time</option>
						</select>
						<FieldError error={errors.billing_period} />
					</div>
				</div>

				{/* Active */}
				<label className="flex items-center gap-2 text-sm text-gray-700 select-none">
					<input
						type="checkbox"
						checked={isActive}
						onChange={(e) => setIsActive(e.target.checked)}
						className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					Active
				</label>

				{/* Description lines */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-gray-700">
							Description lines
						</p>
						<button
							type="button"
							onClick={addLine}
							className="text-xs text-blue-600 hover:text-blue-800 font-medium"
						>
							+ Add line
						</button>
					</div>
					<div className="space-y-2">
						{description.map((line, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<input
									type="text"
									value={line}
									onChange={(e) =>
										updateLine(idx, e.target.value)
									}
									placeholder={`Line ${idx + 1}`}
									className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
								{description.length > 1 && (
									<button
										type="button"
										onClick={() => removeLine(idx)}
										className="p-1 text-gray-400 hover:text-red-500"
										aria-label="Remove line"
									>
										<Minus className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
					</div>
					<FieldError error={errors.description} />
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
						{isEdit ? "Save changes" : "Create add-on"}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
