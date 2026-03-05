import Button from '../common/Button';
import LanguageSelector from './LanguageSelector';
import type { Language } from '../../types/execution.types';

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onClear: () => void;
  loading: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ language, onLanguageChange, onRun, onClear, loading }) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-zinc-700">
    <LanguageSelector value={language} onChange={onLanguageChange} />
    <div className="ml-auto flex gap-2">
      <Button variant="ghost" onClick={onClear}>Clear</Button>
      <Button variant="primary" onClick={onRun} loading={loading}>
        Execute
      </Button>
    </div>
  </div>
);

export default EditorToolbar;
