import React, { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { Save, AlertCircle, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import {
    useGetWebsiteFileContentQuery,
    useUpdateWebsiteFileMutation,
} from "@/features/websites/websitesApi";

const EXT_LANG = {
    html: "HTML", htm: "HTML", css: "CSS", js: "JavaScript",
    jsx: "JSX", ts: "TypeScript", tsx: "TSX", json: "JSON",
    md: "Markdown", env: "ENV", php: "PHP", py: "Python",
    sh: "Shell", txt: "Text", xml: "XML", yml: "YAML",
    yaml: "YAML", sql: "SQL", htaccess: ".htaccess",
};

function langBadge(filename) {
    const ext = filename?.split(".").pop()?.toLowerCase();
    return EXT_LANG[ext] ?? ext?.toUpperCase() ?? "File";
}

export default function EditFileModal({ open, onClose, website, file }) {
    const [content, setContent] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const textareaRef = useRef(null);

    const skip = !open || !website || !file;

    const { data: originalContent, isFetching, isError, error } =
        useGetWebsiteFileContentQuery(
            { uuid: website?.uuid, path: file?.path },
            { skip },
        );

    const [updateWebsiteFile, { isLoading: isSaving }] =
        useUpdateWebsiteFileMutation();

    useEffect(() => {
        if (!isFetching && originalContent !== undefined) {
            setContent(originalContent);
            setIsDirty(false);
        }
    }, [originalContent, isFetching]);

    useEffect(() => {
        if (!open) {
            setContent("");
            setIsDirty(false);
        }
    }, [open]);

    const handleChange = (e) => {
        setContent(e.target.value);
        setIsDirty(true);
    };

    const handleSave = async () => {
        if (!website || !file) return;
        try {
            await updateWebsiteFile({
                uuid: website.uuid,
                path: file.path,
                content,
            }).unwrap();
            message.success(`${file.name} saved.`);
            setIsDirty(false);
        } catch (err) {
            message.error(
                err?.data?.message ?? "Could not save the file. Please try again.",
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const el = textareaRef.current;
            if (!el) return;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const next = content.substring(0, start) + "  " + content.substring(end);
            setContent(next);
            setIsDirty(true);
            requestAnimationFrame(() => {
                el.selectionStart = start + 2;
                el.selectionEnd = start + 2;
            });
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            handleSave();
        }
    };

    const filename = file?.name ?? "File";
    const badge = langBadge(filename);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={780}
            destroyOnClose
            title={
                <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="truncate text-sm font-semibold text-slate-800">
                        {filename}
                    </span>
                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        {badge}
                    </span>
                    {isDirty && (
                        <span className="ml-auto mr-8 shrink-0 text-[10px] font-medium text-amber-500">
                            Unsaved changes
                        </span>
                    )}
                </div>
            }
        >
            <div className="flex flex-col gap-3 pt-1">
                {/* Loading skeleton */}
                {isFetching && (
                    <div className="flex flex-col gap-2 animate-pulse py-4">
                        {[80, 65, 90, 55, 70].map((w, i) => (
                            <div key={i} className="h-3 rounded bg-slate-200" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!isFetching && isError && (
                    <div className="flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <p className="text-sm text-red-700">
                            {error?.data?.message ?? "Could not load this file. It may be binary or too large to edit."}
                        </p>
                    </div>
                )}

                {/* Editor */}
                {!isFetching && !isError && (
                    <textarea
                        ref={textareaRef}
                        id="file-editor-textarea"
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSaving}
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        rows={22}
                        className="w-full resize-y rounded-lg border border-gray-700 bg-[#0f1117] px-4 py-3.5 font-mono text-[13px] leading-relaxed text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-slate-400">
                        <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">Ctrl+S</kbd>{" "}
                        to save &nbsp;·&nbsp;{" "}
                        <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">Tab</kbd>{" "}
                        to indent
                    </p>
                    <div className="flex gap-2">
                        <Button type="button" outlined onClick={onClose} disabled={isSaving}>
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={!isDirty || isSaving || isFetching || isError}
                            loading={isSaving}
                        >
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
