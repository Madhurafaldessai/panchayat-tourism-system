// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SolvedIssues from './pages/SolvedIssues';

function App() {
  const [isCitizen, setIsCitizen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsCitizen(!!localStorage.getItem('citizenName'));
    setIsAdmin(!!localStorage.getItem('adminId'));
  }, []);

  return (
    <Router>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/"
          element={
            isCitizen ? <Navigate to="/CitizenDashboard" replace /> :
            isAdmin ? <Navigate to="/dashboard" replace /> :
            <LoginPage setIsAdmin={setIsAdmin} setIsCitizen={setIsCitizen} />
          }
        />

        {/* CITIZEN */}
        <Route
          path="/CitizenDashboard"
          element={
            isCitizen
              ? <CitizenDashboard />
              : <Navigate to="/" replace />
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            isAdmin ? (
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
