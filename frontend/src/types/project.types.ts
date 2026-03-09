import type { Language } from './execution.types';

export interface Project {
  id: number;
  title: string;
  language: Language;
  code: string;
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
}
