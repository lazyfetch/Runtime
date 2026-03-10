import type { Submission } from '../../types/submission.types';
import type { Project } from '../../types/project.types';
import { languageLabels, languageIcons } from '../../utils/languageMap';
import { formatDate, formatExecutionTime } from '../../utils/formatOutput';
import Loader from '../common/Loader';

interface RecentExecutionsProps {
  submissions: Submission[];
  loading: boolean;
  projects?: Project[];
}

const statusConfig = {
  SUCCESS: { dot: 'bg-green-500', text: 'text-green-400', label: 'Passed', badge: 'bg-green-500/10 text-green-400' },
  ERROR:   { dot: 'bg-red-500',   text: 'text-red-400',   label: 'Failed', badge: 'bg-red-500/10 text-red-400'   },
  TIMEOUT: { dot: 'bg-yellow-500',text: 'text-yellow-400',label: 'Timed out', badge: 'bg-yellow-500/10 text-yellow-400' },
};

const RecentExecutions: React.FC<RecentExecutionsProps> = ({ submissions, loading, projects = [] }) => {
  const getProjectName = (projectId: number | null) =>
    projectId ? (projects.find(p => p.id === projectId)?.title ?? null) : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

      {loading && <div className="flex justify-center p-10"><Loader /></div>}

      {!loading && submissions.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto mb-3 text-base select-none">▷</div>
          <p className="text-zinc-300 font-medium text-sm">No runs yet</p>
          <p className="text-zinc-600 text-xs mt-1">Open a project and hit Run to see execution history here</p>
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <>
          <div className="grid grid-cols-[1.5fr_1fr_130px_90px_90px] gap-4 px-6 py-3 text-[11px] text-zinc-500 font-semibold uppercase tracking-widest border-b border-zinc-800">
            <span>Language</span>
            <span>Project</span>
            <span>Status</span>
            <span>Duration</span>
            <span>When</span>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {submissions.slice(0, 10).map((s) => {
              const cfg = statusConfig[s.status] ?? statusConfig.ERROR;
              const projectName = getProjectName(s.projectId);
              return (
                <div key={s.id} className="grid grid-cols-[1.5fr_1fr_130px_90px_90px] gap-4 px-6 py-3.5 items-center hover:bg-zinc-800/40 transition-colors">
                  <span className="text-zinc-200 text-sm inline-flex items-center gap-2 font-medium">
                    <img src={languageIcons[s.language]} alt="" className="w-4.5 h-4.5 shrink-0" />
                    {languageLabels[s.language]}
                  </span>
                  <span className="text-zinc-500 text-sm truncate">
                    {projectName
                      ? <span className="text-zinc-400">{projectName}</span>
                      : <span className="text-zinc-700">—</span>
                    }
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md w-fit ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">{formatExecutionTime(s.executionTime)}</span>
                  <span className="text-zinc-600 text-xs">{formatDate(s.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentExecutions;
