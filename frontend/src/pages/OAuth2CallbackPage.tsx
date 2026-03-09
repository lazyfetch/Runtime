import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getMe } from '../api/auth.api';
import Loader from '../components/common/Loader';

// Spring OAuth2SuccessHandler redirects here after setting the HttpOnly cookie.
// We call /api/auth/me to populate user context, then navigate to dashboard.
const OAuth2CallbackPage: React.FC = () => {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => {
        setAuth({ email: res.data.email, name: res.data.name });
        navigate('/dashboard', { replace: true });
      })
      .catch(() => navigate('/login', { replace: true }));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
};

export default OAuth2CallbackPage;