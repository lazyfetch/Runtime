import { useState, useEffect } from 'react';
import { getSubmissions } from '../api/submission.api';
import type { Submission } from '../types/submission.types';

export const useSubmissionHistory = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubmissions()
      .then((res) => setSubmissions(res.data))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  return { submissions, loading, error };
};
