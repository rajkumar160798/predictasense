// src/components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Anomalies", path: "/anomalies" },
    { label: "Reports", path: "/reports" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-[#7E65E2] text-white p-6 h-screen">
      <h1 className="text-2xl font-bold mb-10">PredictAsense</h1>
      <nav className="space-y-4 text-lg">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`block ${
              pathname === item.path ? "font-bold" : ""
            } hover:text-black`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;