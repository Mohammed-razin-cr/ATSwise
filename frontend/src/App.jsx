import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { AUTHOR_NAME, BRAND_NAME } from './brand';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public Route Wrapper (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const titles = {
      '/': 'ATSwise | AI Resume Analyzer & ATS Optimization',
      '/login': 'Sign In | ATSwise',
      '/signup': 'Create Your Account | ATSwise',
      '/dashboard': 'Dashboard | ATSwise',
      '/upload': 'Analyze Your Resume | ATSwise',
    };
    document.title = titles[location.pathname] || 'ATSwise | Resume Analysis';
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="main-content"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            
            <Route path="/results/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <footer className="app-footer">
        <p>
          <span>{BRAND_NAME} © 2026 - AI-Powered Resume Optimization</span>
          <span className="footer-credit">Created by <strong>{AUTHOR_NAME}</strong></span>
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
