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
    tagTypes: ['Department','Client','Project'],
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
                url: `/clients/departments`,
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
    useDeleteProjectMutation
} = pmsApi;

