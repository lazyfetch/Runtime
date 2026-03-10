import { Link, useLocation } from 'react-router-dom';
import ProfilePopover from '../profile/ProfilePopover';
import { useAuthContext } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        pathname === to ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="h-12 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 flex items-center px-5 gap-4 shrink-0 sticky top-0 z-40">
      <Link
        to={isAuthenticated ? '/dashboard' : '/login'}
        className="flex items-center gap-2 text-white font-bold text-sm tracking-tight shrink-0 mr-2"
      >
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[11px] font-black select-none">R</div>
        Runtime
      </Link>

      {isAuthenticated && (
        <>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-1">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/editor/new', 'New File')}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ProfilePopover />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
