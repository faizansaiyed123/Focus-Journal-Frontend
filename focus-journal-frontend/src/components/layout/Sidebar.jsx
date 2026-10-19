import { BookOpen, ChartNoAxesColumn, ClipboardCheck, Focus, Leaf, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: Focus, exact: true },
  { name: 'My journal', path: '/journal', icon: BookOpen },
  { name: 'Daily check-ins', path: '/checkin', icon: ClipboardCheck },
  { name: 'My patterns', path: '/analytics', icon: ChartNoAxesColumn },
];

export default function Sidebar({ mobileOpen = false, onNavigate = () => {} }) {
  const location = useLocation();

  return (
    <aside className={'workspace-sidebar' + (mobileOpen ? ' sidebar-mobile-open' : '')}>
      <Link className="sidebar-brand" to="/dashboard" onClick={onNavigate}>
        <span className="sidebar-brand-icon"><Leaf size={21} strokeWidth={2.2} /></span>
        <span className="sidebar-brand-name">focus<span>journal</span></span>
      </Link>

      <div className="sidebar-overline">YOUR WORKSPACE</div>
      <nav className="sidebar-navigation" aria-label="Your workspace">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/') ||
              (item.path === '/journal' && location.pathname.startsWith('/journal/entry')) ||
              (item.path === '/checkin' && location.pathname.startsWith('/checkins'));
          return (
            <Link className={'sidebar-nav-item' + (selected ? ' sidebar-nav-active' : '')} to={item.path} key={item.path} onClick={onNavigate}>
              <span className="sidebar-nav-icon"><Icon size={19} strokeWidth={selected ? 2.2 : 1.8} /></span>
              <span>{item.name}</span>
              {selected && <span className="sidebar-nav-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />
      <div className="sidebar-note">
        <span className="sidebar-note-icon"><Sparkles size={17} /></span>
        <strong>Small steps count.</strong>
        <p>You don't need a perfect day to make progress.</p>
      </div>
      <div className="sidebar-privacy"><span className="privacy-dot" /> A space for your eyes only</div>
    </aside>
  );
}
