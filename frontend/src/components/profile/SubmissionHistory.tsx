import { useSubmissionHistory } from '../../hooks/useSubmissionHistory';
import { formatDate, formatExecutionTime } from '../../utils/formatOutput';
import { languageLabels } from '../../utils/languageMap';
import Loader from '../common/Loader';

interface SubmissionHistoryProps {
  open: boolean;
  onClose: () => void;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ open, onClose }) => {
  const { submissions, loading } = useSubmissionHistory();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="ml-auto w-full max-w-md bg-zinc-900 border-l border-zinc-700 h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-white font-semibold">Submission History</h2>
          <button className="text-zinc-400 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <div className="flex-1 overflow-auto divide-y divide-zinc-800">
          {loading && <div className="flex justify-center p-8"><Loader /></div>}
          {!loading && submissions.length === 0 && (
            <p className="text-zinc-500 text-sm text-center p-8">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <div key={s.id} className="px-5 py-3 hover:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{languageLabels[s.language]}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${s.status === 'SUCCESS' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex gap-3 mt-1 text-xs text-zinc-500">
                <span>{formatDate(s.createdAt)}</span>
                <span>{formatExecutionTime(s.executionTimeMs)}</span>
                {s.cacheHit && <span className="text-purple-400">⚡ Cache Hit</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;
