import { api } from '@/store';

export const domainsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDomains: builder.query({
            query: () => '/domains',
            providesTags: ['Domain'],
            transformResponse: (response) => response.data,
        }),
        addDomain: builder.mutation({
            query: (domainData) => ({
                url: '/domains',
                method: 'POST',
                body: domainData,
            }),
            invalidatesTags: ['Domain'],
        }),
        deleteDomain: builder.mutation({
            query: (id) => ({
                url: `/domains/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Domain'],
        }),
        verifyDomain: builder.mutation({
            query: (id) => ({
                url: `/domains/${id}/verify`,
                method: 'POST',
            }),
            invalidatesTags: ['Domain'],
        }),
    }),
});

export const {
    useGetDomainsQuery,
    useAddDomainMutation,
    useDeleteDomainMutation,
    useVerifyDomainMutation,
} = domainsApi;
