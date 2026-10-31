import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import useAuthStore from '../authStore';
import { exchangeOAuthCode } from '../authAPI';

export default function OAuthCallback() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const requestPromise = useRef(null);
  const [message, setMessage] = useState('Verifying your sign-in…');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const legacyToken = params.get('access_token');
    const provider = params.get('provider') || 'your account';

    window.history.replaceState({}, document.title, window.location.pathname);

    if (!requestPromise.current) {
      requestPromise.current = (async () => {
        let token;
        if (code) {
          const response = await exchangeOAuthCode(code);
          token = response.access_token;
        } else if (legacyToken) {
          token = legacyToken;
        } else {
          throw new Error(
            'The sign-in callback did not contain an exchange code.',
          );
        }

        if (!token)
          throw new Error('The server did not return an access token.');
        const response = await apiClient.get('/auth/me', {
          headers: { Authorization: 'Bearer ' + token },
        });
        return { token, user: response.data };
      })();
    }

    requestPromise.current
      .then(({ token, user }) => {
        if (!active) return;
        login({ token, user });
        setMessage('You’re in. Opening your journal…');
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        if (!active) return;
        logout();
        setError(
          'We could not verify this ' +
            provider +
            ' sign-in. Please try again.',
        );
      });

    return () => {
      active = false;
    };
  }, [login, logout, navigate]);

  return (
    <main className="oauth-loading-page">
      <div className="oauth-loading-card">
        <span className="brand-mark">
          <Leaf size={21} />
        </span>
        <h1>{error ? 'Let’s try that again.' : 'Welcome back.'}</h1>
        <p>{error || message}</p>
        {!error && (
          <span
            className="auth-loading-indicator"
            aria-label="Loading"
          />
        )}
        {error && (
          <button
            className="button button-primary"
            type="button"
            onClick={() => navigate('/login', { replace: true })}
          >
            Back to sign in
          </button>
        )}
      </div>
    </main>
  );
}
