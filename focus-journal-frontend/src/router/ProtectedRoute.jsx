// src/router/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? children : <Navigate to="/login" />;
}
