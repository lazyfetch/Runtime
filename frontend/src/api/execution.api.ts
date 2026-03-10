import axiosInstance from './axiosInstance';
import type { ApiResponse, CodeExecutionRequest, ExecutionResult } from '../types/execution.types';

export const executeCode = (data: CodeExecutionRequest) =>
  axiosInstance.post<ApiResponse<string>>('/api/execute', data);

export const pollResult = (jobId: string) =>
  axiosInstance.get<ApiResponse<string>>(`/api/result/${jobId}`);

export const executeCodeDirect = (data: CodeExecutionRequest) =>
  axiosInstance.post<ApiResponse<ExecutionResult>>('/api/execute', data);
