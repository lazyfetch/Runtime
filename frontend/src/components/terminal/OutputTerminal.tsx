import { useState } from 'react';
import type { ExecutionResult } from '../../types/execution.types';
import TerminalHeader from './TerminalHeader';
import Loader from '../common/Loader';
import { formatOutput } from '../../utils/formatOutput';

interface OutputTerminalProps {
  result: ExecutionResult | null;
  loading: boolean;
}

const OutputTerminal: React.FC<OutputTerminalProps> = ({ result, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = result?.output ?? result?.error ?? '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <TerminalHeader
        status={result?.status}
        executionTimeMs={result?.executionTimeMs}
        cacheHit={result?.cacheHit}
        onCopy={handleCopy}
      />
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {loading && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Loader size="sm" /> <span>Running...</span>
          </div>
        )}
        {!loading && !result && (
          <span className="text-zinc-600">Output will appear here after you run your code.</span>
        )}
        {!loading && result && (
          <>
            {result.output && <pre className="text-green-300 whitespace-pre-wrap">{formatOutput(result.output)}</pre>}
            {result.error && <pre className="text-red-400 whitespace-pre-wrap">{result.error}</pre>}
          </>
        )}
        {copied && <span className="text-xs text-zinc-500 mt-2 block">Copied!</span>}
      </div>
    </div>
  );
};

export default OutputTerminal;
