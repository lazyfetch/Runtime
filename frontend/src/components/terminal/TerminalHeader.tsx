import { formatExecutionTime } from '../../utils/formatOutput';

interface TerminalHeaderProps {
  status?: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | null;
  executionTime?: number;
  onCopy: () => void;
  copied?: boolean;
  activeTab: 'output' | 'problems';
  onTabChange: (tab: 'output' | 'problems') => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  status, executionTime, onCopy, copied, activeTab, onTabChange,
}) => (
  <div className="shrink-0 flex items-center h-10 bg-[#252526] border-b border-[#1a1a1a] text-sm select-none">

    <div className="flex items-end h-full">
      {(['output', 'problems'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`h-9 px-5 font-medium capitalize transition-colors border-t-2 ${
            activeTab === tab
              ? 'text-zinc-200 bg-[#1e1e1e] border-t-blue-500'
              : 'text-zinc-500 hover:text-zinc-300 bg-transparent border-t-transparent hover:bg-zinc-800/30'
          }`}
        >
          {tab === 'output' ? 'Output' : 'Problems'}
        </button>
      ))}
    </div>

    {activeTab === 'output' && (
      <div className="ml-auto flex items-center gap-2 px-3">
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
    )}
  </div>
);

export default TerminalHeader;
