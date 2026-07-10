import { api as baseApi } from '@/store';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => '/user',
            providesTags: ['Auth'],
        }),
        registerUser: builder.mutation({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
} = authApi;