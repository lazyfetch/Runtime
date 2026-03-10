import { formatExecutionTime } from '../../utils/formatOutput';

interface TerminalHeaderProps {
  status?: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | null;
  executionTime?: number;
  onCopy: () => void;
  copied?: boolean;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  status, executionTime, onCopy, copied,
}) => (
  <div className="shrink-0 flex items-center h-10 bg-[#252526] border-b border-[#1a1a1a] text-sm select-none px-3 gap-2">
    <span className="text-zinc-400 font-medium text-xs uppercase tracking-widest">Output</span>
    <div className="ml-auto flex items-center gap-2">
        {status && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs uppercase tracking-wide ${
            status === 'SUCCESS' ? 'bg-green-500/15 text-green-400' :
            status === 'TIMEOUT' ? 'bg-yellow-500/15 text-yellow-400' :
            'bg-red-500/15 text-red-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'SUCCESS' ? 'bg-green-400' :
              status === 'TIMEOUT' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            {status === 'SUCCESS' ? 'Passed' : status === 'TIMEOUT' ? 'Timed out' : 'Error'}
          </span>
        )}
        {executionTime != null && (
          <span className="text-zinc-500 font-mono text-sm">{formatExecutionTime(executionTime)}</span>
        )}
        <button
          onClick={onCopy}
          className="text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5 rounded hover:bg-zinc-700 font-medium text-sm"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
  </div>
);

export default TerminalHeader;
