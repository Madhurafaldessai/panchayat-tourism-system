// @ts-nocheck
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard'; // Ensure this exists in your pages folder

function App() {
  return (
    <BrowserRouter basename="/panchayat-tourism-system">
      <Routes>
        {/* 1. Public Entry Point (Login Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* 2. Citizen Flow: Redirected here after reporting */}
        <Route path="/CitizenDashboard" element={<CitizenDashboard />} />

        {/* 3. Admin Flow: Nested Routes under /dashboard */}
        <Route 
          path="/dashboard" 
          element={<DashboardLayout children={<Outlet />} />}
        >
          {/* Default view: /dashboard */}
          <Route index element={<Dashboard />} /> 
          
          {/* Heatmap view: /dashboard/heatmap */}
          <Route path="heatmap" element={<Heatmap />} />
          
          {/* Placeholder for future admin pages */}
          {/* <Route path="issues" element={<IssuesSolved />} /> */}
        </Route>

        {/* 4. Fallback: Redirect to Login if route doesn't exist */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;