import { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import ReportIssue from './pages/ReportIssue';
import DashboardPage from './pages/Dashboard';

export default function App() {
  // Simple state routing for this demo
  const [currentPage, setCurrentPage] = useState('/report');

  return (
    <DashboardLayout activeRoute={currentPage}>
      {currentPage === '/' && <DashboardPage />}
      {currentPage === '/report' && <ReportIssue />}
    </DashboardLayout>
  );
}