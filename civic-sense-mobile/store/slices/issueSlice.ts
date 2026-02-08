// ============================================
// Civic Sense - Issue Slice
// ============================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueStatus } from '../../types';

interface IssueState {
    issues: Issue[];
    userIssues: Issue[];
    selectedIssue: Issue | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    issues: [],
    userIssues: [],
    selectedIssue: null,
    isLoading: false,
    error: null,
};

const issueSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        setIssues: (state, action: PayloadAction<Issue[]>) => {
            state.issues = action.payload;
            state.isLoading = false;
        },
        setUserIssues: (state, action: PayloadAction<Issue[]>) => {
            state.userIssues = action.payload;
        },
        addIssue: (state, action: PayloadAction<Issue>) => {
            state.issues.unshift(action.payload);
        },
        updateIssueStatus: (
            state,
            action: PayloadAction<{ id: string; status: IssueStatus }>
        ) => {
            const issue = state.issues.find((i) => i.id === action.payload.id);
            if (issue) {
                issue.status = action.payload.status;
            }
            const userIssue = state.userIssues.find((i) => i.id === action.payload.id);
            if (userIssue) {
                userIssue.status = action.payload.status;
            }
        },
        setSelectedIssue: (state, action: PayloadAction<Issue | null>) => {
            state.selectedIssue = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        // Real-time update from Socket.IO
        handleRealTimeUpdate: (state, action: PayloadAction<Issue>) => {
            const index = state.issues.findIndex((i) => i.id === action.payload.id);
            if (index >= 0) {
                state.issues[index] = action.payload;
            } else {
                state.issues.unshift(action.payload);
            }
        },
    },
});

export const {
    setIssues,
    setUserIssues,
    addIssue,
    updateIssueStatus,
    setSelectedIssue,
    setLoading,
    setError,
    handleRealTimeUpdate,
} = issueSlice.actions;

export default issueSlice.reducer;
