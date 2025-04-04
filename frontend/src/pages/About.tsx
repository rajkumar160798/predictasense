import React from "react";
import Sidebar from "../components/Sidebar";
import backgroundImage from "../assets/machine-background.jpg";
import myPic from "../assets/my_pic.png";

const About: React.FC = () => {
  return (
    <div
      className="relative h-screen w-full overflow-y-auto flex flex-col items-center text-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", 
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",

      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0" />

      {/* Content */}
      <div className="z-10 max-w-10xl mx-auto bg-white bg-opacity-80 text-purple-800 p-12 rounded-2xl shadow-2xl overflow-y-auto  overflow-x-auto max-h-[90vh] space-y-10  mt-[5vh]">



        {/* Title */}
        <h1 className="text-5xl font-bold">About PredictAsense</h1>

        {/* Intro */}
        <p><strong>PredictAsense™</strong> is a smart AI-powered predictive maintenance platform designed to analyze sensor data, forecast equipment failures, and recommend preventive actions. It helps industries save costs, prevent downtime, and operate more efficiently using data-driven insights.</p>
        
        <p>
          Developed by <strong>Raj Kumar Myakala</strong>, this tool combines cutting-edge data science techniques with a beautiful, intuitive dashboard for visualizing trends, anomalies, and actionable insights.
        </p>

        <p className="text-lg text-left font-bold mb-6">PredictAsense stands apart from other tools by offering features like:</p>

        <ul className="list-disc text-left text-lg pl-6 mb-6">
          <li>📈 Real-time forecasting of temperature, pressure, and vibration</li>
          <li>🧠 AI-based anomaly detection with root cause analysis</li>
          <li>🚨 Smart alert prioritization to act before failures occur</li>
          <li>🤖 AutoML Forecasting & PDF reporting for business intelligence</li>
          <li>🔥 Interactive heatmaps and cluster visualizations</li>
        </ul>

        {/* Mission */}
        <p>
          Whether you're managing a factory floor or optimizing a mechanical system, <strong>PredictAsense</strong> empowers you to make proactive decisions using intelligent insights.
        </p>
        <p className="text-pink-600 font-medium">
          🎯 Mission: Bring accessible predictive maintenance to everyone, powered by open-source and innovation.
        </p>

        {/* Meet the Developer */}
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">👨‍💻 Meet the Developer</h2>
          <img
            src={myPic}
            alt="Raj Kumar Myakala"
            className="w-32 h-32 rounded-full font-bold  mx-auto border-4 border-purple-600 shadow-lg"
          />
          <p>Raj Kumar Myakala is a passionate developer and data enthusiast, committed to building AI solutions that solve real-world problems.</p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/rajkumar160798" target="_blank" rel="noreferrer" className="hover:text-black">🐙 GitHub</a>
            <a href="https://www.linkedin.com/in/raj-kumar-myakala-927860264/" target="_blank" rel="noreferrer" className="hover:text-blue-600">🔗 LinkedIn</a>
            <a href="https://medium.com/@myakalarajkumar1998" target="_blank" rel="noreferrer" className="hover:text-gray-700">✍️ Medium</a>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-10 space-y-2 text-left">
          <h2 className="text-2xl font-bold text-left">🗓️ Development Timeline</h2>
          <ul className="list-disc list-inside">
            <li>✅ <strong>Feb 2024</strong> – Idea inception</li>
            <li>🧪 <strong>Mar 2024</strong> – MVP with anomaly heatmaps</li>
            <li>📈 <strong>Apr 2024</strong> – Added AutoML + PDF reporting</li>
            <li>🚀 <strong>May 2024</strong> – Final Dashboard + Forecast Features</li>
          </ul>
        </div>

        {/* What's Next */}
        <div className="mt-10 space-y-2 text-left">
          <h2 className="text-2xl font-bold text-left">🔮 What’s Next?</h2>
          <ul className="list-disc list-inside">
            <li>🔗 Slack/Teams integration</li>
            <li>⚡ Real-time streaming sensor data</li>
            <li>📱 Mobile-friendly dashboard</li>
            <li>📡 Webhook/API triggers for external automation</li>
          </ul>
        </div>

        {/* Testimonials */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-left">💬 Testimonials</h2>
          <div className="mt-4 italic text-gray-700 text-left">
            “PredictAsense saved us 3 hours of weekly maintenance!”<br />
            – SmartTech Inc.
          </div>
        </div>
      </div>

      {/* Background layer for dim effect */}
      <img
        src={backgroundImage}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        style={{ filter: "brightness(0.4)" }}
      />
    </div>
  );
};

export default About;
