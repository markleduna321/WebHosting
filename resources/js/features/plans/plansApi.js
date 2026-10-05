import { api } from "@/store";

export const plansApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAdminPlans: builder.query({
			query: ({ page = 1, search = "" } = {}) => ({
				url: "/admin/plans",
				params: { page, ...(search ? { search } : {}) },
			}),
			providesTags: ["Plan"],
		}),
		createPlan: builder.mutation({
			query: (body) => ({ url: "/admin/plans", method: "POST", body }),
			invalidatesTags: ["Plan"],
		}),
		updatePlan: builder.mutation({
			query: ({ id, ...body }) => ({
				url: `/admin/plans/${id}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["Plan"],
		}),
		deletePlan: builder.mutation({
			query: (id) => ({ url: `/admin/plans/${id}`, method: "DELETE" }),
			invalidatesTags: ["Plan"],
		}),
	}),
});

export const {
	useGetAdminPlansQuery,
	useCreatePlanMutation,
	useUpdatePlanMutation,
	useDeletePlanMutation,
} = plansApi;
