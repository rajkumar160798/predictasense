import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-4 flex flex-col space-y-4">
        <h2 className="text-lg font-bold">PredictAsense</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#overview" className="block px-2 py-1 hover:bg-gray-700 rounded">
                Overview
              </a>
            </li>
            <li>
              <a href="#reports" className="block px-2 py-1 hover:bg-gray-700 rounded">
                Reports
              </a>
            </li>
            <li>
              <a href="#alerts" className="block px-2 py-1 hover:bg-gray-700 rounded">
                Alerts
              </a>
            </li>
            <li>
              <a href="#settings" className="block px-2 py-1 hover:bg-gray-700 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 p-4 shadow">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        {/* Main Content Area */}
        <main className="p-4 flex-1 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow p-4 rounded">Card 1</div>
            <div className="bg-white shadow p-4 rounded">Card 2</div>
            <div className="bg-white shadow p-4 rounded">Card 3</div>
          </div>
        </main>
      </div>
    </div>
    
  );
};
  
export default Dashboard;
