export type Language = 'java' | 'python' | 'c' | 'cpp' | 'javascript';

export interface CodeExecutionRequest {
  code: string;
  language: Language;
  stdin?: string;
  projectId?: number;
}

/** Matches backend ExecutionResult */
export interface ExecutionResult {
  stdout: string;
  stderr: string;
  errorType: string; // "NONE" | "TIMEOUT" | "RUNTIME_ERROR" | "COMPILE_ERROR"
  exitCode: number;
  executionTime: number; // milliseconds
}

/** Matches backend ApiResponse<T> */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ExecutionStatus = 'SUCCESS' | 'ERROR' | 'TIMEOUT';

export const deriveStatus = (result: ExecutionResult): ExecutionStatus => {
  if (result.errorType === 'TIMEOUT') return 'TIMEOUT';
  if (result.exitCode === 0) return 'SUCCESS';
  return 'ERROR';
};
