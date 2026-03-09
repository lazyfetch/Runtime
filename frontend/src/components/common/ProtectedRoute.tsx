import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Loader from './Loader';
import type React from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuthContext();
  // Wait for the /api/auth/me check to complete before making any routing decision.
  // This prevents flashing the login page on refresh when the user IS authenticated.
  if (authLoading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
