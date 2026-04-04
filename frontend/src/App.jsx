import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Admin Imports
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/Dashboard';
// Citizen Imports
import CitizenDashboardLayout from './layouts/CitizenDashboardLayout';
import CitizenDashboard from './pages/CitizenDashboard';
import LoginPage from './pages/LoginPage';

const App = () => {
  const repoName = "/panchayat-tourism-system"; 

  return (
    <BrowserRouter basename={repoName}>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Admin Route */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } 
        />

        {/* Citizen Route */}
        <Route 
          path="/citizen/report" 
          element={
            <CitizenDashboardLayout>
              <CitizenDashboard />
            </CitizenDashboardLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;