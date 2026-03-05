import type { Project } from '../../types/project.types';
import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, loading, onDelete }) => {
  if (loading) return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  if (projects.length === 0) return (
    <p className="text-zinc-500 text-sm text-center py-16">No projects yet. Create your first one!</p>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((p) => <ProjectCard key={p.id} project={p} onDelete={onDelete} />)}
    </div>
  );
};

export default ProjectGrid;
