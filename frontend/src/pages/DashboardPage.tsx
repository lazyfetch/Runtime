import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import RecentExecutions from '../components/dashboard/RecentExecutions';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LanguageSelector from '../components/editor/LanguageSelector';
import { useProjects } from '../hooks/useProjects';
import { useSubmissionHistory } from '../hooks/useSubmissionHistory';
import { useAuthContext } from '../context/AuthContext';
import { languageLabels, languageIcons } from '../utils/languageMap';
import type { Language } from '../types/execution.types';

const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { projects, loading, addProject, removeProject } = useProjects();
  const { submissions, loading: subsLoading } = useSubmissionHistory();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', language: 'python' as Language });
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const project = await addProject({ ...newProject, code: '' });
      setShowModal(false);
      navigate(`/editor/${project.id}`);
    } finally {
      setCreating(false);
    }
  };

  const lastActive = projects.length > 0
    ? [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  const totalRuns = submissions.length;
  const passed = submissions.filter(s => s.status === 'SUCCESS').length;
  const passRate = totalRuns > 0 ? Math.round((passed / totalRuns) * 100) : null;
  const runsThisWeek = submissions.filter(
    s => Date.now() - new Date(s.createdAt).getTime() < 7 * 86400000
  ).length;
  const langUsage = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.language] = (acc[p.language] || 0) + 1;
    return acc;
  }, {});
  const topLang = (Object.entries(langUsage).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null) as Language | null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const quickStartLangs: Language[] = ['python', 'javascript', 'java', 'cpp', 'c'];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-sm">{greeting},</p>
            <h1 className="text-white text-2xl font-bold tracking-tight mt-0.5">{user?.name}</h1>
            {lastActive ? (
              <p className="text-zinc-500 text-xs mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Last active on <span className="text-zinc-300 ml-0.5">{lastActive.title}</span>
              </p>
            ) : (
              <p className="text-zinc-600 text-xs mt-1.5">No projects yet — create one to get started</p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Project
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-3">Projects</p>
            <p className="text-white text-3xl font-bold tabular-nums">{loading ? '—' : projects.length}</p>
            <p className="text-zinc-600 text-xs mt-2">{projects.length === 1 ? '1 project' : `${projects.length} total`}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-3">Total Runs</p>
            <p className="text-white text-3xl font-bold tabular-nums">{subsLoading ? '—' : totalRuns}</p>
            <p className="text-zinc-600 text-xs mt-2">{runsThisWeek} this week</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-3">Pass Rate</p>
            <p className={`text-3xl font-bold tabular-nums ${
              passRate === null ? 'text-zinc-600' :
              passRate >= 80 ? 'text-green-400' :
              passRate >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>{passRate === null ? '—' : `${passRate}%`}</p>
            <p className="text-zinc-600 text-xs mt-2">{passed} passed of {totalRuns}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-3">Top Language</p>
            {topLang ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={languageIcons[topLang]} alt="" className="w-7 h-7" />
                  <p className="text-white text-xl font-bold">{languageLabels[topLang]}</p>
                </div>
                <p className="text-zinc-600 text-xs mt-2">{langUsage[topLang]} project{langUsage[topLang] !== 1 ? 's' : ''}</p>
              </>
            ) : (
              <p className="text-zinc-600 text-3xl font-bold">—</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest shrink-0">Quick start</span>
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="flex gap-2">
            {quickStartLangs.map(lang => (
              <button
                key={lang}
                onClick={() => { setNewProject({ title: '', language: lang }); setShowModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              >
                <img src={languageIcons[lang]} alt="" className="w-3.5 h-3.5" />
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-base font-semibold">Projects</h2>
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
          </div>
          <ProjectGrid projects={projects} loading={loading} onDelete={removeProject} onNew={() => setShowModal(true)} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-base font-semibold">Recent Runs</h2>
            {submissions.length > 0 && (
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{submissions.length} total</span>
            )}
          </div>
          <RecentExecutions submissions={submissions} loading={subsLoading} projects={projects} />
        </section>

      </main>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Project">
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <Input
            label="Project Name"
            placeholder="Binary search, Fibonacci, API test..."
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Language</label>
            <LanguageSelector value={newProject.language} onChange={(lang) => setNewProject({ ...newProject, language: lang })} />
          </div>
          <Button type="submit" variant="primary" loading={creating} className="w-full mt-1">Create & Open Editor</Button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
