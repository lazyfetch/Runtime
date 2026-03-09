import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Spring OAuth2SuccessHandler redirects to /oauth2/callback?token=<jwt>
// We parse the token, decode the payload for display info, then store and navigate.
const parseJwt = (token: string): Record<string, string> => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
};

const OAuth2CallbackPage: React.FC = () => {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const payload = parseJwt(token);
    // JWT subject (sub) is the email; name may be a separate claim or derived
    const email = payload.sub ?? payload.email ?? '';
    const name = payload.name ?? email.split('@')[0] ?? 'User';

    setAuth({ email, name }, token);
    navigate('/dashboard', { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
};

export default OAuth2CallbackPage;