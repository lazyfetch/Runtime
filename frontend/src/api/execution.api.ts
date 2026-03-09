import axiosInstance from './axiosInstance';
import type { ApiResponse, CodeExecutionRequest, ExecutionResult } from '../types/execution.types';

export const executeCode = (data: CodeExecutionRequest) =>
  axiosInstance.post<ApiResponse<ExecutionResult>>('/api/execute', data);
