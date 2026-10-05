import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { Package, Blocks } from "lucide-react";

import PlansTableSection from "./_sections/PlansTableSection";
import PlanFormModal from "./_sections/PlanFormModal";
import DeletePlanModal from "./_sections/DeletePlanModal";
import AddonsTableSection from "./_sections/AddonsTableSection";
import AddonFormModal from "./_sections/AddonFormModal";
import DeleteAddonModal from "./_sections/DeleteAddonModal";

import { useGetAdminPlansQuery } from "@/features/plans/plansApi";
import { useGetAdminAddonsQuery } from "@/features/addons/addonsApi";

export default function Page() {
	// Plans state
	const [planPage, setPlanPage] = useState(1);
	const [planSearch, setPlanSearch] = useState("");
	const [planFormOpen, setPlanFormOpen] = useState(false);
	const [editingPlan, setEditingPlan] = useState(null);
	const [deletingPlan, setDeletingPlan] = useState(null);

	// Add-ons state
	const [addonPage, setAddonPage] = useState(1);
	const [addonSearch, setAddonSearch] = useState("");
	const [addonFormOpen, setAddonFormOpen] = useState(false);
	const [editingAddon, setEditingAddon] = useState(null);
	const [deletingAddon, setDeletingAddon] = useState(null);

	// Queries
	const {
		data: plansData,
		isLoading: plansLoading,
		isFetching: plansFetching,
	} = useGetAdminPlansQuery({ page: planPage, search: planSearch });

	const {
		data: addonsData,
		isLoading: addonsLoading,
		isFetching: addonsFetching,
	} = useGetAdminAddonsQuery({ page: addonPage, search: addonSearch });

	// Plan handlers
	const openCreatePlan = () => {
		setEditingPlan(null);
		setPlanFormOpen(true);
	};
	const openEditPlan = (plan) => {
		setEditingPlan(plan);
		setPlanFormOpen(true);
	};
	const handlePlanSearch = (value) => {
		setPlanSearch(value);
		setPlanPage(1);
	};

	// Add-on handlers
	const openCreateAddon = () => {
		setEditingAddon(null);
		setAddonFormOpen(true);
	};
	const openEditAddon = (addon) => {
		setEditingAddon(addon);
		setAddonFormOpen(true);
	};
	const handleAddonSearch = (value) => {
		setAddonSearch(value);
		setAddonPage(1);
	};

	const tabs = [
		{
			id: "plans",
			label: "Plans",
			icon: <Package className="h-4 w-4" />,
		},
		{
			id: "addons",
			label: "Add-ons",
			icon: <Blocks className="h-4 w-4" />,
		},
	];

	return (
		<div className="space-y-6">
			<Tabs tabs={tabs} defaultTabId="plans">
				<TabPanel id="plans">
					<PlansTableSection
						plans={plansData?.data}
						meta={plansData?.meta}
						isLoading={plansLoading}
						isFetching={plansFetching}
						search={planSearch}
						onSearch={handlePlanSearch}
						onPageChange={setPlanPage}
						onCreate={openCreatePlan}
						onEdit={openEditPlan}
						onDelete={setDeletingPlan}
					/>
				</TabPanel>

				<TabPanel id="addons">
					<AddonsTableSection
						addons={addonsData?.data}
						meta={addonsData?.meta}
						isLoading={addonsLoading}
						isFetching={addonsFetching}
						search={addonSearch}
						onSearch={handleAddonSearch}
						onPageChange={setAddonPage}
						onCreate={openCreateAddon}
						onEdit={openEditAddon}
						onDelete={setDeletingAddon}
					/>
				</TabPanel>
			</Tabs>

			{/* Plan Modals */}
			<PlanFormModal
				open={planFormOpen}
				plan={editingPlan}
				onClose={() => setPlanFormOpen(false)}
			/>
			<DeletePlanModal
				plan={deletingPlan}
				onClose={() => setDeletingPlan(null)}
			/>

			{/* Add-on Modals */}
			<AddonFormModal
				open={addonFormOpen}
				addon={editingAddon}
				onClose={() => setAddonFormOpen(false)}
			/>
			<DeleteAddonModal
				addon={deletingAddon}
				onClose={() => setDeletingAddon(null)}
			/>
		</div>
	);
}

Page.layout = (page) => (
	<MainLayout
		title="Plans & Add-ons"
		subtitle="Manage hosting plans and add-on services"
	>
		{page}
	</MainLayout>
);
