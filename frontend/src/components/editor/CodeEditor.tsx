import { useRef, useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type * as MonacoType from 'monaco-editor';
import type { Language } from '../../types/execution.types';
import { languageToMonaco } from '../../utils/languageMap';
import { getSnippets } from './snippets';

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
}

const LANGS: Language[] = ['java', 'python', 'c', 'cpp', 'javascript'];

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, fontSize = 14 }) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Register snippet completions for all languages once at mount
    LANGS.forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(languageToMonaco[lang], {
        provideCompletionItems(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return { suggestions: getSnippets(lang, monaco, range) };
        },
      });
    });

    // Show mobile cut/copy/paste bar whenever there is a selection
    editor.onDidChangeCursorSelection(() => {
      const sel = editor.getSelection();
      setHasSelection(!!sel && !sel.isEmpty());
    });
  }, []);

  const getSelectedText = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return '';
    const sel = editor.getSelection();
    return sel ? (editor.getModel()?.getValueInRange(sel) ?? '') : '';
  }, []);

  const handleMobileCopy = useCallback(() => {
    navigator.clipboard.writeText(getSelectedText()).catch(() => {});
  }, [getSelectedText]);

  const handleMobileCut = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const sel = editor.getSelection();
    if (!sel) return;
    navigator.clipboard.writeText(getSelectedText()).catch(() => {});
    editor.executeEdits('cut', [{ range: sel, text: '' }]);
  }, [getSelectedText]);

  const handleMobilePaste = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    try {
      const text = await navigator.clipboard.readText();
      const sel = editor.getSelection();
      if (sel) editor.executeEdits('paste', [{ range: sel, text }]);
    } catch {}
  }, []);

  return (
    <div className="relative h-full">
      {/* Cut / Copy / Paste toolbar — useful on mobile where context menu is blocked */}
      {hasSelection && (
        <div className="absolute top-2 right-2 z-50 flex gap-px bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {[
            { label: 'Cut',   action: handleMobileCut   },
            { label: 'Copy',  action: handleMobileCopy  },
            { label: 'Paste', action: handleMobilePaste },
          ].map(({ label, action }) => (
            <button
              key={label}
              onPointerDown={(e) => { e.preventDefault(); action(); }}
              className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 active:bg-zinc-600 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <Editor
        height="100%"
        language={languageToMonaco[language]}
        value={value}
        theme="vs-dark"
        onMount={handleMount}
        onChange={(val) => onChange(val ?? '')}
        options={{
          fontSize,
          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Consolas, monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 16, bottom: 16 },
          snippetSuggestions: 'top',
          quickSuggestions: { other: true, comments: false, strings: false },
          suggest: { snippetsPreventQuickSuggestions: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;
