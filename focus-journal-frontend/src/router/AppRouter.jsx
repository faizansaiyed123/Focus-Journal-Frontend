import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Correct paths from src/App.jsx
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../pages/Dashboard";



import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Router>
          <Routes>
               <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default AppRouter

