import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/execution.types';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

export const getProjects = () =>
  axiosInstance.get<ApiResponse<Project[]>>('/api/codes');

export const getProjectById = (id: string | number) =>
  axiosInstance.get<ApiResponse<Project>>(`/api/codes/${id}`);

export const createProject = (data: CreateProjectRequest) =>
  axiosInstance.post<ApiResponse<Project>>('/api/codes', data);

export const updateProject = (id: string | number, data: UpdateProjectRequest) =>
  axiosInstance.patch<ApiResponse<Project>>(`/api/codes/${id}`, data);

export const deleteProject = (id: string | number) =>
  axiosInstance.delete<ApiResponse<void>>(`/api/codes/${id}`);
