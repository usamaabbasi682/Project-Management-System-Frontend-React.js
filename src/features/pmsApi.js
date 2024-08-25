import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pmsApi = createApi({
    reducerPath: "pmsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api",prepareHeaders: (headers, { getState }) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
    }),
    tagTypes: ['Department','Client','Project', 'Task'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: {
                    'email': credentials.email,
                    'password': credentials.password,
                    'g-recaptcha-response': credentials.recaptcha
                }
            })
        }),
        'departments': builder.query({
            query: (param) => ({
                url: `/departments?search=${param.search}&page=${param.page}`,
                method: "GET",
            }),
            providesTags: ['Department']
        }),
        'createDepartment': builder.mutation({
            query: (data) => ({
                url: "/departments",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Department']
        }),
        'editDepartment': builder.mutation({
            query: (data) => ({
                url: `/departments/${data.id}`,
                method: "PUT",
                body: data
            }),
             invalidatesTags: ['Department']
        }),
        'findDepartment': builder.query({
            query: (id) => ({
                url: `/departments/${id}`,
                method: "GET",
            }),
        }),
        'deleteDepartment': builder.mutation({
            query: (id) => ({
                url: `/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Department']
        }),
        'clients': builder.query({
            query: (param) => {
                let url = `/clients?search=${param.search}&page=${param.page}`;
                if(param.department){
                    url += `&department=${param.department}`;
                }
                return {
                    url: url,
                    method: "GET",
                }
            },
            providesTags: ['Client']
        }),
        'deleteClient': builder.mutation({
            query: (id) => ({
                url: `/clients/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Client']
        }),
        'clientDepartments': builder.query({
            query: () => ({
                url: `/department/options`,
                method: "GET",
            }),
        }),
        'createClient': builder.mutation({
            query: (data) => ({
                url: "/clients",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Client']
        }),
        'editClient': builder.mutation({
            query: (object) => {
                const url = `/clients/${object.id}?_method=PUT`;
                return {
                    url: url,
                    method: "POST",
                    body: object.data
                };
            },
            invalidatesTags: ['Client']
        }),
        'findClient': builder.query({
            query: (id) => ({
                url: `/clients/${id}`,
                method: "GET",
            }),
        }),
        'projects': builder.query({
            query: (param) => ({
                url: `/projects?search=${param.search}&page=${param.page}`,
                method: "GET",
            }),
            providesTags: ['Project']
        }),
        'deleteProject': builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Project']
        }),
        'clientOptions': builder.query({
            query: () => ({
                url: `/client/options`,
                method: "GET",
            }),
        }),
        'userOptions': builder.query({
            query: () => ({
                url: `/users/options`,
                method: "GET",
            }),
        }),
        'createProject': builder.mutation({
            query: (data) => ({
                url: "/projects",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Project']
        }),
        'editProject': builder.mutation({
            query: (object) => {
                const url = `/projects/${object.id}?_method=PUT`;            
                return {
                    url: url,
                    method: "POST",
                    body: object.data
                };
            },
            invalidatesTags: ['Project']
        }),
        'findProject': builder.query({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "GET",
            }),
        }),
        'projectFileUpload': builder.mutation({
            query: (file) => ({
                url: `/projects/${file.id}/file`,
                method: "POST",
                body: file.files
            }),
            invalidatesTags: ['Project']
        }),
        'projectFileDelete': builder.mutation({
            query: (data) => {
                const url = `/projects/${data.project}/files/${data.file}`;
                return {
                    url: url,
                    method: "DELETE",
                };
            },
            invalidatesTags: ['Project']
        }),
        'tagOptions': builder.query({
            query: () => ({
                url: `/tags/options`,
                method: "GET",
            }),
        }),
        'tasks': builder.query({
            query:(id) => `/projects/${id}/tasks`,
        }),
        'viewTask': builder.query({
            query:(data) => `/projects/${data.projectId}/tasks/${data.taskId}`,
        }),
        'createTask': builder.mutation({
            query: (data) => {
                const url = `/projects/${data.id}/tasks`;
                return {
                    url: url,
                    method: "POST",
                    body: data.task
                };
            }
        }),
        'taskComments': builder.query({
            query:(data) => `/projects/${data.projectId}/tasks/${data.taskId}/comments`,
        }),
        'createTaskComment': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}/comments`,
                method: "POST",
                body: data.comment
            })
        }),
        'editTaskComment': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}/comments/${data.commentId}/update`,
                method: "POST",
                body: data.comment
            })
        }),
        'deleteTaskComment': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}/comments/${data.commentId}/delete`,
                method: "DELETE",
            })
        })

    })
});

export const {
    useLoginMutation,
    useDepartmentsQuery,
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
    useFindDepartmentQuery,
    useDeleteDepartmentMutation,
    useClientsQuery,
    useDeleteClientMutation,
    useClientDepartmentsQuery,
    useCreateClientMutation,
    useEditClientMutation,
    useFindClientQuery,
    useProjectsQuery,
    useDeleteProjectMutation,
    useClientOptionsQuery,
    useUserOptionsQuery,
    useCreateProjectMutation,
    useEditProjectMutation,
    useFindProjectQuery,
    useProjectFileUploadMutation,
    useProjectFileDeleteMutation,
    useTagOptionsQuery,
    useTasksQuery,
    useCreateTaskMutation,
    useViewTaskQuery,
    useTaskCommentsQuery,
    useCreateTaskCommentMutation,
    useDeleteTaskCommentMutation,
    useEditTaskCommentMutation
} = pmsApi;

