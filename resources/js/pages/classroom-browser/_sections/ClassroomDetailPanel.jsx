import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useGetCurrentUserQuery } from '@/features/auth/authApi';
import {
    useGetSessionQuery,
    useGetSessionChatQuery,
    useLowerHandMutation,
    useRaiseHandMutation,
    useSendSessionChatMessageMutation,
    useSendWebRtcSignalMutation,
    useSubmitQuizMutation,
} from '@/features/session/sessionApi';
import useSessionChannel from '@/features/session/useSessionChannel';
import { useState } from 'react';

export default function ClassroomDetailPanel({
    classroom,
    materials = [],
    isLoading,
    activeSessionState,
    onBack,
}) {
    const { data: authUser, error: authError } = useGetCurrentUserQuery(undefined, { refetchOnMountOrArgChange: true });
    const [sendWebRtcSignal, sendWebRtcSignalState] = useSendWebRtcSignalMutation();
    const [submitQuiz, submitQuizState] = useSubmitQuizMutation();
    const [raiseHand, raiseHandState] = useRaiseHandMutation();
    const [lowerHand, lowerHandState] = useLowerHandMutation();
    const [sendSessionChatMessage, sendSessionChatMessageState] = useSendSessionChatMessageMutation();
    const [quizForm, setQuizForm] = useState({ quizId: '', quizTitle: '', answer: '' });
    const [chatBody, setChatBody] = useState('');
    const isAuthenticated = Boolean(authUser) && authError?.status !== 401;
    const sessionState = useGetSessionQuery(activeSessionState.data?.id, {
        skip: !activeSessionState.data || !(Boolean(authUser) && authError?.status !== 401),
        refetchOnMountOrArgChange: true,
    });
    const sessionChatState = useGetSessionChatQuery(activeSessionState.data?.id, {
        skip: !activeSessionState.data || !(Boolean(authUser) && authError?.status !== 401),
        refetchOnMountOrArgChange: true,
    });
    const sessionChannelState = useSessionChannel({
        channelName: activeSessionState.data?.channel,
        sessionId: activeSessionState.data?.id,
        enabled: Boolean(activeSessionState.data?.channel && isAuthenticated),
    });

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Skeleton className="h-8 w-48 rounded-xl" />
                <Skeleton className="mt-4 h-4 w-full rounded-xl" />
                <Skeleton className="mt-2 h-4 w-5/6 rounded-xl" />
                <Skeleton className="mt-8 h-32 w-full rounded-2xl" />
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Choose a classroom</p>
                <p className="mt-2 text-sm text-slate-500">Select one from the list to inspect its schedule, materials, and live-session availability.</p>
            </div>
        );
    }

    const hasActiveSession = activeSessionState.data;
    const noActiveSession = activeSessionState.error?.status === 404;
    const currentStudentId = String(authUser?.id || 'guest-web');
    const raisedHandEntry = (sessionState.data?.hand_queue ?? []).find((entry) => entry.student_id === currentStudentId);

    const handleJoinSignal = async () => {
        if (!activeSessionState.data) {
            return;
        }

        try {
            await sendWebRtcSignal({
                id: activeSessionState.data.id,
                event: 'WEBRTC_JOIN',
                data: {
                    from: authUser?.id || 'guest-web',
                    name: authUser?.name || 'Web learner',
                    sessionId: activeSessionState.data.id,
                },
            }).unwrap();
        } catch {
            // surface through mutation state below
        }
    };

    const handleRaiseHand = async () => {
        if (!activeSessionState.data) {
            return;
        }

        try {
            await raiseHand({
                id: activeSessionState.data.id,
                student_id: currentStudentId,
                student_name: authUser?.name || 'Web learner',
            }).unwrap();
        } catch {
            // rendered below
        }
    };

    const handleLowerHand = async () => {
        if (!activeSessionState.data) {
            return;
        }

        try {
            await lowerHand({
                id: activeSessionState.data.id,
                student_id: currentStudentId,
                student_name: authUser?.name || 'Web learner',
            }).unwrap();
        } catch {
            // rendered below
        }
    };

    const handleQuizSubmit = async (event) => {
        event.preventDefault();

        if (!activeSessionState.data || !quizForm.quizId.trim() || !quizForm.quizTitle.trim() || !quizForm.answer.trim()) {
            return;
        }

        try {
            await submitQuiz({
                id: activeSessionState.data.id,
                student_id: String(authUser?.id || 'guest-web'),
                student_name: authUser?.name || 'Web learner',
                quiz_id: quizForm.quizId.trim(),
                quiz_title: quizForm.quizTitle.trim(),
                answers: [{ question_id: `${quizForm.quizId.trim()}-q1`, answer: quizForm.answer.trim() }],
            }).unwrap();

            setQuizForm({ quizId: '', quizTitle: '', answer: '' });
        } catch {
            // mutation state rendered below
        }
    };

    const handleChatSubmit = async (event) => {
        event.preventDefault();

        if (!activeSessionState.data || !chatBody.trim()) {
            return;
        }

        try {
            await sendSessionChatMessage({
                id: activeSessionState.data.id,
                sender_id: String(authUser?.id || 'guest-web'),
                sender_name: authUser?.name || 'Web learner',
                is_teacher: false,
                body: chatBody.trim(),
            }).unwrap();

            setChatBody('');
        } catch {
            // mutation state rendered below
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Classroom detail</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{classroom.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">by {classroom.owner_name || 'Unknown teacher'}</p>
                </div>

                <Button type="button" variant="secondary" onClick={onBack}>
                    Back to list
                </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">Schedule</p>
                    <p className="mt-2 text-sm text-slate-600">{classroom.schedule || 'Schedule not provided yet.'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">Materials</p>
                    <p className="mt-2 text-sm text-slate-600">{classroom.material_count || 0} published item{classroom.material_count === 1 ? '' : 's'}</p>
                </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Description</p>
                <p className="mt-2 text-sm text-slate-600">{classroom.description || 'No classroom description is available yet.'}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">Live session status</p>
                {activeSessionState.isLoading ? (
                    <p className="mt-2 text-sm text-slate-500">Checking live session availability...</p>
                ) : null}
                {hasActiveSession ? (
                    <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                        <p className="font-medium">A live session is active for this classroom.</p>
                        <p className="mt-1">Channel {activeSessionState.data.channel}</p>
                        <p className="mt-1">WebSocket {activeSessionState.data.ws_url}</p>
                        <p className="mt-3 text-emerald-800">WebRTC signaling is ready on this session channel.</p>
                        <p className="mt-2 text-xs text-emerald-900">
                            {isAuthenticated
                                ? (sessionChannelState.connected ? 'Realtime presence connected.' : 'Realtime presence not connected yet.')
                                : 'Sign in to join the protected live presence channel.'}
                        </p>
                        {isAuthenticated ? (
                            <p className="mt-2 text-xs text-emerald-900">
                                {sessionChannelState.members.length} participant{sessionChannelState.members.length === 1 ? '' : 's'} currently present.
                            </p>
                        ) : null}
                        {sessionChannelState.lastEventName ? (
                            <p className="mt-2 text-xs text-emerald-900">
                                Last live event: {sessionChannelState.lastEventName} at {new Date(sessionChannelState.lastEventAt).toLocaleTimeString()}
                            </p>
                        ) : null}
                        {sessionChannelState.error ? (
                            <div className="mt-3 rounded-xl bg-rose-100 p-3 text-xs text-rose-700">
                                {sessionChannelState.error}
                            </div>
                        ) : null}
                        {sessionChannelState.members.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {sessionChannelState.members.map((member) => (
                                    <span key={member.id} className="rounded-full bg-white/70 px-3 py-1 text-xs text-emerald-900">
                                        {member.name}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {isAuthenticated ? (
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Button type="button" loading={sendWebRtcSignalState.isLoading} onClick={handleJoinSignal}>
                                    Send join signal
                                </Button>
                                <Button
                                    type="button"
                                    variant={raisedHandEntry ? 'secondary' : 'primary'}
                                    loading={raiseHandState.isLoading || lowerHandState.isLoading}
                                    onClick={raisedHandEntry ? handleLowerHand : handleRaiseHand}
                                >
                                    {raisedHandEntry ? 'Lower hand' : 'Raise hand'}
                                </Button>
                                <span className="self-center text-xs text-emerald-800">
                                    Sends `WEBRTC_JOIN` over the active session channel.
                                </span>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl bg-white/60 p-3 text-xs text-emerald-900">
                                Sign in to send WebRTC join signals from the web app.
                            </div>
                        )}

                        {sendWebRtcSignalState.isSuccess ? (
                            <div className="mt-3 rounded-xl bg-white/70 p-3 text-xs text-emerald-900">
                                Join signal sent. The signaling channel is ready for teacher offers and mute/call commands.
                            </div>
                        ) : null}

                        {raisedHandEntry ? (
                            <div className="mt-3 rounded-xl bg-white/70 p-3 text-xs text-emerald-900">
                                Your hand is raised. You are currently in the speaking queue.
                            </div>
                        ) : null}

                        {sendWebRtcSignalState.error ? (
                            <div className="mt-3 rounded-xl bg-rose-100 p-3 text-xs text-rose-700">
                                {sendWebRtcSignalState.error.data?.message || 'Unable to send the join signal.'}
                            </div>
                        ) : null}
                        {raiseHandState.error || lowerHandState.error ? (
                            <div className="mt-3 rounded-xl bg-rose-100 p-3 text-xs text-rose-700">
                                {raiseHandState.error?.data?.message || lowerHandState.error?.data?.message || 'Unable to update your hand queue status.'}
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {noActiveSession ? (
                    <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                        No live session is active yet.
                    </div>
                ) : null}
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-900">Published materials</h3>
                {materials.length ? (
                    <div className="mt-4 space-y-3">
                        {materials.map((material) => (
                            <div key={material.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{material.original_name}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {material.mime_type} · {Math.max(1, Math.round(material.size_bytes / 1024))} KB
                                    </p>
                                </div>
                                <a
                                    href={material.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                >
                                    Open file
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <p className="font-medium text-slate-900">No materials published</p>
                        <p className="mt-2 text-sm text-slate-500">Check back later or open another classroom with available files.</p>
                    </div>
                )}
            </div>

            {hasActiveSession ? (
                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <h4 className="text-base font-semibold text-slate-900">Quiz submission</h4>
                        {isAuthenticated ? (
                            <form className="mt-4 space-y-3" onSubmit={handleQuizSubmit}>
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={quizForm.quizId}
                                    onChange={(event) => setQuizForm((current) => ({ ...current, quizId: event.target.value }))}
                                    placeholder="Quiz ID"
                                />
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={quizForm.quizTitle}
                                    onChange={(event) => setQuizForm((current) => ({ ...current, quizTitle: event.target.value }))}
                                    placeholder="Quiz title"
                                />
                                <textarea
                                    rows="4"
                                    className="block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={quizForm.answer}
                                    onChange={(event) => setQuizForm((current) => ({ ...current, answer: event.target.value }))}
                                    placeholder="Submit your answer or summary response"
                                />
                                <Button type="submit" loading={submitQuizState.isLoading}>
                                    Submit quiz response
                                </Button>
                                {submitQuizState.isSuccess ? (
                                    <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                                        Quiz submission received.
                                    </div>
                                ) : null}
                                {submitQuizState.error ? (
                                    <div className="rounded-xl bg-rose-100 p-3 text-xs text-rose-700">
                                        {submitQuizState.error.data?.message || 'Unable to submit the quiz response.'}
                                    </div>
                                ) : null}
                            </form>
                        ) : (
                            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                Sign in to submit quiz responses from the web app.
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                        <h4 className="text-base font-semibold text-slate-900">Session chat</h4>
                        {isAuthenticated ? (
                            <>
                                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4">
                                    {(sessionChatState.data?.data ?? []).length > 0 ? (
                                        (sessionChatState.data?.data ?? []).map((message) => (
                                            <div key={message.id} className="rounded-xl bg-white p-3 shadow-sm">
                                                <p className="font-medium text-slate-900">{message.sender_name}</p>
                                                <p className="mt-2 text-sm text-slate-600">{message.body}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                                            No chat messages yet. Send the first message to join the discussion.
                                        </div>
                                    )}
                                </div>
                                <form className="mt-4 space-y-3" onSubmit={handleChatSubmit}>
                                    <textarea
                                        rows="3"
                                        className="block w-full rounded-md border-slate-300 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={chatBody}
                                        onChange={(event) => setChatBody(event.target.value)}
                                        placeholder="Type a message for the live session"
                                    />
                                    <Button type="submit" loading={sendSessionChatMessageState.isLoading}>
                                        Send message
                                    </Button>
                                    {sendSessionChatMessageState.error ? (
                                        <div className="rounded-xl bg-rose-100 p-3 text-xs text-rose-700">
                                            {sendSessionChatMessageState.error.data?.message || 'Unable to send the message.'}
                                        </div>
                                    ) : null}
                                </form>
                            </>
                        ) : (
                            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                Sign in to read and send live session chat messages.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}