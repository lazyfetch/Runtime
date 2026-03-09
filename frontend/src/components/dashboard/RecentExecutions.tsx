import type { Submission } from '../../types/submission.types';
import { languageLabels, languageIcons } from '../../utils/languageMap';
import { formatDate, formatExecutionTime } from '../../utils/formatOutput';
import Loader from '../common/Loader';

interface RecentExecutionsProps {
  submissions: Submission[];
  loading: boolean;
}

const RecentExecutions: React.FC<RecentExecutionsProps> = ({ submissions, loading }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

    {loading && <div className="flex justify-center p-10"><Loader /></div>}

    {!loading && submissions.length === 0 && (
      <div className="text-center py-16 px-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-lg select-none">▷</div>
        <p className="text-zinc-300 font-medium">No runs yet</p>
        <p className="text-zinc-600 text-sm mt-1">Open a project and run your first snippet</p>
      </div>
    )}

    {!loading && submissions.length > 0 && (
      <>
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_100px_90px_100px] gap-4 px-6 py-3 text-xs text-zinc-500 font-semibold uppercase tracking-widest border-b border-zinc-800">
          <span>Language</span>
          <span>Status</span>
          <span>Duration</span>
          <span>Cache</span>
          <span>When</span>
        </div>
        <div className="divide-y divide-zinc-800/80">
          {submissions.slice(0, 8).map((s) => (
            <div key={s.id} className="grid grid-cols-[1fr_140px_100px_90px_100px] gap-4 px-6 py-4 items-center hover:bg-zinc-800/40 transition-colors">
              <span className="text-zinc-200 text-sm inline-flex items-center gap-2.5 font-medium">
                <img src={languageIcons[s.language]} alt="" className="w-5 h-5" />
                {languageLabels[s.language]}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                s.status === 'SUCCESS' ? 'text-green-400' :
                s.status === 'TIMEOUT' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  s.status === 'SUCCESS' ? 'bg-green-400' :
                  s.status === 'TIMEOUT' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                {s.status === 'SUCCESS' ? 'Passed' : s.status === 'TIMEOUT' ? 'Timed out' : 'Failed'}
              </span>
              <span className="text-zinc-400 font-mono text-sm">{formatExecutionTime(s.executionTimeMs)}</span>
              <span className="text-sm">
                {s.cacheHit
                  ? <span className="text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-md text-xs font-semibold">CACHED</span>
                  : <span className="text-zinc-600 text-xs">—</span>
                }
              </span>
              <span className="text-zinc-500 text-sm">{formatDate(s.createdAt)}</span>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

export default RecentExecutions;
