import { useState } from 'react';
import type { ExecutionResult } from '../../types/execution.types';
import { deriveStatus } from '../../types/execution.types';
import TerminalHeader from './TerminalHeader';
import Loader from '../common/Loader';
import { formatOutput } from '../../utils/formatOutput';

interface OutputTerminalProps {
  result: ExecutionResult | null;
  loading: boolean;
  jobStatus?: 'QUEUED' | 'RUNNING' | null;
  error?: string | null;
}

const OutputTerminal: React.FC<OutputTerminalProps> = ({ result, loading, jobStatus, error }) => {
  const [copied, setCopied] = useState(false);

  const status = result ? deriveStatus(result) : undefined;

  const handleCopy = async () => {
    const text = result?.stdout ?? result?.stderr ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
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
      />

      <div className="flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed">
          {loading && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-zinc-500">
                <Loader size="sm" />
                <span className="font-mono text-xs">
                  {jobStatus === 'QUEUED' && 'Queued — waiting for worker…'}
                  {jobStatus === 'RUNNING' && 'Running…'}
                  {!jobStatus && 'Executing…'}
                </span>
              </div>
              {jobStatus && (
                <div className="flex items-center gap-1.5 pl-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest ${
                    jobStatus === 'QUEUED' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'
                  }`}>{jobStatus}</span>
                </div>
              )}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] mb-2 pb-3 border-b border-zinc-900">
                <span className="font-mono text-red-600">✗</span>
                <span className="text-zinc-600">Execution failed</span>
              </div>
              <pre className="text-red-400 whitespace-pre-wrap break-words text-xs">{error}</pre>
            </div>
          )}

          {!loading && !error && !result && (
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

          {!loading && !error && result && (
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
    </div>
  );
};

export default OutputTerminal;
