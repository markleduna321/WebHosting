import { api } from "@/store";

export const databasesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDatabases: builder.query({
            query: () => "/databases",
            transformResponse: (response) => ({
                items: response?.data ?? [],
                meta: response?.meta ?? {},
            }),
            providesTags: ["StudentDatabase"],
        }),
        createDatabase: builder.mutation({
            query: (body) => ({ url: "/databases", method: "POST", body }),
            invalidatesTags: ["StudentDatabase"],
        }),
        getDatabaseCredentials: builder.query({
            query: (uuid) => `/databases/${uuid}/credentials`,
            transformResponse: (response) => response?.data ?? null,
            // The password must not linger in the cache once a card is unmounted.
            keepUnusedDataFor: 0,
        }),
        deleteDatabase: builder.mutation({
            query: (uuid) => ({ url: `/databases/${uuid}`, method: "DELETE" }),
            invalidatesTags: ["StudentDatabase"],
        }),
        exportDatabase: builder.query({
            query: (uuid) => ({
                url: `/databases/${uuid}/export`,
                responseHandler: (response) => response.blob(),
                cache: "no-store",
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetDatabasesQuery,
    useCreateDatabaseMutation,
    useLazyGetDatabaseCredentialsQuery,
    useDeleteDatabaseMutation,
    useLazyExportDatabaseQuery,
} = databasesApi;
