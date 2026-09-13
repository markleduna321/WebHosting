import {
    Folder,
    FolderOpen,
    FileText,
    Download,
    Trash2,
    ChevronRight,
    Home,
} from "lucide-react";
import Button from "@/components/ui/Button";
import React, { useState, useMemo, useCallback } from "react";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const ROOT_ITEMS = [
    {
        id: 1,
        name: "My Portfolio",
        type: "folder",
        updatedAt: "2 hours ago",
        children: [
            {
                id: 101,
                name: "public",
                type: "folder",
                updatedAt: "2 hours ago",
                children: [
                    { id: 1011, name: "index.html",  type: "file", size: "8.2 KB", updatedAt: "2 hours ago" },
                    { id: 1012, name: "style.css",   type: "file", size: "4.1 KB", updatedAt: "2 hours ago" },
                    { id: 1013, name: "favicon.ico", type: "file", size: "1.1 KB", updatedAt: "Jul 12" },
                ],
            },
            {
                id: 102,
                name: "src",
                type: "folder",
                updatedAt: "3 hours ago",
                children: [
                    { id: 1021, name: "App.jsx",  type: "file", size: "3.4 KB", updatedAt: "3 hours ago" },
                    { id: 1022, name: "main.jsx", type: "file", size: "512 B",  updatedAt: "3 hours ago" },
                ],
            },
            { id: 103, name: ".env",         type: "file", size: "256 B",  updatedAt: "Jul 10" },
            { id: 104, name: "package.json", type: "file", size: "1.8 KB", updatedAt: "Jul 10" },
            { id: 105, name: "README.md",    type: "file", size: "2.3 KB", updatedAt: "Jul 9"  },
        ],
    },
    {
        id: 2,
        name: "Thesis Capstone",
        type: "folder",
        updatedAt: "2 hours ago",
        children: [
            {
                id: 201,
                name: "backend",
                type: "folder",
                updatedAt: "Yesterday",
                children: [
                    { id: 2011, name: "server.js", type: "file", size: "5.6 KB", updatedAt: "Yesterday" },
                    { id: 2012, name: "routes.js", type: "file", size: "3.2 KB", updatedAt: "Yesterday" },
                ],
            },
            {
                id: 202,
                name: "frontend",
                type: "folder",
                updatedAt: "Yesterday",
                children: [
                    { id: 2021, name: "index.html", type: "file", size: "6.1 KB", updatedAt: "Yesterday" },
                    { id: 2022, name: "app.js",     type: "file", size: "4.9 KB", updatedAt: "Yesterday" },
                ],
            },
            { id: 203, name: "README.md", type: "file", size: "1.2 KB", updatedAt: "Jul 8" },
        ],
    },
];

// Module-level constant — never recreated
const EXT_COLORS = {
    html:     "text-orange-400",
    css:      "text-blue-400",
    js:       "text-yellow-400",
    jsx:      "text-cyan-400",
    ts:       "text-blue-500",
    tsx:      "text-cyan-500",
    md:       "text-slate-400",
    json:     "text-green-400",
    env:      "text-red-400",
    ico:      "text-purple-400",
    htaccess: "text-slate-400",
};

function fileIconColor(name) {
    const ext = name.split(".").pop().toLowerCase();
    return EXT_COLORS[ext] ?? "text-slate-400";
}

function itemLabel(item) {
    if (item.type !== "folder") return item.size;
    const n = item.children.length;
    return `${n} item${n !== 1 ? "s" : ""}`;
}

// ---------------------------------------------------------------------------
// Shared action buttons — used by both row and mobile card
// ---------------------------------------------------------------------------
function ItemActions({ item }) {
    return (
        <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
        >
            {item.type === "file" && (
                <Button
                    variant="outline"
                    aria-label="Download"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                </Button>
            )}
            <Button
                variant="outline"
                aria-label="Delete"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Desktop table row
// ---------------------------------------------------------------------------
function FileRow({ item, onOpenFolder }) {
    const isFolder = item.type === "folder";
    const iconCls  = isFolder ? "text-blue-400" : fileIconColor(item.name);
    const Icon     = isFolder ? Folder : FileText;

    return (
        <tr
            onClick={() => isFolder && onOpenFolder(item)}
            className={`border-b border-gray-100 transition-colors group ${
                isFolder ? "hover:bg-blue-50/40 cursor-pointer" : "hover:bg-gray-50/80"
            }`}
        >
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${iconCls}`} />
                    <div>
                        <p className={`text-sm font-medium ${isFolder ? "text-blue-600 group-hover:underline" : "text-slate-800"}`}>
                            {item.name}
                        </p>
                        <p className="text-xs text-slate-400">{itemLabel(item)}</p>
                    </div>
                </div>
            </td>

            <td className="py-3 px-4 text-xs text-slate-400 hidden sm:table-cell">
                {item.updatedAt}
            </td>

            <td className="py-3 px-4">
                <div className="flex items-center justify-end">
                    <ItemActions item={item} />
                    {isFolder && (
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            </td>
        </tr>
    );
}

// ---------------------------------------------------------------------------
// Mobile card
// ---------------------------------------------------------------------------
function FileMobileCard({ item, onOpenFolder }) {
    const isFolder = item.type === "folder";
    const iconCls  = isFolder ? "text-blue-400" : fileIconColor(item.name);
    const Icon     = isFolder ? Folder : FileText;

    return (
        <div
            onClick={() => isFolder && onOpenFolder(item)}
            className={`flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 ${
                isFolder ? "cursor-pointer hover:bg-blue-50/40" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${iconCls}`} />
                <div>
                    <p className={`text-sm font-medium ${isFolder ? "text-blue-600" : "text-slate-800"}`}>
                        {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                        {itemLabel(item)} · {item.updatedAt}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <ItemActions item={item} />
                {isFolder && <ChevronRight className="w-4 h-4 text-slate-300 ml-1" />}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (
        <p className="py-10 text-center text-sm text-slate-400">
            This folder is empty.
        </p>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function FileTableSection() {
    const [stack, setStack] = useState([]);

    const currentItems = stack.length === 0
        ? ROOT_ITEMS
        : stack[stack.length - 1].children;

    const sorted = useMemo(
        () =>
            [...currentItems].sort((a, b) => {
                if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
                return a.name.localeCompare(b.name);
            }),
        [currentItems],
    );

    const openFolder  = useCallback((folder) => setStack((prev) => [...prev, folder]), []);
    const goToRoot    = useCallback(() => setStack([]), []);
    const navigateTo  = useCallback((i) => setStack((prev) => prev.slice(0, i + 1)), []);

    const currentFolder = stack[stack.length - 1];

    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 text-sm text-slate-500 flex-wrap">
                <button
                    type="button"
                    onClick={goToRoot}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors font-medium"
                >
                    <Home className="w-3.5 h-3.5" />
                    <span>Files</span>
                </button>

                {stack.map((folder, i) => (
                    <React.Fragment key={folder.id}>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <button
                            type="button"
                            onClick={() => navigateTo(i)}
                            className={`hover:text-blue-600 transition-colors font-medium ${
                                i === stack.length - 1 ? "text-slate-800 pointer-events-none" : ""
                            }`}
                        >
                            {folder.name}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Current folder header */}
            {currentFolder && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-gray-100">
                    <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{currentFolder.name}</span>
                    <span className="text-xs text-slate-400 ml-1">
                        {sorted.length} item{sorted.length !== 1 ? "s" : ""}
                    </span>
                </div>
            )}

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 text-xs font-medium border-b border-gray-100">
                            <th className="py-2.5 px-4">Name</th>
                            <th className="py-2.5 px-4 hidden sm:table-cell">Last modified</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length === 0
                            ? <tr><td colSpan={3}><EmptyState /></td></tr>
                            : sorted.map((item) => (
                                <FileRow key={item.id} item={item} onOpenFolder={openFolder} />
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-3 space-y-2">
                {sorted.length === 0
                    ? <EmptyState />
                    : sorted.map((item) => (
                        <FileMobileCard key={item.id} item={item} onOpenFolder={openFolder} />
                    ))
                }
            </div>
        </div>
    );
}
