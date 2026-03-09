import type { Project } from '../../types/project.types';
import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: number) => void;
  onNew: () => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, loading, onDelete, onNew }) => {
  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>;

  if (projects.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-700 rounded-xl text-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl select-none">&lt;/&gt;</div>
      <div>
        <p className="text-white font-medium">No projects yet</p>
        <p className="text-zinc-500 text-sm mt-1">Create your first project to start running code</p>
      </div>
      <button
        onClick={onNew}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        + New Project
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((p) => <ProjectCard key={p.id} project={p} onDelete={onDelete} />)}
    </div>
  );
};

export default ProjectGrid;
