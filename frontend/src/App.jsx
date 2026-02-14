import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        </div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
