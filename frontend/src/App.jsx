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
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isCitizen() ? <Navigate to="/CitizenDashboard" replace /> : 
            isAdmin() ? <Navigate to="/dashboard" replace /> : 
            <LoginPage />
          } 
        />

        <Route 
          path="/CitizenDashboard" 
          element={isCitizen() ? <CitizenDashboard /> : <Navigate to="/" replace />} 
        />

        {/* Changed path to lowercase 'dashboard' to match LoginPage navigate call */}
        <Route 
          path="/dashboard" 
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;