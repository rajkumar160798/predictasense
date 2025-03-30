// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Moon } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-purple-600 text-white p-6 h-screen">
      <h2 className="text-2xl font-bold mb-8">PredictAsense</h2>
      <nav className="flex flex-col space-y-4 text-lg">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "font-bold" : ""}>Dashboard</NavLink>
        <NavLink to="/anomalies" className={({ isActive }) => isActive ? "font-bold" : ""}>Anomalies</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "font-bold" : ""}>Reports</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "font-bold" : ""}>Settings</NavLink>
      </nav>
      <div className="absolute top-6 right-6">
        <Moon className="cursor-pointer" />
      </div>
    </aside>
  );
};

export default Sidebar;