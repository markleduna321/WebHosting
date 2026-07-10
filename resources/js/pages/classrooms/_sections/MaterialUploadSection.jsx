import { useState } from 'react';
import Button from '@/components/ui/Button';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import { useDeleteMaterialMutation, useUploadMaterialMutation } from '@/features/classroom/classroomApi';
import ConfirmActionModal from './ConfirmActionModal';

function createUuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `material-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export default function MaterialUploadSection({ classroom, onFeedback }) {
    const [uploadMaterial, uploadState] = useUploadMaterialMutation();
    const [deleteMaterial, deleteState] = useDeleteMaterialMutation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [confirmingMaterialId, setConfirmingMaterialId] = useState(null);

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setError('Choose a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('id', createUuid());
        formData.append('file', selectedFile);
        formData.append('original_name', selectedFile.name);
        formData.append('mime_type', selectedFile.type || 'application/octet-stream');
        formData.append('size_bytes', String(selectedFile.size));

        setError('');

        try {
            await uploadMaterial({ classroomId: classroom.id, formData }).unwrap();
            setSelectedFile(null);
            const input = document.getElementById(`material-file-${classroom.id}`);

            if (input) {
                input.value = '';
            }

            onFeedback('Material uploaded.');
        } catch (uploadError) {
            setError(uploadError?.data?.message || uploadError?.data?.errors?.file?.[0] || 'Upload failed.');
        }
    };

    const handleDelete = async (materialId) => {
        try {
            await deleteMaterial({ classroomId: classroom.id, materialId }).unwrap();
            setConfirmingMaterialId(null);
            onFeedback('Material deleted.');
        } catch (deleteError) {
            setError(deleteError?.data?.message || 'Material deletion failed.');
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                    <InputLabel htmlFor={`material-file-${classroom.id}`} value="Attach material" />
                    <input
                        id={`material-file-${classroom.id}`}
                        type="file"
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                        onChange={(event) => {
                            setSelectedFile(event.target.files?.[0] || null);
                            setError('');
                        }}
                    />
                    <InputError className="mt-2" message={error} />
                </div>

                <Button type="button" loading={uploadState.isLoading} onClick={handleUpload} className="w-full lg:w-auto">
                    Upload material
                </Button>
            </div>

            <div className="mt-4 space-y-3">
                {classroom.materials?.length ? (
                    classroom.materials.map((material) => (
                        <div key={material.id} className="rounded-xl border border-slate-200 bg-white p-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{material.original_name}</p>
                                    <p className="text-sm text-slate-500">
                                        {material.mime_type} · {Math.max(1, Math.round(material.size_bytes / 1024))} KB
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={material.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Open
                                    </a>
                                    <Button type="button" variant="danger" onClick={() => setConfirmingMaterialId(material.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
                        <p className="font-medium text-slate-900">No materials yet</p>
                        <p className="mt-1 text-sm text-slate-500">Upload the first file so mobile and web learners can access it later.</p>
                        <Button
                            type="button"
                            variant="secondary"
                            className="mt-4"
                            onClick={() => document.getElementById(`material-file-${classroom.id}`)?.focus()}
                        >
                            Choose a file
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmActionModal
                open={Boolean(confirmingMaterialId)}
                title="Delete material"
                description="This will remove the file from the published classroom and the web workspace."
                confirmLabel="Delete material"
                loading={deleteState.isLoading}
                onCancel={() => setConfirmingMaterialId(null)}
                onConfirm={() => handleDelete(confirmingMaterialId)}
            />
        </div>
    );
}