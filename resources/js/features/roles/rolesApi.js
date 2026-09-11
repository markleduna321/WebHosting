import { api } from "@/store";

export const rolesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: ({ page = 1, search = "" } = {}) => ({
                url: "/roles",
                params: { page, ...(search ? { search } : {}) },
            }),
            providesTags: ["Role"],
        }),
        createRole: builder.mutation({
            query: (body) => ({ url: "/roles", method: "POST", body }),
            invalidatesTags: ["Role", "Permission"],
        }),
        updateRole: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Role", "Permission"],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
            invalidatesTags: ["Role", "Permission"],
        }),
    }),
});

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = rolesApi;
