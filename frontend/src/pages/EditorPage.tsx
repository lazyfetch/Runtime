import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/editor/CodeEditor';
import OutputTerminal from '../components/terminal/OutputTerminal';
import InteractiveTerminal from '../components/terminal/InteractiveTerminal';
import LanguageSelector from '../components/editor/LanguageSelector';
import Loader from '../components/common/Loader';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useProjects } from '../hooks/useProjects';
import { getProjectById } from '../api/projects.api';
import type { Language } from '../types/execution.types';
import { defaultSnippets, languageIcons } from '../utils/languageMap';

const ZOOM_LEVELS = [75, 90, 100, 110, 125, 150];

const LANG_EXT: Record<Language, string> = {
  python: 'main.py',
  java: 'Main.java',
  c: 'main.c',
  cpp: 'main.cpp',
  javascript: 'index.js',
};

const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { result, loading: executing, jobStatus, error: execError, run, clearResult } = useCodeExecution();
  const { editProject } = useProjects();
  const containerRef = useRef<HTMLDivElement>(null);

  const codeRef = useRef('');
  const langRef = useRef<Language>('python');

  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(defaultSnippets['python']);
  const [projectTitle, setProjectTitle] = useState('');
  const [pageLoading, setPageLoading] = useState(!!projectId);
  const [zoomIndex, setZoomIndex] = useState(2);
  const [editorWidthPct, setEditorWidthPct] = useState(62);
  const [showOutput, setShowOutput] = useState(true);
  const [interactiveKey, setInteractiveKey] = useState(0);
  const [interactiveSnapshot, setInteractiveSnapshot] = useState<{ code: string; language: string } | null>(null);

  useEffect(() => { codeRef.current = code; }, [code]);
  useEffect(() => { langRef.current = language; }, [language]);

  const fontSize = Math.round((ZOOM_LEVELS[zoomIndex] / 100) * 14);

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId)
      .then((res) => {
        const project = res.data.data;
        setLanguage(project.language);
        setCode(project.code || defaultSnippets[project.language]);
        setProjectTitle(project.title || '');
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setPageLoading(false));
  }, [projectId, navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !executing) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [executing]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(defaultSnippets[lang]);
    clearResult();
  };

  const handleRun = () => {
    const c = codeRef.current;
    const lang = langRef.current;

    const CPP_STDIN = /\bcin\s*>>|\bscanf\s*\(|\bscanf_s\s*\(|\bgets\s*\(|\bfgets\s*\(|\bgetchar\s*\(|\bgetline\s*\(\s*cin|\bcin\.get\s*\(|\bcin\.ignore\s*\(/;
    if ((lang === 'c' || lang === 'cpp') && CPP_STDIN.test(c)) {
      setInteractiveSnapshot({ code: c, language: lang });
      setInteractiveKey((k) => k + 1);
      setShowOutput(true);
      return;
    }

    setInteractiveKey(0);
    setShowOutput(true);
    run({ code: c, language: lang, projectId: projectId ? Number(projectId) : undefined });
  };

  useEffect(() => {
    if (!result) return;
    const stdinRequired =
      result.errorType === 'STDIN_REQUIRED' ||
      result.stderr?.includes('EOFError') ||
      result.stderr?.includes('NoSuchElementException') ||
      result.stderr?.includes('end of file');
    if (stdinRequired) {
      setInteractiveSnapshot({ code: codeRef.current, language: langRef.current });
      setInteractiveKey((k) => k + 1);
    }
  }, [result]);

  const handleClear = () => {
    setCode(defaultSnippets[language]);
    clearResult();
  };

  useEffect(() => {
    if (!projectId) return;
    return () => {
      editProject(projectId, { code: codeRef.current, language: langRef.current }).catch(() => {});
    };
  }, [projectId]);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setEditorWidthPct(Math.min(82, Math.max(25, pct)));
    };
    const onUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  }, []);

  if (pageLoading) {
    return (
      <div className="h-screen bg-[#1e1e1e] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1e1e1e] flex flex-col overflow-hidden">


      <div className="shrink-0 h-11 bg-[#161616] border-b border-[#2a2a2a] flex items-center px-3 gap-2">

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm px-2.5 h-8 rounded hover:bg-zinc-800 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
          Dashboard
        </button>

        <div className="w-px h-4 bg-zinc-800" />

        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-zinc-600 font-medium shrink-0">Runtime</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-zinc-700 shrink-0">
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span className="text-zinc-200 font-semibold truncate">{projectTitle || 'Untitled'}</span>
        </div>

        <div className="ml-auto flex items-center gap-1 shrink-0">

          <LanguageSelector value={language} onChange={handleLanguageChange} />

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          <button
            onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-lg transition-colors"
            title="Zoom out"
          >−</button>
          <button
            onClick={() => setZoomIndex(2)}
            className="px-2 h-8 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded font-mono min-w-[4rem] text-center transition-colors"
            title="Reset zoom"
          >{ZOOM_LEVELS[zoomIndex]}%</button>
          <button
            onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-lg transition-colors"
            title="Zoom in"
          >+</button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          <button
            onClick={() => setShowOutput((v) => !v)}
            title={showOutput ? 'Hide terminal' : 'Show terminal'}
            className={`h-8 px-3 text-sm rounded transition-colors flex items-center gap-1.5 ${
              showOutput ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 15h18M8 3v12" strokeOpacity=".5" />
            </svg>
            Terminal
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          <button
            onClick={handleClear}
            className="h-8 px-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            Reset
          </button>

          <button
            onClick={handleRun}
            disabled={executing}
            title="Run (Ctrl+Enter)"
            className="h-8 pl-3 pr-4 flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors ml-1 shadow-lg shadow-green-900/40"
          >
            {executing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 5v14l11-7z" /></svg>
                Run
                <span className="text-[10px] text-green-200/50 font-mono tracking-tight">⌃↵</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="shrink-0 h-10 bg-[#252526] border-b border-[#1a1a1a] flex items-end overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-9 bg-[#1e1e1e] border-t-2 border-t-blue-500 border-r border-r-[#1a1a1a] text-zinc-300 text-sm cursor-default select-none shrink-0">
          <img src={languageIcons[language]} alt="" className="w-3.5 h-3.5" />
          <span className="font-medium">{LANG_EXT[language]}</span>
          <span className="text-zinc-700 hover:text-zinc-400 cursor-pointer ml-0.5 text-sm leading-none">×</span>
        </div>
        <div className="flex-1 h-full" />
      </div>

      <div ref={containerRef} className="flex-1 flex overflow-hidden">

        <div
          style={{ width: showOutput ? `${editorWidthPct}%` : '100%' }}
          className="flex flex-col min-w-0 shrink-0"
        >
          <CodeEditor language={language} value={code} onChange={setCode} fontSize={fontSize} />
        </div>

        {showOutput && (
          <>
            <div
              onMouseDown={onDividerMouseDown}
              className="w-[3px] shrink-0 bg-[#1a1a1a] hover:bg-blue-500/60 active:bg-blue-500 cursor-col-resize transition-colors"
            />
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
              {interactiveKey > 0 && interactiveSnapshot ? (
                <InteractiveTerminal
                  key={interactiveKey}
                  language={interactiveSnapshot.language}
                  code={interactiveSnapshot.code}
                />
              ) : (
                <OutputTerminal result={result} loading={executing} jobStatus={jobStatus} error={execError} />
              )}
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 px-4 h-7 bg-[#1a2d47] text-xs text-slate-300 select-none">
        <span className="font-semibold truncate max-w-[200px]">{projectTitle || 'Untitled'}</span>
        <span className="text-slate-500">│</span>
        <span>{language.toUpperCase()}</span>
        <span className="text-slate-500">│</span>
        <span>UTF-8</span>
        <span className="text-slate-500">│</span>
        <span>LF</span>
        <div className="ml-auto flex items-center gap-3">
          {executing && <span className="text-slate-400/70 animate-pulse">Running…</span>}
          <span>Zoom {ZOOM_LEVELS[zoomIndex]}%</span>
          <span className="text-slate-500">│</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
