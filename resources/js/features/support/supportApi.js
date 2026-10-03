import { api } from "@/store";

export const supportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createSupportConversation: builder.mutation({
            query: () => ({ url: "/support/conversations", method: "POST", body: {} }),
            transformResponse: (response) => response?.data ?? null,
        }),
        getSupportConversation: builder.query({
            query: (id) => `/support/conversations/${id}`,
            transformResponse: (response) => response?.data ?? null,
            providesTags: (_result, _error, id) => [{ type: "SupportConversation", id }],
        }),
        sendSupportMessage: builder.mutation({
            query: ({ id, content }) => ({
                url: `/support/conversations/${id}/messages`,
                method: "POST",
                body: { content },
            }),
            transformResponse: (response) => response?.data ?? null,
            invalidatesTags: (_result, _error, { id }) => [{ type: "SupportConversation", id }],
        }),
        requestSupportHandoff: builder.mutation({
            query: ({ id, email }) => ({
                url: `/support/conversations/${id}/handoff`,
                method: "POST",
                body: email ? { email } : {},
            }),
            transformResponse: (response) => response?.data ?? null,
            invalidatesTags: (_result, _error, { id }) => [{ type: "SupportConversation", id }],
        }),
    }),
});

export const {
    useCreateSupportConversationMutation,
    useLazyGetSupportConversationQuery,
    useSendSupportMessageMutation,
    useRequestSupportHandoffMutation,
} = supportApi;
