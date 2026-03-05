import { Editor } from '@monaco-editor/react';
import type { Language } from '../../types/execution.types';
import { languageToMonaco } from '../../utils/languageMap';

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => (
  <Editor
    height="100%"
    language={languageToMonaco[language]}
    value={value}
    theme="vs-dark"
    onChange={(val) => onChange(val ?? '')}
    options={{
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      tabSize: 4,
      wordWrap: 'on',
    }}
  />
);

export default CodeEditor;
