import { api as baseApi } from '@/store';

export const twoFactorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        enableTwoFactor: builder.mutation({
            query: () => ({
                url: '/two-factor/enable',
                method: 'POST',
            }),
        }),
        verifyTwoFactor: builder.mutation({
            query: (data) => ({
                url: '/two-factor/verify',
                method: 'POST',
                body: data,
            }),
        }),
        disableTwoFactor: builder.mutation({
            query: () => ({
                url: '/two-factor/disable',
                method: 'POST',
            }),
        }),
        resendTwoFactor: builder.mutation({
            query: () => ({
                url: '/two-factor/resend',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useEnableTwoFactorMutation,
    useVerifyTwoFactorMutation,
    useDisableTwoFactorMutation,
    useResendTwoFactorMutation,
} = twoFactorApi;
