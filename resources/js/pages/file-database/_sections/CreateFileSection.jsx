import React, { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { FileText, Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCreateWebsiteFileMutation } from "@/features/websites/websitesApi";

// Mirrors the server-side guard in StoreWebsiteFileRequest.
const INVALID_NAME_PATTERN = /[/\\]/;

export default function CreateFileSection({ open, onClose, website }) {
    const [createWebsiteFile, { isLoading }] = useCreateWebsiteFileMutation();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [upload, setUpload] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setName("");
            setContent("");
            setUpload(null);
            setError(null);
        }
    }, [open]);

    const trimmedName = name.trim();
    const nameIsValid =
        trimmedName.length > 0 &&
        trimmedName.length <= 255 &&
        !INVALID_NAME_PATTERN.test(trimmedName) &&
        trimmedName !== "." &&
        trimmedName !== "..";

    const handleUploadChange = (event) => {
        const selected = event.target.files?.[0] ?? null;
        setUpload(selected);
        if (selected) setContent("");
    };

    const clearUpload = () => {
        setUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!website || !nameIsValid) return;

        try {
            await createWebsiteFile({
                uuid: website.uuid,
                name: trimmedName,
                content,
                upload,
            }).unwrap();
            message.success(`${trimmedName} was created`);
            onClose();
        } catch (err) {
            if (err?.status === 422) {
                const fieldErrors = err?.data?.errors ?? {};
                setError(
                    fieldErrors.name?.[0] ??
                        fieldErrors.content?.[0] ??
                        fieldErrors.upload?.[0] ??
                        err?.data?.message ??
                        "That name is not valid.",
                );
                return;
            }

            setError(
                err?.data?.message ?? "We could not create that file. Please try again.",
            );
        }
    };

    return (
        <Modal
            title={website ? `Create file in ${website.name}` : "Create file"}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={480}
            destroyOnClose
        >
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="flex items-start gap-3 rounded-xl bg-blue-50/70 px-3.5 py-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <p className="text-xs text-slate-600">
                        Creates a file in the root folder of this site. Type
                        content below or upload a file — leave both empty for
                        a blank file.
                    </p>
                </div>

                <Input
                    label="File name"
                    name="file-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    disabled={isLoading}
                    maxLength={255}
                    required
                />

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isLoading || Boolean(upload)}
                        rows={6}
                        placeholder={
                            upload
                                ? "Clear the uploaded file to type content instead"
                                : "Optional file content…"
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Or upload a file
                    </label>
                    {upload ? (
                        <div className="flex items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-700">
                            <span className="truncate">{upload.name}</span>
                            <button
                                type="button"
                                onClick={clearUpload}
                                aria-label="Remove selected file"
                                className="shrink-0 text-slate-400 hover:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2.5 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600">
                            <Upload className="h-4 w-4" />
                            Choose a file
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleUploadChange}
                                disabled={isLoading || content.length > 0}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-1">
                    <Button type="button" outlined onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!nameIsValid || isLoading} loading={isLoading}>
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

