import { apiSlice } from '../../services/apiSlice';
import { Issue, IssueStatus } from '@/types';

export const issuesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIssues: builder.query<Issue[], { status?: IssueStatus; search?: string; page?: number }>({
            query: ({ status, search, page = 1 }) => {
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                if (search) params.append('search', search);
                params.append('page', page.toString());
                return `/issues?${params.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Issue' as const, id })),
                        { type: 'Issue', id: 'LIST' },
                    ]
                    : [{ type: 'Issue', id: 'LIST' }],
        }),
        getIssueById: builder.query<Issue, string>({
            query: (id) => `/issues/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
        }),
        updateIssueStatus: builder.mutation<Issue, { id: string; status: IssueStatus; remarks?: string }>({
            query: ({ id, ...patch }) => ({
                url: `/issues/${id}/status`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Issue', id },
                { type: 'Issue', id: 'LIST' },
            ],
        }),
        flagIssue: builder.mutation<void, string>({
            query: (id) => ({
                url: `/issues/${id}/flag`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Issue', id }],
        })
    }),
});

export const {
    useGetIssuesQuery,
    useGetIssueByIdQuery,
    useUpdateIssueStatusMutation,
    useFlagIssueMutation,
} = issuesApi;
