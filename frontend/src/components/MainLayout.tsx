// // src/components/MainLayout.tsx
// import React, { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import logo from "../assets/logo.jpeg";

// const MainLayout: React.FC = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//     const root = document.documentElement;
//     root.classList.toggle("dark", !darkMode);
//   };

//   return (
//     <div className={`flex min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#7663d5] p-6 space-y-6 text-white sticky top-0 h-screen hidden md:block">
//         <div className="flex items-center space-x-2">
//           <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
//           <h1 className="text-xl font-bold">ProvansIQ</h1>
//         </div>
//         <nav className="flex flex-col space-y-4 mt-8">
//           <NavLink to="/dashboard" className="hover:font-semibold" end>Dashboard</NavLink>
//           <NavLink to="/anomalies" className="hover:font-semibold">Anomalies</NavLink>
//           <NavLink to="/reports" className="hover:font-semibold">Reports</NavLink>
//           <NavLink to="/settings" className="hover:font-semibold">Settings</NavLink>
//           <NavLink to="/upload" className="hover:font-semibold">Upload</NavLink>
//           <NavLink to="/forecast" className="hover:font-semibold">Forecast</NavLink>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto w-full">
//         <div className="flex justify-end">
//           <button onClick={toggleTheme} className="p-2 text-xl">
//             {darkMode ? "🌞" : "🌙"}
//           </button>
//         </div>

//         <Outlet /> {/* Where nested routes load */}
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import React from "react";
import { NavLink,Outlet } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-600 text-black p-4">
        <div className="flex items-center mb-6">
          <img src={logo} alt="logo" className="w-10 h-10 mr-2" />
          <span className="text-2xl font-bold">ProvansIQ</span>
        </div>
        <nav className="flex flex-col gap-4">
          <NavLink to="/dashboard" className="hover:font-semibold">Dashboard</NavLink>
          <NavLink to="/upload" className="hover:font-semibold">Upload</NavLink>
          <NavLink to="/forecast" className="hover:font-semibold">Forecast</NavLink>
          <NavLink to="/anomalies" className="hover:font-semibold">Anomalies</NavLink>
          <NavLink to="/reports" className="hover:font-semibold">Reports</NavLink>
          <NavLink to="/settings" className="hover:font-semibold">Settings</NavLink>
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet /> {/* 🟢 This is the key to rendering nested routes! */}
      </main>
    </div>
  );
};

export default MainLayout;

