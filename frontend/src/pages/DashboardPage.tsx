import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import RecentExecutions from '../components/dashboard/RecentExecutions';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
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
      const project = await addProject(newProject);
      setShowModal(false);
      navigate(`/editor/${project.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome back, {user?.username}</h1>
            <p className="text-zinc-400 text-sm mt-1">Pick up where you left off</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>+ New Project</Button>
        </div>

        <section>
          <h2 className="text-zinc-300 font-semibold mb-4">Your Projects</h2>
          <ProjectGrid projects={projects} loading={loading} onDelete={removeProject} />
        </section>

        <section>
          <RecentExecutions submissions={submissions} loading={subsLoading} />
        </section>
      </main>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Project">
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <Input label="Project Name" placeholder="My awesome script" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Language</label>
            <LanguageSelector value={newProject.language} onChange={(lang) => setNewProject({ ...newProject, language: lang })} />
          </div>
          <Button type="submit" variant="primary" loading={creating} className="w-full">Create & Open</Button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
