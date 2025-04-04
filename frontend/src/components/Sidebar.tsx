// src/components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    // { label: "Landing Page", path: "/" },
    { label: "Upload Page", path: "/upload" },
    { label: "Forecast Page", path: "/forecast" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      
{/* Hamburger + Menu Label - Positioned absolutely at top-left */}
<div className="fixed top-4 left-4 z-50 flex flex-col items-center">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="bg-white p-2 rounded-md shadow-md border-2 border-purple-400 hover:scale-105 transition"
  >
    <svg
      className="w-6 h-6 text-purple-700"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <span className="text-xs text-purple-900 mt-1 font-semibold"></span>
</div>


      {/* Sidebar Drawer with glass effect */}
      <div
        className={`fixed top-0 left-0 h-full w-64 backdrop-blur-md bg-white/70 text-purple-900 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 shadow-2xl border-r border-purple-500`}
      >
        <div className="p-6 pt-20 border-b border-purple-200 font-bold text-xl">PredictAsense</div>
        <nav className="flex flex-col gap-4 p-6 text-base">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded text-center hover:bg-purple-100 transition ${
                pathname === item.path ? "bg-purple-100 text-purple-800 font-semibold" : "text-purple-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
