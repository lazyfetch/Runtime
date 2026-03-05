import axiosInstance from './axiosInstance';
import type { Submission } from '../types/submission.types';

export const getSubmissions = () =>
  axiosInstance.get<Submission[]>('/api/submissions');

export const getSubmissionsByProject = (projectId: string) =>
  axiosInstance.get<Submission[]>(`/api/submissions?projectId=${projectId}`);
