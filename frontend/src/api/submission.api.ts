import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/execution.types';
import type { Submission } from '../types/submission.types';

export const getSubmissions = () =>
  axiosInstance.get<ApiResponse<Submission[]>>('/api/submissions');

export const getSubmissionsByProject = (projectId: number) =>
  axiosInstance.get<ApiResponse<Submission[]>>(`/api/submissions?projectId=${projectId}`);
