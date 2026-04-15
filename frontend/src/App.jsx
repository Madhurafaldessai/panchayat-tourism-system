// @ts-nocheck
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SolvedIssues from './pages/SolvedIssues'; 

function App() {
  const isCitizen = () => !!localStorage.getItem('citizenName');
  const isAdmin = () => !!localStorage.getItem('adminId');

  return (
    // HashRouter is the most stable choice for GitHub Pages to avoid 404 errors on refresh
    <Router>
      <Routes>
        {/* Public Entry: Redirect only if a VALID session exists */}
        <Route 
          path="/" 
          element={
            isCitizen() ? <Navigate to="/CitizenDashboard" replace /> : 
            isAdmin() ? <Navigate to="/Dashboard" replace /> : 
            <LoginPage />
          } 
        />

        {/* Citizen Route: Strictly Guarded */}
        <Route 
          path="/CitizenDashboard" 
          element={isCitizen() ? <CitizenDashboard /> : <Navigate to="/" replace />} 
        />

        {/* Admin Routes: Strictly Guarded */}
        <Route 
          path="/Dashboard" 
          element={
            isAdmin() ? (
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route index element={<Dashboard />} /> 
          <Route path="heatmap" element={<Heatmap />} />
          <Route path="issues" element={<SolvedIssues />} />
        </Route>

        {/* Fallback: Catch-all redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;