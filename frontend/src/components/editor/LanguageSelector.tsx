import type { Language } from '../../types/execution.types';
import { languageLabels, languageIcons } from '../../utils/languageMap';

const LANGUAGES: Language[] = ['java', 'python', 'c', 'cpp', 'javascript'];

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <img src={languageIcons[value]} alt={`${languageLabels[value]} logo`} className="w-4 h-4" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className="bg-zinc-800 border border-zinc-600 text-white rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 cursor-pointer"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {languageLabels[lang]}
        </option>
      ))}
    </select>
  </div>
);

export default LanguageSelector;