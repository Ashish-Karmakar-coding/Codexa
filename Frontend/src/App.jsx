import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewReviewPage from './pages/NewReviewPage';
import ResultPage from './pages/ResultPage';
import RepoScanPage from './pages/RepoScanPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL (from GitHub OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Verify token is still valid
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated && location.pathname !== '/login' && !location.pathname.startsWith('/auth/callback')) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {isAuthenticated && <Navbar />}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/review/new" element={<NewReviewPage />} />
              <Route path="/review/:id" element={<ResultPage />} />
              <Route path="/repo/scan" element={<RepoScanPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
