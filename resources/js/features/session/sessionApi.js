import { api as baseApi } from '@/store';

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSession: builder.mutation({
            query: (body) => ({
                url: '/sessions',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => ['Session', 'Classroom', { type: 'Classroom', id: arg.classroom_id }],
        }),
        getSession: builder.query({
            query: (id) => `/sessions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Session', id }],
        }),
        raiseHand: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/hand/raise`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg.id }],
        }),
        lowerHand: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/hand/lower`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg.id }],
        }),
        callOnParticipant: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/hand/call`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg.id }],
        }),
        endSession: builder.mutation({
            query: (id) => ({
                url: `/sessions/${id}/end`,
                method: 'POST',
            }),
            invalidatesTags: ['Session', 'Classroom'],
        }),
        getSessionParticipants: builder.query({
            query: (id) => `/sessions/${id}/participants`,
            providesTags: (result, error, id) => {
                const participants = result?.data ?? [];

                return [
                    { type: 'Session', id },
                    'Participant',
                    ...participants.map((participant) => ({ type: 'Participant', id: participant.id })),
                ];
            },
        }),
        submitQuiz: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/quiz/submit`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Session', id: arg.id },
                { type: 'QuizSubmission', id: arg.id },
            ],
        }),
        getQuizResults: builder.query({
            query: (id) => `/sessions/${id}/quiz/results`,
            providesTags: (result, error, id) => {
                const submissions = result?.data ?? [];

                return [
                    { type: 'Session', id },
                    { type: 'QuizSubmission', id },
                    ...submissions.map((submission) => ({ type: 'QuizSubmission', id: submission.id })),
                ];
            },
        }),
        getSessionChat: builder.query({
            query: (id) => `/sessions/${id}/chat`,
            providesTags: (result, error, id) => {
                const messages = result?.data ?? [];

                return [
                    { type: 'Session', id },
                    { type: 'ChatMessage', id },
                    ...messages.map((message) => ({ type: 'ChatMessage', id: message.id })),
                ];
            },
        }),
        sendSessionChatMessage: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/chat`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Session', id: arg.id },
                { type: 'ChatMessage', id: arg.id },
            ],
        }),
        broadcastSessionEvent: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/sessions/${id}/broadcast`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg.id }],
        }),
        sendWebRtcSignal: builder.mutation({
            query: ({ id, event, data }) => ({
                url: `/sessions/${id}/broadcast`,
                method: 'POST',
                body: { event, data },
            }),
        }),
        sendParticipantCommand: builder.mutation({
            query: ({ id, event, data }) => ({
                url: `/sessions/${id}/broadcast`,
                method: 'POST',
                body: { event, data },
            }),
        }),
    }),
});

export const {
    useCreateSessionMutation,
    useGetSessionQuery,
    useRaiseHandMutation,
    useLowerHandMutation,
    useCallOnParticipantMutation,
    useEndSessionMutation,
    useGetSessionParticipantsQuery,
    useSubmitQuizMutation,
    useGetQuizResultsQuery,
    useGetSessionChatQuery,
    useSendSessionChatMessageMutation,
    useBroadcastSessionEventMutation,
    useSendWebRtcSignalMutation,
    useSendParticipantCommandMutation,
} = sessionApi;