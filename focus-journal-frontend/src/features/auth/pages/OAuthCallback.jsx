import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import useAuthStore from '../authStore';

export default function OAuthCallback() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your sign-in…');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const callbackToken = params.get('access_token');
    const provider = params.get('provider') || 'your account';

    // Remove the compatibility token from the visible URL and browser history immediately.
    window.history.replaceState({}, document.title, '/auth/callback');
    if (callbackToken) window.localStorage.setItem('token', callbackToken);

    const token = callbackToken || window.localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return undefined;
    }

    apiClient.get('/auth/me', { headers: { Authorization: 'Bearer ' + token } })
      .then((response) => {
        if (cancelled) return;
        login({ token, user: response.data });
        setMessage('You’re in. Opening your journal…');
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        if (cancelled) return;
        window.localStorage.removeItem('token');
        setError('We could not verify this ' + provider + ' sign-in. Please try again.');
      });

    return () => { cancelled = true; };
  }, [login, navigate]);

  return (
    <main className="oauth-loading-page">
      <div className="oauth-loading-card">
        <span className="brand-mark"><Leaf size={21} /></span>
        <h1>{error ? 'Let’s try that again.' : 'Welcome back.'}</h1>
        <p>{error || message}</p>
        {!error && <span className="auth-loading-indicator" aria-label="Loading" />}
        {error && <button className="button button-primary" type="button" onClick={() => navigate('/login', { replace: true })}>Back to sign in</button>}
      </div>
    </main>
  );
}
