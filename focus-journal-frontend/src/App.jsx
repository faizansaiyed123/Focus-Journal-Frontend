import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuthStore from './features/auth/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Login = lazy(() => import('./features/auth/pages/Login'));
const Register = lazy(() => import('./features/auth/pages/Register'));
const OAuthCallback = lazy(() => import('./features/auth/pages/OAuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CreateJournal = lazy(
  () => import('./features/journal/pages/CreateJournal'),
);
const JournalPage = lazy(() => import('./features/journal/pages/JournalPage'));
const JournalEntryDetail = lazy(
  () => import('./features/journal/pages/JournalEntryDetail'),
);
const EditJournal = lazy(() => import('./features/journal/pages/EditJournal'));
const CheckinDetail = lazy(
  () => import('./features/checkin/pages/CheckinDetail'),
);
const Checkins = lazy(() => import('./features/checkin/pages/Checkins'));
const CreateCheckin = lazy(
  () => import('./features/checkin/pages/CreateCheckin'),
);
const EditCheckin = lazy(() => import('./features/checkin/pages/EditCheckin'));
const JournalInsights = lazy(
  () => import('./features/journal/pages/JournalInsights'),
);
const Settings = lazy(() => import('./pages/Settings'));

function PrivatePage({ authenticated, children, withLayout = true }) {
  const content = withLayout ? (
    <DashboardLayout>{children}</DashboardLayout>
  ) : (
    children
  );
  return (
    <ProtectedRoute isAuthenticated={authenticated}>{content}</ProtectedRoute>
  );
}

function RouteLoading() {
  return (
    <main
      className="oauth-loading-page"
      role="status"
      aria-live="polite"
    >
      <div className="oauth-loading-card">
        <span
          className="brand-mark"
          aria-hidden="true"
        >
          fj
        </span>
        <p>Opening your space…</p>
        <span
          className="auth-loading-indicator"
          aria-label="Loading"
        />
      </div>
    </main>
  );
}

export default function App() {
  const token = useAuthStore((state) => state.token);
  const authenticated = Boolean(token);
  const privatePage = (element, withLayout = true) => (
    <PrivatePage
      authenticated={authenticated}
      withLayout={withLayout}
    >
      {element}
    </PrivatePage>
  );

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={
            authenticated ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            authenticated ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/auth/callback"
          element={<OAuthCallback />}
        />

        <Route
          path="/dashboard"
          element={privatePage(<Dashboard />)}
        />
        <Route
          path="/journal/create"
          element={privatePage(<CreateJournal />)}
        />
        <Route
          path="/journal"
          element={privatePage(<JournalPage />)}
        />
        <Route
          path="/journal/entry/:id"
          element={privatePage(<JournalEntryDetail />)}
        />
        <Route
          path="/journal/edit/:id"
          element={privatePage(<EditJournal />)}
        />
        <Route
          path="/analytics"
          element={privatePage(<Analytics />)}
        />
        <Route
          path="/settings"
          element={privatePage(<Settings />)}
        />
        <Route
          path="/checkin"
          element={privatePage(<Checkins />, false)}
        />
        <Route
          path="/checkins/new"
          element={privatePage(<CreateCheckin />)}
        />
        <Route
          path="/checkins/:id"
          element={privatePage(<CheckinDetail />)}
        />
        <Route
          path="/checkins/:id/edit"
          element={privatePage(<EditCheckin />)}
        />
        <Route
          path="/journal/insights"
          element={privatePage(<JournalInsights />)}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
}
