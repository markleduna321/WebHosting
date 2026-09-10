import { Folder, FileText, Download, Trash2 } from "lucide-react";
import React from "react";
import Table from "@/components/ui/Table";

export default function TableSection() {
    const ITEMS = [
        {
            id: 1,
            name: "My Portfolio",
            meta: "3 items · 2 hours ago",
            type: "folder",
        },
        {
            id: 2,
            name: "Thesis Capstone",
            meta: "2 items · 2 hours ago",
            type: "folder",
        },
        {
            id: 3,
            name: ".env.example",
            meta: "412 B · Jul 12",
            type: "file",
        },
    ];

    const COLUMNS = [
        {
            header: "Folders",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.type === "folder" ? (
                        <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            {row.name}
                        </p>
                        <p className="text-xs text-slate-400">{row.meta}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center justify-end gap-1">
                    {row.type === "file" && (
                        <button
                            aria-label="Download"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        aria-label="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-2">
            <Table columns={COLUMNS} data={ITEMS} />
        </div>
    );
}
