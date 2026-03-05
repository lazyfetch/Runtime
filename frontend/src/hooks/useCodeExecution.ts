import { useState } from 'react';
import { executeCode } from '../api/execution.api';
import type { CodeExecutionRequest, ExecutionResult } from '../types/execution.types';

export const useCodeExecution = () => {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (request: CodeExecutionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await executeCode(request);
      setResult(res.data);
    } catch {
      setError('Execution failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => setResult(null);

  return { result, loading, error, run, clearResult };
};
