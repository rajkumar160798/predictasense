// src/pages/About.tsx
import React from "react";
import backgroundImage from "../assets/machine-background.jpg";
import myPic from "../assets/my_pic_2.png";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 top-0 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ProvansIQ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ProvansIQ™ is a smart AI-powered predictive maintenance platform designed to analyze sensor data, forecast equipment failures, and recommend preventive actions.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10 max-w-4xl mx-auto"
        >
          <section className="bg-white rounded-xl shadow-lg p-8">
            <p>
              Developed by <strong>Raj Kumar Myakala</strong>, this tool combines cutting-edge data science techniques with a beautiful, intuitive dashboard for visualizing trends, anomalies, and actionable insights.
            </p>

            <ul className="list-disc text-left text-lg pl-6 mt-4">
              <li>📈 Real-time forecasting of temperature, pressure, and vibration</li>
              <li>🧠 AI-based anomaly detection with root cause analysis</li>
              <li>🚨 Smart alert prioritization to act before failures occur</li>
              <li>🤖 AutoML Forecasting & PDF reporting for business intelligence</li>
              <li>🔥 Interactive heatmaps and cluster visualizations</li>
            </ul>

            <p className="mt-6">
              Whether you're managing a factory floor or optimizing a mechanical system, <strong>ProvansIQ</strong> empowers you to make proactive decisions using intelligent insights.
            </p>
            <p className="text-pink-600 font-medium mt-2">
              🎯 Mission: Bring accessible predictive maintenance to everyone, powered by open-source and innovation.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">👨‍💻 Meet the Developer</h2>
            <img src={myPic} alt="Raj Kumar Myakala" className="w-32 h-32 rounded-full mx-auto border-4 border-purple-600 shadow-lg" />
            <p className="mt-4">Raj Kumar Myakala is a passionate developer and data enthusiast, committed to building AI solutions that solve real-world problems.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="https://github.com/rajkumar160798" target="_blank" rel="noreferrer" className="hover:text-black">🐙 GitHub</a>
              <a href="https://www.linkedin.com/in/raj-kumar-myakala-927860264/" target="_blank" rel="noreferrer" className="hover:text-blue-600">🔗 LinkedIn</a>
              <a href="https://medium.com/@myakalarajkumar1998" target="_blank" rel="noreferrer" className="hover:text-gray-700">✍️ Medium</a>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">🗓️ Development Timeline</h2>
            <ul className="list-disc list-inside">
              <li>✅ <strong>Feb 2025</strong> – Idea inception</li>
              <li>🧪 <strong>Mar 2025</strong> – MVP with anomaly heatmaps</li>
              <li>📈 <strong>Apr 2025</strong> – Added AutoML + PDF reporting</li>
              <li>🚀 <strong>May 2025</strong> – Final Dashboard + Forecast Features</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">🔮 What’s Next?</h2>
            <ul className="list-disc list-inside">
              <li>🔗 Slack/Teams integration</li>
              <li>⚡ Real-time streaming sensor data</li>
              <li>📱 Mobile-friendly dashboard</li>
              <li>📡 Webhook/API triggers for external automation</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">💬 Testimonials</h2>
            <p className="italic text-gray-700">“ProvansIQ saved us 3 hours of weekly maintenance!”<br />– SmartTech Inc.</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
