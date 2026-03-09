import LanguageSelector from './LanguageSelector';
import type { Language } from '../../types/execution.types';

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onClear: () => void;
  loading: boolean;
  projectTitle?: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language, onLanguageChange, onRun, onClear, loading,
  projectTitle, zoom, onZoomIn, onZoomOut, onZoomReset,
}) => (
  <div className="shrink-0 flex items-center gap-2 px-4 h-11 bg-zinc-900 border-b border-zinc-800">
    {/* Project title */}
    <span className="text-sm text-zinc-300 font-medium truncate max-w-[200px]">
      {projectTitle || 'Untitled'}
    </span>

    <div className="w-px h-5 bg-zinc-700 mx-1" />

    {/* Language selector */}
    <LanguageSelector value={language} onChange={onLanguageChange} />

    {/* Zoom controls — right-aligned */}
    <div className="ml-auto flex items-center gap-0.5">
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-lg font-light leading-none"
        title="Zoom out"
      >−</button>
      <button
        onClick={onZoomReset}
        className="px-2 h-7 rounded text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors font-mono min-w-[3.5rem] text-center"
        title="Reset to 100%"
      >{zoom}%</button>
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-lg font-light leading-none"
        title="Zoom in"
      >+</button>
    </div>

    <div className="w-px h-5 bg-zinc-700 mx-2" />

    {/* Actions */}
    <button
      onClick={onClear}
      className="h-7 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
    >Clear</button>

    <button
      onClick={onRun}
      disabled={loading}
      className="h-8 px-4 flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md transition-colors shadow-md shadow-green-900/40"
    >
      {loading ? (
        <>
          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Running…
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 5v14l11-7z" /></svg>
          Run
        </>
      )}
    </button>
  </div>
);

export default EditorToolbar;
