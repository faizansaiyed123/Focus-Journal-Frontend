import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode in localStorage
    const stored = localStorage.getItem('darkMode');
    return stored === 'true';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Add/remove the 'dark' class to <html> element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Top bar on mobile */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>

          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Sidebar">
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
