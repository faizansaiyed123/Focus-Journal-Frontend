import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../features/auth/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <header className="workspace-topbar">
      <div className="topbar-page-context">
        <span>YOUR SPACE</span>
        <strong>Welcome, {user?.full_name || user?.name || 'friend'}</strong>
      </div>
      <button
        className="topbar-logout"
        type="button"
        onClick={() => {
          logout();
          navigate('/login', { replace: true });
        }}
      >
        <LogOut size={16} />
        <span>Log out</span>
      </button>
    </header>
  );
}
