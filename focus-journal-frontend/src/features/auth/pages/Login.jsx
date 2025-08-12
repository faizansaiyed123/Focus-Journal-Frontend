import { useState } from 'react';
import { loginAPI } from '../authAPI';
import useAuthStore from '../authStore';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import logo from '../../../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    console.log('Submitting login with:', { email, password });
    const data = await loginAPI({ email, password });
    console.log('Login API response:', data);

    // Use 'access_token' instead of 'token'
    if (!data.access_token) {
      throw new Error('Token not found in response');
    }

    localStorage.setItem('token', data.access_token);
    login({ user: data.user || null, token: data.access_token }); // user may be missing, so fallback to null

    setLoading(false);
    navigate('/dashboard');  // Redirect after successful login
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    setError('Invalid email or password. Please try again.');
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img
            src={logo}
            alt="Focus Journal Logo"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right Side (Form) */}
        <form
          onSubmit={handleSubmit}
          className={`w-full md:w-1/2 p-8 sm:p-10 space-y-6 transition-opacity duration-300 ${
            loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Sign in to your account
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition disabled:bg-blue-400 text-sm"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center my-4">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <span className="border-t border-gray-300 w-full"></span>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-4 mt-6">
            <a
              href="https://focus-journal-backend.onrender.com/auth/github/login"
              className="group relative w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg shadow-md transition-shadow duration-300"
            >
              <FaGithub className="mr-3 text-2xl transition-transform group-hover:scale-110" />
              <span className="font-semibold text-base">Continue with GitHub</span>
            </a>

            <a
              href="https://focus-journal-backend.onrender.com/auth/google/login"
              className="group relative w-full flex items-center justify-center border border-gray-300 hover:border-gray-400 bg-white text-gray-900 py-3 rounded-lg shadow-sm transition-shadow duration-300"
            >
              <FcGoogle className="mr-3 text-2xl transition-transform group-hover:scale-110" />
              <span className="font-semibold text-base">Continue with Google</span>
            </a>

            <a
              href="https://focus-journal-backend.onrender.com/auth/linkedin/login"
              className="group relative w-full flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition-shadow duration-300"
            >
              <FaLinkedinIn className="mr-3 text-2xl transition-transform group-hover:scale-110" />
              <span className="font-semibold text-base">Continue with LinkedIn</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
