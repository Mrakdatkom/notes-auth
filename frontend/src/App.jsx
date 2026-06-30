import React from 'react'
import { Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import CreateNotePage from './pages/CreateNotePage'
import NoteDetailPage from './pages/NoteDetailPage'
import toast from 'react-hot-toast'
import { Button } from './components/ui/button'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import { useAuth } from './context/AuthContext'

// A wrapper that redirects to /login page if the user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateNotePage /></ProtectedRoute>} />
        <Route path="/notes/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
