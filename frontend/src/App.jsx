import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout'; 
import ReportIssue from './pages/ReportIssue';          
import DashboardPage from './pages/Dashboard';          
import LoginPage from './pages/LoginPage';              

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } 
        />

        <Route 
          path="/report-issue" 
          element={
            <DashboardLayout>
              <ReportIssue />
            </DashboardLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;