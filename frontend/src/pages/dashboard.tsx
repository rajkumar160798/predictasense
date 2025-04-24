// src/pages/Dashboard.tsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Bell, Search, BarChart, Upload, ArrowRight, Heart, PersonStanding, Sun, Moon,FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPage() {
  const [isUploaded] = useState(() => {
    // Check if there's sensor data in localStorage
    const sensorData = localStorage.getItem("sensorData");
    return sensorData !== null && JSON.parse(sensorData).length > 0;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const dashboardButtons = [
    { icon: Brain, label: 'AI Forecast Predictions', color: 'from-blue-400 to-indigo-600', route: '/forecast' },
    { icon: AlertTriangle, label: 'Anomaly Detection', color: 'from-red-400 to-pink-600', route: '/anomalies' },
    { icon: Bell, label: 'Root Causes Analysis', color: 'from-yellow-400 to-orange-600', route: '/root-causes' },
    { icon: Search, label: 'Suggested Actions', color: 'from-green-400 to-emerald-600', route: '/actions' },
    { icon: BarChart, label: 'Smart Alerts', color: 'from-purple-400 to-violet-600', route: '/alerts' },
    { icon: Heart, label: 'System Health', color: 'from-red-400 to-orange-600', route: '/Health' },
    { icon: Upload, label: 'Upload New Data', color: 'from-pink-400 to-red-600', route: '/upload' },
    { icon: PersonStanding, label: 'About', color: 'from-purple-500 to-pink-400', route: '/about' },
    {
      icon: FileDown,
      label: 'Generate PDF',
      color: 'from-blue-500 to-indigo-600',
      onClick: () => import('../utils/pdfGenerator').then(mod => mod.generateFullDashboardPDF()),
    },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    // Handle the files here (e.g., upload or process them)
    console.log('Files received:', files);
    // Redirect to upload page for file handling
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 px-4 py-2 bg-white text-gray-700 dark:bg-gray-900 dark:text-white rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to ProvansIQ Dashboard
          </h1>
          <p className="text-gray-600 dark:text-white">
            {!isUploaded ? 'Please upload your data to get started' : 'Explore our AI-powered predictive maintenance features'}
          </p>
        </header>

        <main>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-8 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center"
            >
              Redirecting to upload page...
            </motion.div>
          )}

          {!isUploaded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  transition-all duration-300 ease-in-out
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="p-8 rounded-lg bg-white border border-gray-100  dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Upload Your Data</h2>
                  <p className="text-gray-600 mb-6">
                    Drag and drop your files here, or click to select
                  </p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    Upload Data <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardButtons.map((button, index) => {
                const getColorClasses = (type: string) => {
                  switch (type) {
                    case 'AI Forecast Predictions':
                      return 'hover:shadow-blue-500/70';
                    case 'Anomaly Detection':
                      return 'hover:shadow-red-500/70';
                    case 'Root Causes Analysis':
                      return 'hover:shadow-yellow-500/70';
                    case 'Suggested Actions':
                      return 'hover:shadow-green-500/70';
                    case 'Smart Alerts':
                      return 'hover:shadow-purple-500/70';
                    case 'System Health':
                      return 'hover:shadow-pink-500/70';
                    case 'Upload New Data':
                      return 'hover:shadow-blue-500/70';
                    default:
                      return 'hover:shadow-gray-500/70';
                  }
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={button.onClick ? button.onClick : () => navigate(button.route)}
                    className={`
                      group relative overflow-hidden
                      p-6 rounded-xl cursor-pointer
                      bg-white border border-gray-200
                      dark:bg-gray-800 dark:border-gray-700
                      hover:border-gray-300
                      transform hover:scale-[1.02] transition-all duration-300
                      shadow-sm hover:shadow-xl ${getColorClasses(button.label)}
                    `}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 text-gray-700 dark:text-white transform group-hover:scale-110 transition-transform duration-300">
                        <button.icon className="w-full h-full" />
                      </div>
                      <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                        {button.label}
                      </h2>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-100 pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              {/* <Upload className="w-6 h-6 text-blue-500" /> */}
              <span className="text-gray-900 dark:text-white font-semibold hover:text-blue-500 dark:hover:text-blue-400    ">ProvansIQ</span>
            </div>
            <p className="text-gray-600  dark:text-white font-semibold hover:text-blue-500 dark:hover:text-blue-400 text-sm text-center">
              Empowering Industry 4.0 with Advanced Predictive Maintenance
            </p>
            <div className="mt-4 flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Contact</a>
            </div>
            <p className="mt-6 text-gray-500 text-sm">
              © 2025 ProvansIQ. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 p-3 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}
