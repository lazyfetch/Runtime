import { useAuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import SubmissionHistory from './SubmissionHistory';

const ProfilePopover: React.FC = () => {
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700"
        >
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-zinc-500 text-xs truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="py-1">
              <button onClick={() => { setShowHistory(true); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                Submission History
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition-colors rounded-b-xl">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <SubmissionHistory open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};

export default ProfilePopover;
