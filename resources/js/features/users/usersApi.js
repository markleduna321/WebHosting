import { api } from "@/store";

export const usersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAdminUsers: builder.query({
			query: ({ page = 1, search = "" } = {}) => ({
				url: "/admin/users",
				params: { page, ...(search ? { search } : {}) },
			}),
			providesTags: ["AdminUser"],
		}),
	}),
});

export const { useGetAdminUsersQuery } = usersApi;
