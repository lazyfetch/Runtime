import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { languageLabels, languageIcons } from '../../utils/languageMap';
import { formatDate } from '../../utils/formatOutput';
import Button from '../common/Button';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex flex-col gap-3 hover:border-zinc-500 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-medium truncate max-w-45">{project.title}</h3>
          <span className="text-sm text-zinc-400 inline-flex items-center gap-1.5">
            <img
              src={languageIcons[project.language]}
              alt={`${languageLabels[project.language]} logo`}
              className="w-4 h-4"
            />
            {languageLabels[project.language]}
          </span>
        </div>
      </div>
      <p className="text-xs text-zinc-500">Updated {formatDate(project.updatedAt)}</p>
      <div className="flex gap-2 mt-auto">
        <Button variant="primary" className="flex-1 text-sm py-1.5" onClick={() => navigate(`/editor/${project.id}`)}>
          Open
        </Button>
        <Button variant="danger" className="text-sm py-1.5 px-3" onClick={() => onDelete(project.id)}>
          ✕
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
