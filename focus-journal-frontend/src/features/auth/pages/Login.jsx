import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Leaf,
  LockKeyhole,
} from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { API_BASE_URL } from '../../../api/apiClient';
import { loginAPI, fetchCurrentUser } from '../authAPI';
import useAuthStore from '../authStore';

function getMessage(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(' ');
  return fallback;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginAPI({ email: email.trim(), password });
      const token = response.access_token || response.token;
      if (!token) throw new Error('The server did not return an access token.');
      window.localStorage.setItem('token', token);
      let user = null;
      try {
        user = await fetchCurrentUser();
      } catch {
        // Profile details are optional after a successful sign-in.
      }
      login({ user, token });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(
        getMessage(
          requestError,
          'We could not sign you in. Check your details and try again.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-art">
          <Link
            to="/"
            className="brand-lockup auth-brand"
          >
            <span className="brand-mark">
              <Leaf size={20} />
            </span>
            <span className="brand-name">
              focus<span>journal</span>
            </span>
          </Link>
          <div className="auth-art-copy">
            <span className="auth-art-eyebrow">
              <span /> A SPACE TO COME BACK TO YOURSELF
            </span>
            <h1>
              Find your
              <br />
              <em>own rhythm.</em>
            </h1>
            <p>
              Notice the little things. Make space for the important ones. Start
              where you are.
            </p>
          </div>
          <div className="auth-art-bottom">
            <span className="auth-art-stamp">
              <Leaf size={22} />
            </span>
            <span>
              <strong>Less pressure.</strong>
              <small>More presence.</small>
            </span>
          </div>
          <div className="auth-art-blob auth-blob-one" />
          <div className="auth-art-blob auth-blob-two" />
        </aside>

        <section className="auth-form-wrap">
          <Link
            to="/"
            className="auth-mobile-brand"
          >
            <span className="brand-mark">
              <Leaf size={18} />
            </span>
            <span className="brand-name">
              focus<span>journal</span>
            </span>
          </Link>
          <div className="auth-form-heading">
            <span className="section-eyebrow">WELCOME BACK</span>
            <h2>Good to see you.</h2>
            <p>Sign in and pick up where you left off.</p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div
                className="form-error"
                role="alert"
              >
                {error}
              </div>
            )}
            <label
              className="field-label"
              htmlFor="login-email"
            >
              Email address
            </label>
            <input
              className="text-field"
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <div className="field-label-row">
              <label
                className="field-label"
                htmlFor="login-password"
              >
                Password
              </label>
              <LockKeyhole size={14} />
            </div>
            <input
              className="text-field"
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing you in…' : 'Sign in to your space'}{' '}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-divider">
            <span /> <small>or continue with</small> <span />
          </div>
          <div className="auth-social-row">
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/google/login'}
              aria-label="Continue with Google"
            >
              <FcGoogle size={19} /> <span>Google</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/github/login'}
              aria-label="Continue with GitHub"
            >
              <FaGithub size={18} /> <span>GitHub</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/linkedin/login'}
              aria-label="Continue with LinkedIn"
            >
              <FaLinkedinIn size={18} /> <span>LinkedIn</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
          <p className="auth-switch-copy">
            New to Focus Journal?{' '}
            <Link to="/register">
              Create an account <ArrowRight size={14} />
            </Link>
          </p>
          <p className="auth-private-note">
            <Check size={13} /> Your journal is personal. Always has been.
          </p>
        </section>
      </div>
    </div>
  );
}
