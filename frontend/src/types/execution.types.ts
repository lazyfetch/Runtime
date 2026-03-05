export type Language = 'java' | 'python' | 'c' | 'cpp' | 'javascript';

export interface CodeExecutionRequest {
  code: string;
  language: Language;
  projectId?: string;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTimeMs: number;
  cacheHit: boolean;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
}
