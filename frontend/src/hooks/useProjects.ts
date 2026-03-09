import { useState, useEffect } from 'react';
import { getProjects, createProject, deleteProject, updateProject } from '../api/projects.api';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const addProject = async (data: CreateProjectRequest) => {
    const res = await createProject(data);
    const project = res.data.data;
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const editProject = async (id: string | number, data: UpdateProjectRequest) => {
    const res = await updateProject(id, data);
    const updated = res.data.data;
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const removeProject = async (id: string | number) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== Number(id)));
  };

  return { projects, loading, error, addProject, editProject, removeProject, refetch: fetchProjects };
};
