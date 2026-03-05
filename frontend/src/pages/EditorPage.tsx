import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import CodeEditor from '../components/editor/CodeEditor';
import EditorToolbar from '../components/editor/EditorToolbar';
import OutputTerminal from '../components/terminal/OutputTerminal';
import Loader from '../components/common/Loader';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useProjects } from '../hooks/useProjects';
import { getProjectById } from '../api/projects.api';
import type { Language } from '../types/execution.types';
import { defaultSnippets } from '../utils/languageMap';

const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { result, loading: executing, run, clearResult } = useCodeExecution();
  const { editProject } = useProjects();

  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(defaultSnippets['python']);
  const [pageLoading, setPageLoading] = useState(!!projectId);

  // Load existing project if editing one
  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId)
      .then((res) => {
        setLanguage(res.data.language);
        setCode(res.data.code || defaultSnippets[res.data.language]);
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setPageLoading(false));
  }, [projectId, navigate]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(defaultSnippets[lang]);
    clearResult();
  };

  const handleRun = async () => {
    await run({ code, language, projectId });
    
    if (projectId && result) {
      editProject(projectId, { code, language, lastOutput: result.output }).catch(() => {});
    }
  };

  const handleClear = () => {
    setCode(defaultSnippets[language]);
    clearResult();
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader size="lg" /></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <EditorToolbar language={language} onLanguageChange={handleLanguageChange} onRun={handleRun} onClear={handleClear} loading={executing} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-zinc-700">
          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>
        <div className="w-105 flex flex-col">
          <OutputTerminal result={result} loading={executing} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
