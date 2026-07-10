import { useDeferredValue, useState } from 'react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import TextInput from '@/components/TextInput';
import {
    useGetActiveSessionQuery,
    useGetClassroomMaterialsQuery,
    useGetPublicClassroomQuery,
    useGetPublicClassroomsQuery,
} from '@/features/classroom/classroomApi';
import ClassroomDetailPanel from './ClassroomDetailPanel';

export default function ClassroomBrowserSection() {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const deferredSearch = useDeferredValue(search);
    const publicClassroomsState = useGetPublicClassroomsQuery({ search: deferredSearch }, { refetchOnMountOrArgChange: true });
    const publicClassroomState = useGetPublicClassroomQuery(selectedId, { skip: !selectedId, refetchOnMountOrArgChange: true });
    const materialsState = useGetClassroomMaterialsQuery(selectedId, { skip: !selectedId, refetchOnMountOrArgChange: true });
    const activeSessionState = useGetActiveSessionQuery(selectedId, { skip: !selectedId, refetchOnMountOrArgChange: true });
    const classrooms = publicClassroomsState.data?.data ?? [];

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_65%,_#cbd5e1)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <section className="rounded-[2rem] bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Student browser</p>
                    <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div>
                            <h1 className="text-3xl font-semibold sm:text-4xl">Discover published classrooms from the standalone web app</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Browse teacher-published classrooms, inspect available materials, and see whether a live session is available without relying on the mobile app.
                            </p>
                            <p className="mt-3 max-w-2xl text-xs uppercase tracking-[0.18em] text-slate-400">
                                When a teacher starts a live session, this browser can surface signaling readiness for web learners.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                            <label htmlFor="browse-search" className="text-sm font-medium text-slate-200">
                                Search classrooms
                            </label>
                            <TextInput
                                id="browse-search"
                                className="mt-2 block w-full border-white/20 bg-white text-slate-900"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name, topic, or schedule"
                            />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Published classrooms</h2>
                                <p className="mt-1 text-sm text-slate-500">Open a classroom to inspect its details and published files.</p>
                            </div>
                            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                                {classrooms.length} result{classrooms.length === 1 ? '' : 's'}
                            </div>
                        </div>

                        {publicClassroomsState.isLoading ? (
                            <div className="mt-6 space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-200 p-4">
                                        <Skeleton className="h-5 w-40 rounded-xl" />
                                        <Skeleton className="mt-3 h-4 w-full rounded-xl" />
                                        <Skeleton className="mt-2 h-4 w-5/6 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {!publicClassroomsState.isLoading && classrooms.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                <p className="text-lg font-semibold text-slate-900">No classrooms matched your search</p>
                                <p className="mt-2 text-sm text-slate-500">Clear the search to browse every published classroom or wait for teachers to publish more content.</p>
                                <Button type="button" variant="secondary" className="mt-4" onClick={() => setSearch('')}>
                                    Clear search
                                </Button>
                            </div>
                        ) : null}

                        <div className="mt-6 space-y-4">
                            {classrooms.map((classroom) => {
                                const isSelected = selectedId === classroom.id;

                                return (
                                    <button
                                        key={classroom.id}
                                        type="button"
                                        onClick={() => setSelectedId(classroom.id)}
                                        className={`w-full rounded-2xl border p-4 text-left transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="text-lg font-semibold">{classroom.name}</p>
                                                <p className={`mt-1 text-sm ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                                                    {classroom.owner_name || 'Unknown teacher'}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {classroom.material_count || 0} files
                                            </span>
                                        </div>
                                        <p className={`mt-3 text-sm ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                            {classroom.description || 'No description yet.'}
                                        </p>
                                        <p className={`mt-3 text-xs uppercase tracking-[0.18em] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                            {classroom.schedule || 'Schedule to be announced'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <ClassroomDetailPanel
                        classroom={publicClassroomState.data}
                        materials={materialsState.data?.data ?? []}
                        isLoading={publicClassroomState.isLoading || materialsState.isLoading}
                        activeSessionState={activeSessionState}
                        onBack={() => setSelectedId(null)}
                    />
                </section>
            </div>
        </div>
    );
}