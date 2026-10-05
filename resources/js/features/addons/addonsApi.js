import { api } from "@/store";

export const addonsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAdminAddons: builder.query({
			query: ({ page = 1, search = "" } = {}) => ({
				url: "/admin/addons",
				params: { page, ...(search ? { search } : {}) },
			}),
			providesTags: ["Addon"],
		}),
		createAddon: builder.mutation({
			query: (body) => ({ url: "/admin/addons", method: "POST", body }),
			invalidatesTags: ["Addon"],
		}),
		updateAddon: builder.mutation({
			query: ({ id, ...body }) => ({
				url: `/admin/addons/${id}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["Addon"],
		}),
		deleteAddon: builder.mutation({
			query: (id) => ({ url: `/admin/addons/${id}`, method: "DELETE" }),
			invalidatesTags: ["Addon"],
		}),
	}),
});

export const {
	useGetAdminAddonsQuery,
	useCreateAddonMutation,
	useUpdateAddonMutation,
	useDeleteAddonMutation,
} = addonsApi;
