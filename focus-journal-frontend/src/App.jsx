import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import OAuthCallback from './features/auth/pages/OAuthCallback';
import NotFound from './pages/NotFound';
import useAuthStore from './features/auth/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import CreateJournal from './features/journal/pages/CreateJournal';
import JournalPage from './features/journal/pages/JournalPage';
import JournalEntryDetail from './features/journal/pages/JournalEntryDetail';
import EditJournal from './features/journal/pages/EditJournal';
import CheckinDetail from './features/checkin/pages/CheckinDetail';
import Checkins from './features/checkin/pages/Checkins';
import CreateCheckin from './features/checkin/pages/CreateCheckin';
import EditCheckin from './features/checkin/pages/EditCheckin';
import JournalInsights from './features/journal/pages/JournalInsights';

function PrivatePage({ authenticated, children, withLayout = true }) {
  const content = withLayout ? <DashboardLayout>{children}</DashboardLayout> : children;
  return <ProtectedRoute isAuthenticated={authenticated}>{content}</ProtectedRoute>;
}

export default function App() {
  const token = useAuthStore((state) => state.token);
  const authenticated = Boolean(token);
  const privatePage = (element, withLayout = true) => (
    <PrivatePage authenticated={authenticated} withLayout={withLayout}>{element}</PrivatePage>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={authenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={authenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      <Route path="/dashboard" element={privatePage(<Dashboard />)} />
      <Route path="/journal/create" element={privatePage(<CreateJournal />)} />
      <Route path="/journal" element={privatePage(<JournalPage />)} />
      <Route path="/journal/entry/:id" element={privatePage(<JournalEntryDetail />)} />
      <Route path="/journal/edit/:id" element={privatePage(<EditJournal />)} />
      <Route path="/analytics" element={privatePage(<Analytics />)} />
      <Route path="/checkin" element={privatePage(<Checkins />, false)} />
      <Route path="/checkins/new" element={privatePage(<CreateCheckin />)} />
      <Route path="/checkins/:id" element={privatePage(<CheckinDetail />, false)} />
      <Route path="/checkins/:id/edit" element={privatePage(<EditCheckin />)} />
      <Route path="/journal/insights" element={privatePage(<JournalInsights />)} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
