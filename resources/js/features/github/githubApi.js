import { api as baseApi } from '@/store';

export const githubApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGithubRepositories: builder.query({
            query: () => '/github/repositories',
            transformResponse: (response) => response?.data ?? [],
            providesTags: ['GithubRepository'],
        }),
    }),
});

export const { useGetGithubRepositoriesQuery } = githubApi;
