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
        <Route path="/about" element={<About/>} />
        <Route path="/live-monitor" element={<LiveMonitor />} />

        {/* 🔸 Pages with sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
