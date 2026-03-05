import { formatExecutionTime } from '../../utils/formatOutput';

interface TerminalHeaderProps {
  status?: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | null;
  executionTimeMs?: number;
  cacheHit?: boolean;
  onCopy: () => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ status, executionTimeMs, cacheHit, onCopy }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700 text-xs">
    <span className="text-zinc-400 font-medium tracking-wider uppercase">Output</span>
    {status && (
      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${status === 'SUCCESS' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
        {status}
      </span>
    )}
    {cacheHit && (
      <span className="px-1.5 py-0.5 rounded bg-purple-900 text-purple-300 font-medium">⚡ Cache Hit</span>
    )}
    {executionTimeMs != null && (
      <span className="text-zinc-500">{formatExecutionTime(executionTimeMs)}</span>
    )}
    <button className="ml-auto text-zinc-400 hover:text-white" onClick={onCopy}>Copy</button>
  </div>
);

export default TerminalHeader;
