import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/dashboard";
import Anomalies from "./pages/Anomalies";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload"; 
import Forecast from "./pages/Forecast"; 
import About from "./pages/About"; // Import the new About page
import LiveMonitor from "./pages/LiveMonitor";
import Rootcauses from "./pages/RootCauses";
import Actions from "./pages/actions";
import Alerts from "./pages/alerts";
import Health from "./pages/Health";


function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Standalone pages without layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/live-monitor" element={<LiveMonitor />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/root-causes" element={<Rootcauses />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/health" element={<Health />} />

        {/* 🔹 Main layout with sidebar */}
      </Routes>
    </Router>
  );
}

export default App;
