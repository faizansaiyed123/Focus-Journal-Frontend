import { useEffect, useState } from 'react';
import { Menu, X, LogOut, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import useAuthStore from '../features/auth/authStore';

const routeTitles = [
  ['/dashboard', 'Your dashboard'],
  ['/journal/create', 'New journal entry'],
  ['/journal/edit', 'Edit journal entry'],
  ['/journal/entry', 'Journal entry'],
  ['/journal/insights', 'Journal insights'],
  ['/journal', 'Your journal'],
  ['/checkins/new', 'Daily check-in'],
  ['/checkins/', 'Check-in details'],
  ['/checkin', 'Your check-ins'],
  ['/analytics', 'Your patterns'],
  ['/settings', 'Your settings'],
  ['/goals', 'Your goals'],
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const title = routeTitles.find(
    ([path]) =>
      location.pathname === path || location.pathname.startsWith(path + '/'),
  );
  const pageTitle = title ? title[1] : 'Your personal space';
  const displayName =
    user && (user.full_name || user.name)
      ? user.full_name || user.name
      : user && user.email
        ? user.email
        : 'Your space';
  const initials = displayName
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="workspace-shell">
      {mobileOpen && (
        <button
          className="workspace-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="workspace-main">
        <header className="workspace-topbar">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div className="topbar-page-context">
            <span>YOUR SPACE</span>
            <strong>{pageTitle}</strong>
          </div>
          <div className="topbar-user-area">
            <div
              className="topbar-user-avatar"
              aria-hidden="true"
            >
              {initials || <UserRound size={18} />}
            </div>
            <div className="topbar-user-copy">
              <strong>{displayName.split(' ')[0]}</strong>
              <span>Personal journal</span>
            </div>
            <button
              className="topbar-logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </header>
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
}
