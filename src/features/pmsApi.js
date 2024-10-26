import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pmsApi = createApi({
    reducerPath: "pmsApi",
    baseQuery: fetchBaseQuery(
        {
            baseUrl: "http://127.0.0.1:8000/api",
            prepareHeaders: (headers, { getState }) => {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                return headers;
            }
        }
    ),
    tagTypes: ['Department','Client','Project', 'Task', 'Status', 'User', 'TaskBoard', 'Role'],
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
            query: (param) => {
                let url = '';
                if(param.myProjects)
                url = `/projects?search=${param.search}&projects=${param.myProjects}&page=${param.page}&client=${param.client}&status=${param.status}`;
                else 
                url = `/projects?search=${param.search}&page=${param.page}&client=${param.client}&status=${param.status}`;
                
                return { url: url, method: "GET" };
            },
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
            query: (data) => {
                let url = `/projects/${data.id}/tasks`;

                if (data.search != '') {
                    url = `/projects/${data.id}/tasks?search=${data.search}`;
                }
                
                return {
                    url: url,
                    method:"GET",
                };
            },
            providesTags: ['Task']
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
            },
            invalidatesTags: ['User','TaskBoard']
        }),
        'editTask': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}?_method=PUT`,
                method: "POST",
                body: data.task
            }),
            invalidatesTags: ['Task','User','TaskBoard']
        }),
        'deleteTaskFile': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}/files/${data.fileId}/delete`,
                method: "DELETE",
            }),
            invalidatesTags: ['TaskBoard']
        }),
        'taskComments': builder.query({
            query: (data) => {
                let url = `/projects/${data.projectId}/tasks/${data.taskId}/comments`;
                return {
                    url: url,
                    method: "GET",
                };
            },
        }),
        'createTaskComment': builder.mutation({
            query: (data) => ({
                url: `/projects/${data.projectId}/tasks/${data.taskId}/comments`,
                method: "POST",
                body: data.comment
            }),
            invalidatesTags: ['TaskBoard']
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
            }),
            invalidatesTags: ['TaskBoard']
        }),
        'statuses': builder.query({
            query: (data) => ({
                url: `/statuses?search=${data.search}&?page=${data.page}`,
                method: "GET",
            }),
            providesTags: ['Status']
        }),
        'createStatus': builder.mutation({
            query: (data) => ({
                url: `/statuses`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Status']
        }),
        'editStatus': builder.mutation({
            query: (data) => {
                const url = `/statuses/${data.id}?_method=PUT`;
                return {
                    url: url,
                    method: "POST",
                    body: data.order
                };
            },
            invalidatesTags: ['Status']
        }),
        'deleteStatus': builder.mutation({
            query: (id) => ({
                url: `/statuses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Status']
        }),
        'statusOptions': builder.query({
            query: () => ({
                url: `/status/options`,
                method: "GET",
            }),
        }),
        'projectsOptions': builder.query({
            query: () => ({
                url: `/project/options`,
                method: "GET",
            }),
        }),
        'taskBoard': builder.query({
            query: (param) => {
                let url = `/task-board?project=${param.project}`;

                if (param.user != undefined) {
                    url = `/task-board?project=${param.project}&user=${param.user}`;
                }
                return {
                    url: url,
                    method: "GET",
                };
            },
            providesTags: ['TaskBoard']
        }),
        'users': builder.query({
            query: (data) => ({
                url: `/users?search=${data.search}&page=${data.page}${data.status ? '&status='+data.status : ''}`,
                method: "GET",
            }),
            providesTags: ['User']
        }),
        'user': builder.query({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            providesTags: ['User']
        }),
        'createUser': builder.mutation({
            query: (data) => ({
                url: `/users`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['User']
        }),
        'editUser': builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}?_method=PUT`,
                method: "POST",
                body: data.user
            }),
            invalidatesTags: ['User']
        }),
        'deleteUser': builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['User']
        }),
        'roles': builder.query({
            query: (data) => ({
                url: `/roles?search=${data.search}&page=${data.page}`,
                method: "GET",
            }),
            providesTags: ['Role']
        }),
        'createRole': builder.mutation({
            query: (data) => ({
                url: `/roles`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Role']
        }),
        'role': builder.query({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "GET",
            }),
            providesTags: ['Role']
        }),
        'editRole': builder.mutation({
            query: (data) => ({
                url: `/roles/${data.id}?_method=PUT`,
                method: "POST",
                body: data.role
            }),
            invalidatesTags: ['Role']
        }),
        'deleteRole': builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Role']
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
    useEditTaskMutation,
    useDeleteTaskFileMutation,
    useViewTaskQuery,
    useTaskCommentsQuery,
    useCreateTaskCommentMutation,
    useDeleteTaskCommentMutation,
    useEditTaskCommentMutation,
    useStatusesQuery,
    useCreateStatusMutation,
    useDeleteStatusMutation,
    useEditStatusMutation,
    useStatusOptionsQuery,
    useProjectsOptionsQuery,
    useTaskBoardQuery,
    useUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useUserQuery,
    useEditUserMutation,
    useRolesQuery,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useEditRoleMutation,
    useRoleQuery,
} = pmsApi;

