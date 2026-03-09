import { Editor } from '@monaco-editor/react';
import type { Language } from '../../types/execution.types';
import { languageToMonaco } from '../../utils/languageMap';

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, fontSize = 14 }) => (
  <Editor
    height="100%"
    language={languageToMonaco[language]}
    value={value}
    theme="vs-dark"
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
    }}
  />
);

export default CodeEditor;
