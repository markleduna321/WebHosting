import React, { useEffect, useState } from "react";
import DropDown from "@/components/ui/Dropdown";
import { useGetWebsitesQuery } from "@/features/websites/websitesApi";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import CreateFileSection from "./CreateFileSection";

export default function FileSearchSection({ onSelect }) {
    const { data: sites = [], isLoading } = useGetWebsitesQuery();
    const [selectedUuid, setSelectedUuid] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        if (!selectedUuid && sites.length > 0) {
            setSelectedUuid(sites[0].uuid);
        }
    }, [sites, selectedUuid]);

    const selected = sites.find((site) => site.uuid === selectedUuid);

    useEffect(() => {
        onSelect?.(selected ?? null);
    }, [selected, onSelect]);

    const items = sites.map((site) => ({
        label: site.name,
        onClick: () => setSelectedUuid(site.uuid),
    }));

    const buttonText = isLoading
        ? "Loading…"
        : (selected?.name ?? "No sites yet");

    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <p className="text-xs text-slate-500 mb-1.5">Website</p>
                <DropDown buttonText={buttonText} items={items} align="left" />
                {!isLoading && sites.length === 0 && (
                    <p className="mt-1.5 text-xs text-slate-400">
                        Deploy a site to browse its files here.
                    </p>
                )}

            </div>
            <div className="flex justify-end mr-6">
                <Button
                    type="button"
                    outlined
                    onClick={() => setIsCreateOpen(true)}
                    disabled={!selected}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create File</span>
                </Button>
            </div>
            <CreateFileSection
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                website={selected}
            />
        </div>
    );
}
