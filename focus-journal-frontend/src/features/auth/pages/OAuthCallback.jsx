import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../authStore';

export default function OAuthCallback() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState("oauth");

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const providerParam = params.get('provider');
      setProvider(providerParam || "oauth");

      // 1. Save token
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/login');
      }

      try {
        const resp = await fetch("https://focus-journal-backend.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (resp.status === 401) {
          localStorage.removeItem('token');
          return navigate('/login');
        }

        if (!resp.ok) {
          throw new Error(`Error: HTTP ${resp.status} - ${resp.statusText}`);
        }

        const user = await resp.json();

        login({ token, user });

        navigate('/dashboard');
      } catch (err) {
        if (err.message.includes('HTTP')) {
          setError(`Failed to fetch user info. Server returned: ${err.message}`);
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      }
    })();
  }, [login, navigate]);

  return (
    <div className="text-center mt-10 text-lg text-gray-700">
      Logging you in via {provider}...
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
