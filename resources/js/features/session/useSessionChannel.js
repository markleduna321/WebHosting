import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '@/store';

const eventTagMap = {
    CALLED_ON: ['Session'],
    CHAT_MESSAGE: ['Session', 'ChatMessage'],
    HAND_UPDATE: ['Session'],
    PARTICIPANT_UPDATE: ['Session', 'Participant'],
    PRESENTATION_ENDED: ['Session', 'Classroom'],
    WEBRTC_JOIN: ['Session', 'Participant'],
};

export default function useSessionChannel({ channelName, sessionId, enabled = true }) {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        connected: false,
        error: '',
        lastEventName: '',
        lastEventAt: '',
        members: [],
    });

    useEffect(() => {
        if (!enabled || !channelName || !sessionId) {
            setState({
                connected: false,
                error: '',
                lastEventName: '',
                lastEventAt: '',
                members: [],
            });
            return undefined;
        }

        if (typeof window === 'undefined' || !window.Echo) {
            setState({
                connected: false,
                error: 'Echo is not configured for this build.',
                lastEventName: '',
                lastEventAt: '',
                members: [],
            });
            return undefined;
        }

        const normalizeMembers = (members) => Object.values(members ?? {}).map((member) => ({
            id: String(member.id),
            name: member.name,
            role: member.role,
            sessionId: member.session_id,
        }));

        const updateMembers = (members) => {
            setState((current) => ({
                ...current,
                connected: true,
                error: '',
                members,
            }));
        };

        const invalidate = (eventName) => {
            const tagNames = eventTagMap[eventName] ?? [];
            const tags = tagNames.map((tagName) => ({ type: tagName, id: sessionId }));

            if (tagNames.includes('Classroom')) {
                tags.push('Classroom');
            }

            if (tags.length) {
                dispatch(api.util.invalidateTags(tags));
            }
        };

        const channel = window.Echo.join(channelName);

        setState({
            connected: true,
            error: '',
            lastEventName: '',
            lastEventAt: '',
            members: [],
        });

        channel.here((members) => {
            updateMembers(normalizeMembers(members));
            dispatch(api.util.invalidateTags([{ type: 'Session', id: sessionId }, { type: 'Participant', id: sessionId }]));
        });

        channel.joining((member) => {
            updateMembers((currentMembers => {
                const nextMembers = [...currentMembers.filter((currentMember) => currentMember.id !== String(member.id)), {
                    id: String(member.id),
                    name: member.name,
                    role: member.role,
                    sessionId: member.session_id,
                }];

                return nextMembers;
            })(state.members));

            invalidate('PARTICIPANT_UPDATE');
        });

        channel.leaving((member) => {
            updateMembers(state.members.filter((currentMember) => currentMember.id !== String(member.id)));
            invalidate('PARTICIPANT_UPDATE');
        });

        channel.error(() => {
            setState((current) => ({
                ...current,
                connected: false,
                error: 'Unable to authorize or maintain the live session presence channel.',
            }));
        });

        channel.listenToAll((eventName) => {
            const normalizedEvent = eventName.startsWith('.') ? eventName.slice(1) : eventName;

            invalidate(normalizedEvent);
            setState((current) => ({
                ...current,
                connected: true,
                error: '',
                lastEventName: normalizedEvent,
                lastEventAt: new Date().toISOString(),
            }));
        });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [channelName, dispatch, enabled, sessionId]);

    return state;
}