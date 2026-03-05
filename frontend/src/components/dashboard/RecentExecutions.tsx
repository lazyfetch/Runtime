import type { Submission } from '../../types/submission.types';
import { languageLabels } from '../../utils/languageMap';
import { formatDate, formatExecutionTime } from '../../utils/formatOutput';
import Loader from '../common/Loader';

interface RecentExecutionsProps {
  submissions: Submission[];
  loading: boolean;
}

const RecentExecutions: React.FC<RecentExecutionsProps> = ({ submissions, loading }) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b border-zinc-700">
      <h3 className="text-white font-medium text-sm">Recent Executions</h3>
    </div>
    {loading && <div className="flex justify-center p-6"><Loader /></div>}
    {!loading && submissions.length === 0 && (
      <p className="text-zinc-500 text-sm text-center p-6">No executions yet.</p>
    )}
    <div className="divide-y divide-zinc-700">
      {submissions.slice(0, 5).map((s) => (
        <div key={s.id} className="flex items-center gap-3 px-4 py-3 text-sm">
          <span className={`w-2 h-2 rounded-full ${s.status === 'SUCCESS' ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-zinc-300">{languageLabels[s.language]}</span>
          <span className="text-zinc-500">{formatDate(s.createdAt)}</span>
          <span className="text-zinc-500">{formatExecutionTime(s.executionTimeMs)}</span>
          {s.cacheHit && <span className="text-purple-400 text-xs">⚡ Cache</span>}
        </div>
      ))}
    </div>
  </div>
);

export default RecentExecutions;
