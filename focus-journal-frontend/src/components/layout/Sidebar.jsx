// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   FaTachometerAlt,
//   FaBook,
//   FaClipboardList,
//   FaChartLine,
//   FaRocket,
//   FaCog,
//   FaBrain,
//   FaChevronLeft,
//   FaChevronRight,
//   FaMoon,
//   FaSun,
// } from 'react-icons/fa';
// import logo from '../../assets/logo.png';
// const navItems = [
//   { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
//   { name: 'Journal', path: '/journal', icon: <FaBook /> },
//   { name: 'Check-ins', path: '/checkin', icon: <FaClipboardList /> },
//   { name: 'Goals', path: '/goals', icon: <FaRocket /> },
//   { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> },
//   // { name: 'Copilot', path: '/copilot', icon: <FaCog /> },
//   { name: 'Insights', path: '/journal/insights', icon: <FaBrain style={{ color: '#8b5cf6' }} /> },
// ];

// export default function Sidebar() {
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const [collapsed, setCollapsed] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   // Load from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem('theme');
//     setDarkMode(stored === 'dark');
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   return (
//     <aside className={`h-screen ${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-900 transition-width duration-300 border-r shadow-lg flex flex-col`}>
//       {/* Header */}
//       <div className="flex items-center justify-between px-3 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
//         {!collapsed && <h1 className="text-white font-bold text-lg">🧠 Focus Journal</h1>}
//         <button className="text-white" onClick={() => setCollapsed(!collapsed)}>
//           {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 mt-4">
//         {navItems.map((item) => (
//           <Tooltip key={item.name} label={collapsed ? item.name : null}>
//             <Link
//               to={item.path}
//               className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
//                 currentPath === item.path
//                   ? 'bg-indigo-500 text-white'
//                   : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
//               }`}
//             >
//               <span className="text-lg">{item.icon}</span>
//               {!collapsed && <span>{item.name}</span>}
//             </Link>
//           </Tooltip>
//         ))}
//       </nav>

//       {/* Footer: Dark Mode Toggle */}
//       <div className="p-4 flex items-center justify-center">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//         >
//           {darkMode ? <FaSun /> : <FaMoon />}
//         </button>
//       </div>
//     </aside>
//   );
// }

// // Tooltip component (Tailwind + shadcn style)
// function Tooltip({ label, children }) {
//   return (
//     <div className="relative group">
//       {children}
//       {label && (
//         <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
//           {label}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaChartLine,
  FaRocket,
  FaBrain,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
  { name: 'Journal', path: '/journal', icon: <FaBook /> },
  { name: 'Check-ins', path: '/checkin', icon: <FaClipboardList /> },
  { name: 'Goals', path: '/goals', icon: <FaRocket /> },
  { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> },
  { name: 'Insights', path: '/journal/insights', icon: <FaBrain style={{ color: '#8b5cf6' }} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen ${collapsed ? 'w-16' : 'w-64'} bg-white transition-width duration-300 border-r shadow-lg flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
        {!collapsed && <h1 className="text-white font-bold text-lg">🧠 Focus Journal</h1>}
        <button className="text-white" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <Tooltip key={item.name} label={collapsed ? item.name : null}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors cursor-pointer ${
                currentPath === item.path
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}

// Tooltip component (Tailwind + shadcn style)
function Tooltip({ label, children }) {
  return (
    <div className="relative group">
      {children}
      {label && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
          {label}
        </div>
      )}
    </div>
  );
}
