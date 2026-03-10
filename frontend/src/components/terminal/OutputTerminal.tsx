import { useState } from 'react';
import type { ExecutionResult } from '../../types/execution.types';
import { deriveStatus } from '../../types/execution.types';
import TerminalHeader from './TerminalHeader';
import Loader from '../common/Loader';
import { formatOutput } from '../../utils/formatOutput';

interface OutputTerminalProps {
  result: ExecutionResult | null;
  loading: boolean;
}

const OutputTerminal: React.FC<OutputTerminalProps> = ({ result, loading }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'problems'>('output');

  const status = result ? deriveStatus(result) : undefined;

  const handleCopy = () => {
    const text = result?.stdout ?? result?.stderr ?? '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]">
      <TerminalHeader
        status={status}
        executionTime={result?.executionTime}
        onCopy={handleCopy}
        copied={copied}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'output' && (
        <div className="flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed">
          {loading && (
            <div className="flex items-center gap-3 text-zinc-500">
              <Loader size="sm" />
              <span>Executing…</span>
            </div>
          )}

          {!loading && !result && (
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-green-900 select-none">❯</span>
                <span className="text-zinc-800 animate-pulse">_</span>
              </div>
              <p className="text-zinc-700 text-xs pl-5">
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded border border-zinc-800 text-[10px] font-mono">Ctrl</kbd>
                {' + '}
                <kbd className="px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded border border-zinc-800 text-[10px] font-mono">Enter</kbd>
                {' '}to run
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              <div className="flex items-center gap-2 text-[11px] mb-4 pb-3 border-b border-zinc-900">
                <span className={`font-mono ${status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                  {status === 'SUCCESS' ? '❯' : '✗'}
                </span>
                <span className="text-zinc-600">
                  Process exited with code{' '}
                  <span className={status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}>
                    {result.exitCode}
                  </span>
                </span>
              </div>
              {result.stdout && (
                <pre className="text-[#9cdcfe] whitespace-pre-wrap break-words">{formatOutput(result.stdout)}</pre>
              )}
              {result.stderr && (
                <pre className="text-red-400 whitespace-pre-wrap break-words mt-2">{result.stderr}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-9 h-9 text-zinc-800">
            <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
          </svg>
          <div>
            <p className="text-zinc-500 text-sm font-medium">No problems detected</p>
            <p className="text-zinc-700 text-xs mt-1">Errors and warnings will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputTerminal;
