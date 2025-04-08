import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/dashboard";
import Anomalies from "./pages/Anomalies";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload"; 
import Forecast from "./pages/Forecast"; 
import About from "./pages/About"; // Import the new About page
import LiveMonitor from "./pages/LiveMonitor";
import Rootcauses from "./pages/RootCauses";
import Actions from "./pages/actions";
import Alerts from "./pages/alerts";
import Health from "./pages/Health";
import RootCause from './pages/RootCause';
import SuggestedActions from './pages/SuggestedActions';
import StartupPage from './pages/StartupPage';
import IntroductionPage from './pages/IntroductionPage';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing and Authentication */}
          <Route path="/" element={<StartupPage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Main Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/anomalies" element={<Anomalies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />
          <Route path="/live-monitor" element={<LiveMonitor />} />
          <Route path="/root-causes" element={<Rootcauses />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/health" element={<Health />} />
          <Route path="/root-cause" element={<RootCause />} />
          <Route path="/suggested-actions" element={<SuggestedActions />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
