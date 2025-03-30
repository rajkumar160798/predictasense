import React from 'react';

const Dashboard: React.FC = () => {
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          console.log('File content:', content);
          // TODO: Process the CSV content here
        }
      };
      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-4 flex flex-col space-y-4">
        <h2 className="text-lg font-bold">PredictAsense</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#overview" className="block px-2 py-1 hover:bg-gray-700 rounded">Overview</a>
            </li>
            <li>
              <a href="#reports" className="block px-2 py-1 hover:bg-gray-700 rounded">Reports</a>
            </li>
            <li>
              <a href="#alerts" className="block px-2 py-1 hover:bg-gray-700 rounded">Alerts</a>
            </li>
            <li>
              <a href="#settings" className="block px-2 py-1 hover:bg-gray-700 rounded">Settings</a>
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

        {/* Main Area */}
        <main className="p-6 flex-1 bg-gray-50">
          <section id="overview">
            <h2 className="text-lg font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white shadow p-4 rounded">📊 Card 1</div>
              <div className="bg-white shadow p-4 rounded">📈 Card 2</div>
              <div className="bg-white shadow p-4 rounded">⚠️ Card 3</div>
            </div>
          </section>

          {/* Upload Section */}
          <section id="upload">
            <h2 className="text-lg font-semibold mb-2">Upload Sensor Data (CSV)</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="border border-gray-300 rounded p-2 mb-8"
            />
          </section>

          {/* Analysis Section */}
          <section id="analysis">
            <h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
            <div className="border p-4 rounded bg-white shadow-md">
              <p className="text-gray-600">Graphs and anomaly results will appear here.</p>
            </div>

            <div className="mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Export Anomalies
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
// This code defines a simple dashboard layout using React and Tailwind CSS.
// It includes a sidebar with navigation links, a header, and a main content area.
// The main content area has sections for overview, file upload, and analysis results.
// The file upload section allows users to upload a CSV file, and the content of the file is logged to the console.
// The analysis section is a placeholder for displaying graphs and results.
// The layout is responsive and uses Tailwind CSS classes for styling.
// The sidebar and header are styled with a dark theme, while the main content area has a light background.
// The dashboard is designed to be user-friendly and visually appealing, with a focus on functionality.
// The layout is flexible and can be easily extended with additional features and components as needed.
// The code is structured to separate concerns, making it easier to maintain and update in the future.
// The dashboard is a starting point for building a more complex application that can handle sensor data analysis and visualization.
// The file upload functionality is implemented using the FileReader API, allowing users to read the contents of the uploaded CSV file.
// The code is written in TypeScript, providing type safety and better development experience.
// The dashboard can be integrated with backend services to fetch and display real-time data.
// The layout is designed to be intuitive, with clear headings and sections for different functionalities.
// The dashboard can be further enhanced with additional features such as user authentication, data filtering, and more.