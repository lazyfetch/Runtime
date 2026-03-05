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
      setProjects(res.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const addProject = async (data: CreateProjectRequest) => {
    const res = await createProject(data);
    setProjects((prev) => [res.data, ...prev]);
    return res.data;
  };

  const editProject = async (id: string, data: UpdateProjectRequest) => {
    const res = await updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const removeProject = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, loading, error, addProject, editProject, removeProject, refetch: fetchProjects };
};
