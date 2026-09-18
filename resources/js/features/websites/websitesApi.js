import { api } from "@/store";

export const websitesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getWebsites: builder.query({
            query: () => "/websites",
            transformResponse: (response) => response?.data ?? [],
            providesTags: ["Website"],
        }),
        createWebsite: builder.mutation({
            query: (body) => ({ url: "/websites", method: "POST", body }),
            invalidatesTags: ["Website"],
        }),
        getWebsiteFiles: builder.query({
            query: ({ uuid, path = "" }) => ({
                url: `/websites/${uuid}/files`,
                params: path ? { path } : {},
            }),
            transformResponse: (response) => response?.data ?? [],
            providesTags: ["WebsiteFile"],
        }),
        createWebsiteFile: builder.mutation({
            query: ({ uuid, name, path = "", content = "", upload }) => {
                if (upload) {
                    const body = new FormData();
                    body.append("name", name);
                    body.append("path", path);
                    body.append("upload", upload);

                    return { url: `/websites/${uuid}/files`, method: "POST", body };
                }

                return {
                    url: `/websites/${uuid}/files`,
                    method: "POST",
                    body: { name, path, content },
                };
            },
            invalidatesTags: ["WebsiteFile"],
        }),
        redeployWebsite: builder.mutation({
            query: (uuid) => ({
                url: `/websites/${uuid}/redeploy`,
                method: "POST",
            }),
            invalidatesTags: ["Website", "WebsiteFile"],
        }),
        deleteWebsite: builder.mutation({
            query: (uuid) => ({ url: `/websites/${uuid}`, method: "DELETE" }),
            invalidatesTags: ["Website", "WebsiteFile"],
        }),
    }),
});

export const {
    useGetWebsitesQuery,
    useCreateWebsiteMutation,
    useGetWebsiteFilesQuery,
    useCreateWebsiteFileMutation,
    useRedeployWebsiteMutation,
    useDeleteWebsiteMutation,
} = websitesApi;
