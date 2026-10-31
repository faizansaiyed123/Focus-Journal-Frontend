import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
} from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { API_BASE_URL } from '../../../api/apiClient';
import { fetchCurrentUser, loginAPI, registerAPI } from '../authAPI';
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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Your passwords do not match yet.');
      return;
    }
    setLoading(true);
    try {
      await registerAPI({
        full_name: name.trim() || undefined,
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });
      const response = await loginAPI({ email: email.trim(), password });
      const token = response.access_token || response.token;
      if (!token)
        throw new Error(
          'Your account was created, but sign-in did not complete. Please log in.',
        );
      window.localStorage.setItem('token', token);
      let user = null;
      try {
        user = await fetchCurrentUser();
      } catch {}
      login({ user, token });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(
        getMessage(
          requestError,
          'We could not create your account. Please check the details and try again.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-register">
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
              <span /> YOUR SPACE STARTS HERE
            </span>
            <h1>
              A softer way
              <br />
              to <em>move forward.</em>
            </h1>
            <p>
              A few minutes of focus and reflection can change the way a day
              feels.
            </p>
          </div>
          <div className="auth-art-bottom">
            <span className="auth-art-stamp">
              <Leaf size={22} />
            </span>
            <span>
              <strong>One day at a time.</strong>
              <small>That is more than enough.</small>
            </span>
          </div>
          <div className="auth-art-blob auth-blob-one" />
          <div className="auth-art-blob auth-blob-two" />
        </aside>

        <section className="auth-form-wrap auth-register-wrap">
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
            <span className="section-eyebrow">A FRESH BEGINNING</span>
            <h2>Create your space.</h2>
            <p>Make it yours from day one.</p>
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
              htmlFor="register-name"
            >
              Your name <span className="field-optional">optional</span>
            </label>
            <input
              className="text-field"
              id="register-name"
              type="text"
              autoComplete="name"
              maxLength={255}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What should we call you?"
            />
            <label
              className="field-label"
              htmlFor="register-email"
            >
              Email address
            </label>
            <input
              className="text-field"
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <label
              className="field-label"
              htmlFor="register-password"
            >
              Create password
            </label>
            <div className="password-field-wrap">
              <input
                className="text-field"
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                className="password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <label
              className="field-label"
              htmlFor="register-confirm"
            >
              Confirm password
            </label>
            <div className="password-field-wrap">
              <input
                className="text-field"
                id="register-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter it once more"
                required
              />
              <button
                type="button"
                className="password-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <p className="password-hint">
              <LockKeyhole size={13} /> Use uppercase, lowercase, a number, and
              a special character.
            </p>
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating your space…' : 'Create my account'}{' '}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
          <div className="auth-divider">
            <span /> <small>or sign up with</small> <span />
          </div>
          <div className="auth-social-row">
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/google/login'}
              aria-label="Sign up with Google"
            >
              <FcGoogle size={19} /> <span>Google</span>
            </a>
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/github/login'}
              aria-label="Sign up with GitHub"
            >
              <FaGithub size={18} /> <span>GitHub</span>
            </a>
            <a
              className="social-signin"
              href={API_BASE_URL + '/auth/linkedin/login'}
              aria-label="Sign up with LinkedIn"
            >
              <FaLinkedinIn size={18} /> <span>LinkedIn</span>
            </a>
          </div>
          <p className="auth-switch-copy">
            Already have a space?{' '}
            <Link to="/login">
              Sign in <ArrowRight size={14} />
            </Link>
          </p>
          <p className="auth-private-note">
            <Check size={13} /> Your account belongs to you.
          </p>
        </section>
      </div>
    </div>
  );
}
