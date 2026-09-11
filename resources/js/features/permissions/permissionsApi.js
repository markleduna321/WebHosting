import { api } from "@/store";

export const permissionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: ({ page = 1, search = "", perPage = 10 } = {}) => ({
                url: "/permissions",
                params: {
                    page,
                    per_page: perPage,
                    ...(search ? { search } : {}),
                },
            }),
            providesTags: ["Permission"],
        }),
        createPermission: builder.mutation({
            query: (body) => ({ url: "/permissions", method: "POST", body }),
            invalidatesTags: ["Permission", "Role"],
        }),
        updatePermission: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/permissions/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Permission", "Role"],
        }),
        deletePermission: builder.mutation({
            query: (id) => ({ url: `/permissions/${id}`, method: "DELETE" }),
            invalidatesTags: ["Permission", "Role"],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
} = permissionsApi;
