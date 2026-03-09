import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { languageLabels, languageIcons, languageColors } from '../../utils/languageMap';
import { formatDate } from '../../utils/formatOutput';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const colors = languageColors[project.language];

  return (
    <div
      className={`group relative bg-zinc-900 border border-zinc-800 border-l-[3px] ${colors.border} rounded-xl p-5 flex flex-col gap-5 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-150 cursor-pointer`}
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate leading-snug">{project.title}</h3>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
            <img src={languageIcons[project.language]} alt="" className="w-3.5 h-3.5" />
            {languageLabels[project.language]}
          </div>
        </div>
        <img src={languageIcons[project.language]} alt="" className="w-9 h-9 opacity-10 group-hover:opacity-25 transition-opacity shrink-0 mt-0.5" />
      </div>

      {/* Code preview */}
      {project.code ? (
        <pre className="text-xs text-zinc-400 bg-zinc-950/80 border border-zinc-800 rounded-lg px-3.5 py-3 overflow-hidden font-mono leading-relaxed line-clamp-3 select-none">
          {project.code.split('\n').slice(0, 3).join('\n')}
        </pre>
      ) : (
        <div className="h-16 bg-zinc-950/50 border border-zinc-800 border-dashed rounded-lg flex items-center justify-center">
          <span className="text-zinc-700 text-xs">Empty project</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600">Updated {formatDate(project.updatedAt)}</span>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 text-xs px-2.5 py-1 rounded-md hover:bg-red-500/10 font-medium"
          onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
