import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Table from '@/components/Table';
import TextInput from '@/components/TextInput';
import {
    useCreateClassroomMutation,
    useDeleteClassroomMutation,
    useGetOwnedClassroomsQuery,
    useUpdateClassroomMutation,
} from '@/features/classroom/classroomApi';
import {
    useCallOnParticipantMutation,
    useCreateSessionMutation,
    useEndSessionMutation,
    useGetQuizResultsQuery,
    useGetSessionQuery,
    useGetSessionChatQuery,
    useGetSessionParticipantsQuery,
    useLowerHandMutation,
    useRaiseHandMutation,
    useSendSessionChatMessageMutation,
    useSendParticipantCommandMutation,
    useSendWebRtcSignalMutation,
} from '@/features/session/sessionApi';
import useSessionChannel from '@/features/session/useSessionChannel';
import ConfirmActionModal from './ConfirmActionModal';
import MaterialUploadSection from './MaterialUploadSection';

function createUuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `classroom-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

const emptyForm = {
    id: '',
    name: '',
    description: '',
    schedule: '',
};

export default function ClassroomManagementSection() {
    const { data: response, isLoading } = useGetOwnedClassroomsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [createClassroom, createState] = useCreateClassroomMutation();
    const [updateClassroom, updateState] = useUpdateClassroomMutation();
    const [deleteClassroom, deleteState] = useDeleteClassroomMutation();
    const [createSession, createSessionState] = useCreateSessionMutation();
    const [endSession, endSessionState] = useEndSessionMutation();
    const [raiseHand, raiseHandState] = useRaiseHandMutation();
    const [lowerHand, lowerHandState] = useLowerHandMutation();
    const [callOnParticipant, callOnParticipantState] = useCallOnParticipantMutation();
    const [sendSessionChatMessage, sendSessionChatMessageState] = useSendSessionChatMessageMutation();
    const [sendWebRtcSignal, sendWebRtcSignalState] = useSendWebRtcSignalMutation();
    const [sendParticipantCommand, sendParticipantCommandState] = useSendParticipantCommandMutation();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
    const [confirmingEndSessionId, setConfirmingEndSessionId] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [teacherChatBody, setTeacherChatBody] = useState('');

    const sessionState = useGetSessionQuery(selectedSessionId, { skip: !selectedSessionId, refetchOnMountOrArgChange: true });
    const sessionParticipantsState = useGetSessionParticipantsQuery(selectedSessionId, { skip: !selectedSessionId, refetchOnMountOrArgChange: true });
    const quizResultsState = useGetQuizResultsQuery(selectedSessionId, { skip: !selectedSessionId, refetchOnMountOrArgChange: true });
    const sessionChatState = useGetSessionChatQuery(selectedSessionId, { skip: !selectedSessionId, refetchOnMountOrArgChange: true });
    const sessionChannelState = useSessionChannel({
        channelName: sessionState.data?.channel,
        sessionId: selectedSessionId,
        enabled: Boolean(selectedSessionId && sessionState.data?.channel),
    });

    const classrooms = response?.data ?? [];

    useEffect(() => {
        const requestError = createState.error || updateState.error || deleteState.error || createSessionState.error || endSessionState.error || raiseHandState.error || lowerHandState.error || callOnParticipantState.error;
        const signalingError = sendWebRtcSignalState.error || sendParticipantCommandState.error || sendSessionChatMessageState.error;

        const combinedError = requestError || signalingError;

        if (!combinedError) {
            return;
        }

        if (combinedError.data?.errors) {
            setErrors(combinedError.data.errors);
            return;
        }

        setErrors({ _global: combinedError.data?.message || 'Request failed.' });
    }, [createState.error, updateState.error, deleteState.error, createSessionState.error, endSessionState.error, raiseHandState.error, lowerHandState.error, callOnParticipantState.error, sendWebRtcSignalState.error, sendParticipantCommandState.error, sendSessionChatMessageState.error]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setErrors({});
    };

    const submit = async (event) => {
        event.preventDefault();
        setErrors({});
        setFeedback('');

        try {
            if (editingId) {
                await updateClassroom({
                    id: editingId,
                    name: form.name,
                    description: form.description,
                    schedule: form.schedule,
                }).unwrap();

                setFeedback('Classroom updated.');
            } else {
                await createClassroom({
                    id: createUuid(),
                    name: form.name,
                    description: form.description,
                    schedule: form.schedule,
                }).unwrap();

                setFeedback('Classroom published.');
            }

            resetForm();
        } catch {
            // handled by mutation state
        }
    };

    const beginEdit = (classroom) => {
        setEditingId(classroom.id);
        setForm({
            id: classroom.id,
            name: classroom.name || '',
            description: classroom.description || '',
            schedule: classroom.schedule || '',
        });
        setErrors({});
        setFeedback('');
    };

    const handleDelete = async (id) => {
        setErrors({});

        try {
            await deleteClassroom(id).unwrap();
            setConfirmingDeleteId(null);
            setExpandedId((current) => (current === id ? null : current));
            setFeedback('Classroom deleted.');
            if (editingId === id) {
                resetForm();
            }
        } catch {
            // handled by mutation state
        }
    };

    const handleStartSession = async (classroomId) => {
        setErrors({});
        setFeedback('');

        try {
            const response = await createSession({ classroom_id: classroomId }).unwrap();
            setFeedback(`Live session started on channel ${response.channel}.`);
        } catch {
            // handled by mutation state
        }
    };

    const handleEndSession = async (sessionId) => {
        setErrors({});

        try {
            await endSession(sessionId).unwrap();
            setConfirmingEndSessionId(null);
            setSelectedSessionId(null);
            setFeedback('Live session ended.');
        } catch {
            // handled by mutation state
        }
    };

    const handleTeacherSignal = async (sessionId, event, data, successMessage) => {
        setErrors({});

        try {
            await sendWebRtcSignal({ id: sessionId, event, data }).unwrap();
            setFeedback(successMessage);
        } catch {
            // handled by mutation state
        }
    };

    const handleParticipantCommand = async (sessionId, event, data, successMessage) => {
        setErrors({});

        try {
            await sendParticipantCommand({ id: sessionId, event, data }).unwrap();
            setFeedback(successMessage);
        } catch {
            // handled by mutation state
        }
    };

    const handleTeacherChatSubmit = async (event) => {
        event.preventDefault();

        if (!selectedSessionId || !teacherChatBody.trim()) {
            return;
        }

        setErrors({});

        try {
            await sendSessionChatMessage({
                id: selectedSessionId,
                sender_id: 'teacher-web',
                sender_name: 'Teacher',
                is_teacher: true,
                body: teacherChatBody.trim(),
            }).unwrap();

            setTeacherChatBody('');
            setFeedback('Teacher chat message sent.');
        } catch {
            // handled by mutation state
        }
    };

    const handleCallOnFromQueue = async (studentId, studentName) => {
        if (!selectedSessionId) {
            return;
        }

        setErrors({});

        try {
            await callOnParticipant({
                id: selectedSessionId,
                student_id: studentId,
                student_name: studentName,
            }).unwrap();

            setFeedback(`Called on ${studentName}.`);
        } catch {
            // handled by mutation state
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Classroom',
            render: (classroom) => (
                <div>
                    <p className="font-medium text-slate-900">{classroom.name}</p>
                    <p className="text-xs text-slate-500">{classroom.description || 'No description yet'}</p>
                </div>
            ),
        },
        {
            key: 'schedule',
            label: 'Schedule',
            render: (classroom) => classroom.schedule || 'Unscheduled',
        },
        {
            key: 'material_count',
            label: 'Materials',
            render: (classroom) => classroom.material_count || 0,
        },
        {
            key: 'live',
            label: 'Live',
            render: (classroom) => (
                classroom.active_session ? (
                    <button
                        type="button"
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        onClick={() => setSelectedSessionId(classroom.active_session.id)}
                    >
                        Live now
                    </button>
                ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">Offline</span>
                )
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (classroom) => (
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setExpandedId((current) => current === classroom.id ? null : classroom.id)}>
                        {expandedId === classroom.id ? 'Hide materials' : 'Materials'}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => beginEdit(classroom)}>
                        Edit
                    </Button>
                    {classroom.active_session ? (
                        <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmingEndSessionId(classroom.active_session.id)}>
                            End session
                        </Button>
                    ) : (
                        <Button type="button" variant="primary" size="sm" loading={createSessionState.isLoading} onClick={() => handleStartSession(classroom.id)}>
                            Start session
                        </Button>
                    )}
                    <Button type="button" variant="danger" size="sm" onClick={() => setConfirmingDeleteId(classroom.id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl bg-slate-900 p-6 text-white">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Teacher publishing</p>
                    <h2 className="mt-3 text-3xl font-semibold">Publish classrooms for the standalone web workspace</h2>
                    <p className="mt-3 max-w-2xl text-sm text-slate-300">
                        Create a classroom once, upload the materials, and keep the web app ready without depending on the mobile client.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Your published classrooms</h3>
                            <p className="text-sm text-slate-500">Manage the teacher-facing catalog and uploaded files.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                            {classrooms.length} active classroom{classrooms.length === 1 ? '' : 's'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">{editingId ? 'Update classroom' : 'Publish a classroom'}</h3>
                        <p className="mt-1 text-sm text-slate-500">Use the same classroom details your learners will later see across web and mobile.</p>
                    </div>

                    {feedback && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div>}
                    {errors._global && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors._global}</div>}

                    <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="classroom-name" value="Classroom name" />
                            <TextInput
                                id="classroom-name"
                                className="mt-1 block w-full"
                                value={form.name}
                                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            />
                            <InputError className="mt-2" message={errors.name?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="classroom-description" value="Description" />
                            <textarea
                                id="classroom-description"
                                rows="4"
                                className="mt-1 block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={form.description}
                                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                            />
                            <InputError className="mt-2" message={errors.description?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="classroom-schedule" value="Schedule" />
                            <TextInput
                                id="classroom-schedule"
                                className="mt-1 block w-full"
                                value={form.schedule}
                                onChange={(event) => setForm((current) => ({ ...current, schedule: event.target.value }))}
                            />
                            <InputError className="mt-2" message={errors.schedule?.[0]} />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" loading={createState.isLoading || updateState.isLoading} className="flex-1">
                                {editingId ? 'Save changes' : 'Publish classroom'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {classrooms.length === 0 && !isLoading ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                                <p className="text-lg font-semibold text-slate-900">No classrooms published yet</p>
                                <p className="mt-2 text-sm text-slate-500">Create the first classroom to start syncing materials for independent web access.</p>
                                <Button
                                    type="button"
                                    className="mt-4"
                                    onClick={() => document.getElementById('classroom-name')?.focus()}
                                >
                                    Create first classroom
                                </Button>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                data={classrooms}
                                loading={isLoading}
                                className="border-slate-200"
                                emptyMessage="No classrooms available."
                            />
                        )}
                    </div>

                    {classrooms.map((classroom) => (
                        <div key={classroom.id} className={expandedId === classroom.id ? 'block' : 'hidden'}>
                            {classroom.active_session && (
                                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-medium text-emerald-900">Live session active</p>
                                            <p className="mt-1 text-sm text-emerald-700">
                                                Channel {classroom.active_session.channel} · WS {classroom.active_session.ws_url}
                                            </p>
                                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-800">
                                                Bridge traffic is rate-limited per session to protect participant-update bursts.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" variant="secondary" onClick={() => setSelectedSessionId(classroom.active_session.id)}>
                                                View participants
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                loading={sendWebRtcSignalState.isLoading}
                                                onClick={() => handleTeacherSignal(
                                                    classroom.active_session.id,
                                                    'VIDEO_SESSION_READY',
                                                    { sessionId: classroom.active_session.id },
                                                    'Video signaling readiness broadcasted.'
                                                )}
                                            >
                                                Signal ready
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                loading={sendParticipantCommandState.isLoading}
                                                onClick={() => handleParticipantCommand(
                                                    classroom.active_session.id,
                                                    'MUTE_COMMAND',
                                                    { target: 'all', action: 'mute' },
                                                    'Mute-all command sent.'
                                                )}
                                            >
                                                Mute all
                                            </Button>
                                            <Button type="button" variant="danger" onClick={() => setConfirmingEndSessionId(classroom.active_session.id)}>
                                                End live session
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <MaterialUploadSection classroom={classroom} onFeedback={setFeedback} />
                        </div>
                    ))}

                    {selectedSessionId && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900">Session participants</h4>
                                    <p className="text-sm text-slate-500">Current participants for the selected live classroom session.</p>
                                </div>
                                <Button type="button" variant="secondary" onClick={() => setSelectedSessionId(null)}>
                                    Close
                                </Button>
                            </div>

                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-900">Realtime session channel</p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {sessionState.data?.channel || 'Waiting for session details...'}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                    {sessionChannelState.connected ? 'Connected to Reverb listener.' : 'Listener not connected yet.'}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                    {sessionChannelState.members.length} member{sessionChannelState.members.length === 1 ? '' : 's'} present in realtime.
                                </p>
                                {sessionChannelState.lastEventName ? (
                                    <p className="mt-2 text-xs text-emerald-700">
                                        Last event: {sessionChannelState.lastEventName} at {new Date(sessionChannelState.lastEventAt).toLocaleTimeString()}
                                    </p>
                                ) : null}
                                {sessionChannelState.error ? (
                                    <p className="mt-2 text-xs text-rose-600">{sessionChannelState.error}</p>
                                ) : null}
                                {sessionChannelState.members.length > 0 ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {sessionChannelState.members.map((member) => (
                                            <span key={member.id} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                                                {member.name} · {member.role}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            {sessionParticipantsState.isLoading ? (
                                <p className="mt-4 text-sm text-slate-500">Loading participants...</p>
                            ) : null}

                            {!sessionParticipantsState.isLoading && (sessionParticipantsState.data?.data?.length ?? 0) === 0 ? (
                                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                                    No participants have joined this session yet.
                                </div>
                            ) : null}

                            {sessionChannelState.members.length > 0 ? (
                                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                    <p className="text-sm font-medium text-emerald-900">Realtime presence</p>
                                    <div className="mt-3 space-y-2">
                                        {sessionChannelState.members.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                                                <span>{member.name}</span>
                                                <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{member.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {(sessionParticipantsState.data?.data ?? []).length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {(sessionParticipantsState.data?.data ?? []).map((participant) => (
                                        <div key={participant.id} className="rounded-2xl border border-slate-200 p-4">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900">{participant.student_name}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{participant.student_id}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        loading={sendParticipantCommandState.isLoading}
                                                        onClick={() => handleParticipantCommand(
                                                            selectedSessionId,
                                                            'CALLED_ON',
                                                            { target: participant.student_id },
                                                            `Called on ${participant.student_name}.`
                                                        )}
                                                    >
                                                        Call on
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        loading={sendParticipantCommandState.isLoading}
                                                        onClick={() => handleParticipantCommand(
                                                            selectedSessionId,
                                                            'MUTE_COMMAND',
                                                            { target: participant.student_id, action: 'mute' },
                                                            `Mute command sent to ${participant.student_name}.`
                                                        )}
                                                    >
                                                        Mute
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="mt-8">
                                <h5 className="text-base font-semibold text-slate-900">Raised hands</h5>
                                {sessionState.isLoading ? (
                                    <p className="mt-3 text-sm text-slate-500">Loading hand queue...</p>
                                ) : null}
                                {!sessionState.isLoading && (sessionState.data?.hand_queue?.length ?? 0) === 0 ? (
                                    <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                        No one has raised a hand yet.
                                    </div>
                                ) : null}
                                {(sessionState.data?.hand_queue ?? []).length > 0 ? (
                                    <div className="mt-3 space-y-3">
                                        {(sessionState.data?.hand_queue ?? []).map((entry, index) => (
                                            <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{index + 1}. {entry.student_name}</p>
                                                        <p className="mt-1 text-sm text-slate-500">{entry.student_id}</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        loading={callOnParticipantState.isLoading}
                                                        onClick={() => handleCallOnFromQueue(entry.student_id, entry.student_name)}
                                                    >
                                                        Call on
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                                <div>
                                    <h5 className="text-base font-semibold text-slate-900">Quiz results</h5>
                                    {quizResultsState.isLoading ? (
                                        <p className="mt-3 text-sm text-slate-500">Loading quiz submissions...</p>
                                    ) : null}
                                    {!quizResultsState.isLoading && (quizResultsState.data?.data?.length ?? 0) === 0 ? (
                                        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                            No quiz submissions have been received yet.
                                        </div>
                                    ) : null}
                                    {(quizResultsState.data?.data ?? []).length > 0 ? (
                                        <div className="mt-3 space-y-3">
                                            {(quizResultsState.data?.data ?? []).map((submission) => (
                                                <div key={submission.id} className="rounded-2xl border border-slate-200 p-4">
                                                    <p className="font-medium text-slate-900">{submission.student_name}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{submission.quiz_title}</p>
                                                    <p className="mt-2 text-sm text-slate-700">Score {submission.score} / {submission.total}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div>
                                    <h5 className="text-base font-semibold text-slate-900">Session chat</h5>
                                    <div className="mt-3 max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        {(sessionChatState.data?.data ?? []).length > 0 ? (
                                            (sessionChatState.data?.data ?? []).map((message) => (
                                                <div key={message.id} className="rounded-xl bg-white p-3 shadow-sm">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="font-medium text-slate-900">{message.sender_name}</p>
                                                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                                                            {message.is_teacher ? 'Teacher' : 'Student'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-600">{message.body}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                                                No chat messages yet. Send the first teacher message to start the discussion.
                                            </div>
                                        )}
                                    </div>

                                    <form className="mt-4 space-y-3" onSubmit={handleTeacherChatSubmit}>
                                        <textarea
                                            rows="3"
                                            className="block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={teacherChatBody}
                                            onChange={(event) => setTeacherChatBody(event.target.value)}
                                            placeholder="Share instructions or feedback with the live classroom"
                                        />
                                        <Button type="submit" loading={sendSessionChatMessageState.isLoading}>
                                            Send teacher message
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <ConfirmActionModal
                open={Boolean(confirmingDeleteId)}
                title="Delete classroom"
                description="This removes the published classroom and all uploaded materials from the web workspace."
                confirmLabel="Delete classroom"
                loading={deleteState.isLoading}
                onCancel={() => setConfirmingDeleteId(null)}
                onConfirm={() => handleDelete(confirmingDeleteId)}
            />

            <ConfirmActionModal
                open={Boolean(confirmingEndSessionId)}
                title="End live session"
                description="This stops the active classroom session and broadcasts the presentation-ended event."
                confirmLabel="End session"
                loading={endSessionState.isLoading}
                onCancel={() => setConfirmingEndSessionId(null)}
                onConfirm={() => handleEndSession(confirmingEndSessionId)}
            />
        </div>
    );
}