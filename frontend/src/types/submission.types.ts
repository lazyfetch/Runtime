import type { Language } from './execution.types';

export interface Submission {
  id: number;
  projectId: number | null;
  language: Language;
  code: string;
  stdout: string;
  stderr: string;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
  executionTime: number;
  createdAt: string;
}
