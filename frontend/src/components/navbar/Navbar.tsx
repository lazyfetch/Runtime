import { Link, useLocation } from 'react-router-dom';
import ProfilePopover from '../profile/ProfilePopover';
import { useAuthContext } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';

  return (
    <nav className="h-12 bg-zinc-900 border-b border-zinc-700 flex items-center px-4 gap-4 shrink-0">
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-white font-bold text-base tracking-tight">
        Runtime
      </Link>
      {isAuthenticated && (
        <>
          <div className="flex gap-2 ml-2">
            {!isDashboard && (
              <Link to="/dashboard" className="text-zinc-400 hover:text-white text-sm">Dashboard</Link>
            )}
          </div>
          <div className="ml-auto">
            <ProfilePopover />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
