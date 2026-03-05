import type { Language } from './execution.types';

export interface Project {
  id: string;
  userId: string;
  title: string;
  language: Language;
  code: string;
  lastOutput: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  language: Language;
  code?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  language?: Language;
  code?: string;
  lastOutput?: string;
}
