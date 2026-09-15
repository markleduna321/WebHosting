import { api } from "@/store";

export const checkoutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: (body) => ({ url: "/checkout", method: "POST", body }),
            transformResponse: (response) => response?.data ?? null,
            invalidatesTags: ["Payment"],
        }),
        getPayment: builder.query({
            query: (uuid) => `/checkout/${uuid}`,
            transformResponse: (response) => response?.data ?? null,
            providesTags: ["Payment"],
        }),
    }),
});

export const { useCreatePaymentMutation, useGetPaymentQuery } = checkoutApi;
