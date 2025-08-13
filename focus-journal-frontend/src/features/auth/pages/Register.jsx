import { useState } from 'react';
import { registerAPI, loginAPI } from '../authAPI';
import { useNavigate } from 'react-router-dom';
import  useAuthStore from '../authStore';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaLinkedinIn, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../../assets/logo.png';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Register user
      await registerAPI({ email, password, confirm_password: cpassword, name });

      // Login user immediately after registration
      const loginData = await loginAPI({ email, password });

      // Update Zustand auth store with user and token from login response
      login({ user: loginData.user, token: loginData.token });

      // Redirect to dashboard after login
      navigate('/dashboard');
    } catch (err) {
      setError('Registration or login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Side (Logo) */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#f9fafb] p-12">
          <div className="w-full flex flex-col items-center justify-center max-w-[450px]">
            <img
              src={logo}
              alt="Focus Journal Logo"
              className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
            />
            <p className="mt-6 text-center text-sm text-gray-600 tracking-wide">
              Plan. Reflect. Improve.
            </p>
          </div>
        </div>

        {/* Right Side (Form) */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-8 sm:p-12 space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Create your account
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              required
            />
          </div>

          {/* Password field with show/hide */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password field with show/hide */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showCPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showCPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center mt-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-sm shadow-md"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center my-4">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <span className="border-t border-gray-300 w-full"></span>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <a
              href="https://focus-journal-backend.onrender.com/auth/github/login"
              className="flex items-center justify-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-sm shadow"
            >
              <FaGithub className="mr-2 text-xl" /> Continue with GitHub
            </a>
            <a
              href="http://ocus-journal-backend.onrender.com/auth/google/login"
              className="flex items-center justify-center border border-gray-300 bg-white text-gray-900 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-sm shadow"
            >
              <FcGoogle className="mr-2 text-xl" /> Continue with Google
            </a>
            <a
              href="http://ocus-journal-backend.onrender.com/auth/linkedin/login"
              className="flex items-center justify-center bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold text-sm shadow"
            >
              <FaLinkedinIn className="mr-2 text-xl" /> Continue with LinkedIn
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
