// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Removed Sidebar */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
