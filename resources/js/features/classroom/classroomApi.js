import { api as baseApi } from '@/store';

export const classroomApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicClassrooms: builder.query({
            query: ({ page = 1, search = '' } = {}) => {
                const params = new URLSearchParams();

                params.set('page', page);

                if (search) {
                    params.set('search', search);
                }

                return `/classrooms?${params.toString()}`;
            },
            providesTags: (result) => {
                const classrooms = result?.data ?? [];

                return [
                    'Classroom',
                    ...classrooms.map((classroom) => ({ type: 'Classroom', id: classroom.id })),
                ];
            },
        }),
        getPublicClassroom: builder.query({
            query: (id) => `/classrooms/${id}`,
            providesTags: (result, error, id) => [{ type: 'Classroom', id }],
        }),
        getClassroomMaterials: builder.query({
            query: (id) => `/classrooms/${id}/materials`,
            providesTags: (result, error, id) => {
                const materials = result?.data ?? [];

                return [
                    { type: 'Classroom', id },
                    'Material',
                    ...materials.map((material) => ({ type: 'Material', id: material.id })),
                ];
            },
        }),
        getActiveSession: builder.query({
            query: (id) => `/classrooms/${id}/active-session`,
            providesTags: (result, error, id) => [{ type: 'Classroom', id }],
        }),
        getOwnedClassrooms: builder.query({
            query: (page = 1) => `/classrooms/mine?page=${page}`,
            providesTags: (result) => {
                const classrooms = result?.data ?? [];

                return [
                    'Classroom',
                    ...classrooms.map((classroom) => ({ type: 'Classroom', id: classroom.id })),
                ];
            },
        }),
        createClassroom: builder.mutation({
            query: (body) => ({
                url: '/classrooms',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Classroom'],
        }),
        updateClassroom: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/classrooms/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, arg) => ['Classroom', { type: 'Classroom', id: arg.id }],
        }),
        deleteClassroom: builder.mutation({
            query: (id) => ({
                url: `/classrooms/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Classroom', 'Material'],
        }),
        uploadMaterial: builder.mutation({
            query: ({ classroomId, formData }) => ({
                url: `/classrooms/${classroomId}/materials`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error, arg) => ['Classroom', 'Material', { type: 'Classroom', id: arg.classroomId }],
        }),
        deleteMaterial: builder.mutation({
            query: ({ classroomId, materialId }) => ({
                url: `/classrooms/${classroomId}/materials/${materialId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => ['Classroom', 'Material', { type: 'Classroom', id: arg.classroomId }],
        }),
    }),
});

export const {
    useGetPublicClassroomsQuery,
    useGetPublicClassroomQuery,
    useGetClassroomMaterialsQuery,
    useGetActiveSessionQuery,
    useGetOwnedClassroomsQuery,
    useCreateClassroomMutation,
    useUpdateClassroomMutation,
    useDeleteClassroomMutation,
    useUploadMaterialMutation,
    useDeleteMaterialMutation,
} = classroomApi;