import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Database, BarChart3, Brain } from 'lucide-react';

export default function IntroductionPage() {
  const navigate = useNavigate();

  const metrics = [
    {
      title: "Temperature",
      description: "Monitor thermal patterns to predict equipment overheating and prevent thermal stress failures",
      icon: "🌡️",
      details: [
        "Real-time temperature monitoring",
        "Thermal pattern analysis",
        "Overheating prediction",
        "Cooling system optimization"
      ]
    },
    {
      title: "Vibration",
      description: "Track vibration levels to detect mechanical imbalances and bearing wear before catastrophic failure",
      icon: "📳",
      details: [
        "Vibration frequency analysis",
        "Mechanical imbalance detection",
        "Bearing health monitoring",
        "Rotational equipment diagnostics"
      ]
    },
    {
      title: "Pressure",
      description: "Analyze pressure fluctuations to identify leaks and system inefficiencies in real-time",
      icon: "📊",
      details: [
        "Pressure trend analysis",
        "Leak detection algorithms",
        "System efficiency monitoring",
        "Flow rate optimization"
      ]
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms process your data to predict potential failures before they occur"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Monitoring",
      description: "24/7 monitoring of critical parameters with instant alerts for any anomalies detected"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Integration",
      description: "Seamless integration with your existing systems and data sources for comprehensive analysis"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Predictive Analytics",
      description: "Advanced statistical models to forecast equipment health and maintenance needs"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute left-4 top-4 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>

          <header className="mb-12 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400 mb-4"
            >
              Welcome to ProvansIQ
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 max-w-2xl mx-auto"
            >
              Your comprehensive predictive maintenance solution powered by advanced AI analytics
            </motion.p>
          </header>

          <main className="max-w-4xl mx-auto">
            {/* Features Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold text-zinc-200 mb-8">
                Why Choose ProvansIQ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-yellow-500">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-zinc-200">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-zinc-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Metrics Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold text-zinc-200 mb-8">
                Key Metrics We Monitor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all"
                  >
                    <div className="text-4xl mb-4">{metric.icon}</div>
                    <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                      {metric.title}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {metric.description}
                    </p>
                    <ul className="space-y-2">
                      {metric.details.map((detail, i) => (
                        <li key={i} className="text-zinc-400 flex items-center gap-2">
                          <span className="text-yellow-500">•</span> {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Demo Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-16"
            >
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-zinc-200 mb-4">
                  Ready to Experience the Future of Maintenance?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
                  Try our demo to see how ProvansIQ can transform your maintenance operations with AI-powered insights and predictive analytics.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-yellow-500/50"
                  >
                    Start Demo <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all flex items-center gap-2 font-semibold"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
} 