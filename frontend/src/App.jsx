// @ts-nocheck
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
// 1. IMPORT the new SolvedIssues page
import SolvedIssues from './pages/SolvedIssues'; 

function App() {
  const isCitizen = () => !!localStorage.getItem('citizenName');
  const isAdmin = () => !!localStorage.getItem('adminId');

  return (
    <BrowserRouter basename="/panchayat-tourism-system">
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
          
          {/* 2. UPDATE this line to point to the real component */}
          <Route path="issues" element={<SolvedIssues />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;