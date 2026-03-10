import { useState } from 'react';
import { executeCode, pollResult } from '../api/execution.api';
import type { CodeExecutionRequest, ExecutionResult, ApiResponse } from '../types/execution.types';

const POLL_INTERVAL_MS = 500;
const MAX_POLLS = 60;

export type JobStatus = 'QUEUED' | 'RUNNING' | null;

export const useCodeExecution = () => {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (request: CodeExecutionRequest) => {
    setLoading(true);
    setJobStatus('QUEUED');
    setError(null);
    try {
      const submitRes = await executeCode(request);
      const jobId = submitRes.data.data;

      if (!jobId) throw new Error('No job ID returned');

      let polls = 0;
      while (polls < MAX_POLLS) {
        await new Promise<void>(r => setTimeout(r, POLL_INTERVAL_MS));
        const pollRes = await pollResult(jobId);
        const { message, data } = pollRes.data;

        if (message === 'RUNNING') setJobStatus('RUNNING');

        if (message === 'COMPLETED') {
          if (!data) { setError('No result returned from server.'); return; }
          const inner = JSON.parse(data) as ApiResponse<ExecutionResult>;
          if (!inner.data) { setError(inner.message || 'Execution returned no output.'); return; }
          setResult(inner.data);
          return;
        }
        if (message === 'FAILED') {
          setError('Execution failed on server.');
          return;
        }
        polls++;
      }
      setError('Execution timed out. Please try again.');
    } catch {
      setError('Execution failed. Please try again.');
    } finally {
      setLoading(false);
      setJobStatus(null);
    }
  };

  const clearResult = () => setResult(null);

  return { result, loading, jobStatus, error, run, clearResult };
};
