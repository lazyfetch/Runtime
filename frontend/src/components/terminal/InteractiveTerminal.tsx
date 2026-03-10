import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface InteractiveTerminalProps {
  language: string;
  code: string;
}

const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ language, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const term = termRef.current;
    if (!term) return;
    const sel = term.getSelection();
    const text = sel || '';
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
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      allowProposedApi: true,
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.5,
      theme: {
        background: '#0e0e0e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selectionBackground: '#264f78',
        black: '#1e1e1e',
        red: '#f44747',
        green: '#6a9955',
        yellow: '#dcdcaa',
        blue: '#569cd6',
        magenta: '#c586c0',
        cyan: '#9cdcfe',
        white: '#d4d4d4',
        brightBlack: '#808080',
        brightRed: '#f44747',
        brightGreen: '#b5cea8',
        brightYellow: '#dcdcaa',
        brightBlue: '#9cdcfe',
        brightMagenta: '#c586c0',
        brightCyan: '#9cdcfe',
        brightWhite: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    termRef.current = term;
    fitAddon.fit();

    const wsBase = (import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:8081')
      .replace('https://', 'wss://')
      .replace('http://', 'ws://');
    const ws = new WebSocket(`${wsBase}/ws/execute`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ language, code }));
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      term.write('\r\n\x1b[90m ─────────────────────────────────\x1b[0m\r\n');
      term.write('\x1b[90m Process exited. Press Run to restart.\x1b[0m\r\n');
    };

    ws.onerror = () => {
      term.write('\x1b[31m Connection error — is the backend running?\x1b[0m\r\n');
    };

    let lineBuffer = '';

    term.onData((data: string) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      if (data === '\x03') {
        ws.send('\x03');
        term.write('^C\r\n');
        lineBuffer = '';
        return;
      }

      if (data === '\x7f' || data === '\b') {
        if (lineBuffer.length > 0) {
          lineBuffer = lineBuffer.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      if (data === '\r') {
        ws.send(lineBuffer);
        term.write('\r\n');
        lineBuffer = '';
        return;
      }

      if (data < ' ') return;

      lineBuffer += data;
      term.write(data);
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      term.dispose();
      termRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]">
      <div className="shrink-0 flex items-center h-10 bg-[#252526] border-b border-[#1a1a1a] px-4 gap-3 select-none">
        <span className="text-sm font-medium text-zinc-300">Interactive Terminal</span>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
        <span className="text-xs text-zinc-600">60 s max · Ctrl+C to interrupt</span>
        <button
          onClick={handleCopy}
          className="ml-auto text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5 rounded hover:bg-zinc-700 font-medium text-sm"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-hidden p-2" />
    </div>
  );
};

export default InteractiveTerminal;
