import axiosInstance from './axiosInstance';
import type { CodeExecutionRequest, ExecutionResult } from '../types/execution.types';

export const executeCode = (data: CodeExecutionRequest) =>
  axiosInstance.post<ExecutionResult>('/api/execute', data);
