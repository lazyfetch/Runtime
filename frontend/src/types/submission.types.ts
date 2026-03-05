import type { Language } from './execution.types';

export interface Submission {
  id: string;
  userId: string;
  projectId: string | null;
  language: Language;
  code: string;
  output: string;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
  cacheHit: boolean;
  executionTimeMs: number;
  createdAt: string;
}
