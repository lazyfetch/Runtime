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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-10">

        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-white text-3xl font-bold tracking-tight">{user?.name}</h1>
            {lastActive && (
              <p className="text-zinc-500 text-sm mt-1">
                Last active on <span className="text-zinc-300 font-medium">{lastActive.title}</span>
              </p>
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

        {/* Projects */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-lg font-semibold">Projects</h2>
            <span className="text-sm text-zinc-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
          </div>
          <ProjectGrid projects={projects} loading={loading} onDelete={removeProject} onNew={() => setShowModal(true)} />
        </section>

        {/* Execution history */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-lg font-semibold">Recent Runs</h2>
            {submissions.length > 0 && (
              <span className="text-sm text-zinc-500">{submissions.length} total</span>
            )}
          </div>
          <RecentExecutions submissions={submissions} loading={subsLoading} />
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
