import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

import AddonsTableSection from "./_sections/AddonsTableSection";
import AddonFormModal from "./_sections/AddonFormModal";
import DeleteAddonModal from "./_sections/DeleteAddonModal";

import { useGetAdminAddonsQuery } from "@/features/addons/addonsApi";

// Plans are managed on /hosting; this page only manages add-ons.
export default function Page() {
	const [addonPage, setAddonPage] = useState(1);
	const [addonSearch, setAddonSearch] = useState("");
	const [addonFormOpen, setAddonFormOpen] = useState(false);
	const [editingAddon, setEditingAddon] = useState(null);
	const [deletingAddon, setDeletingAddon] = useState(null);

	const {
		data: addonsData,
		isLoading: addonsLoading,
		isFetching: addonsFetching,
	} = useGetAdminAddonsQuery({ page: addonPage, search: addonSearch });

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

	return (
		<div className="space-y-6">
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
	<MainLayout title="Add-ons" subtitle="Manage hosting add-on services">
		{page}
	</MainLayout>
);