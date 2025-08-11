import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './features/auth/pages/OAuthCallback';
import NotFound from './pages/NotFound';
import useAuthStore from './features/auth/authStore';
import CreateJournal from '../src/features/journal/pages/CreateJournal';
import JournalPage from '../src/features/journal/pages/JournalPage';
import JournalEntryDetail from '../src/features/journal/pages/JournalEntryDetail';
import EditJournal from '../src/features/journal/pages/EditJournal';
import Analytics from './pages/Analytics';
import CheckinDetail from './features/checkin/pages/CheckinDetail';
import Checkins from './features/checkin/pages/Checkins';
import CreateCheckin from './features/checkin/pages/CreateCheckin';
import JournalInsights from './features/journal/pages/JournalInsights';
import EditCheckin from './features/checkin/pages/EditCheckin';
import Goals from './features/summary/pages/Goals';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = Boolean(token);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateJournal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <JournalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/entry/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <JournalEntryDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditJournal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Checkins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkins/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CheckinDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkins/new"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateCheckin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkins/:id/edit"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditCheckin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/insights"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <JournalInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Goals />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
