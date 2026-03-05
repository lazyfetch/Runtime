import axiosInstance from './axiosInstance';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

export const getProjects = () =>
  axiosInstance.get<Project[]>('/api/projects');

export const getProjectById = (id: string) =>
  axiosInstance.get<Project>(`/api/projects/${id}`);

export const createProject = (data: CreateProjectRequest) =>
  axiosInstance.post<Project>('/api/projects', data);

export const updateProject = (id: string, data: UpdateProjectRequest) =>
  axiosInstance.put<Project>(`/api/projects/${id}`, data);

export const deleteProject = (id: string) =>
  axiosInstance.delete(`/api/projects/${id}`);
