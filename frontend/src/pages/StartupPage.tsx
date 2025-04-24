import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  BarChart3,
  Brain,
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import CountUp from "react-countup";
import { useTheme } from "../context/ThemeContext";
import { FaMedium } from "react-icons/fa";
import VideoModal from "./VideoModal";
import { useState as reactUseState } from "react";

export default function StartupPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showVideo, setShowVideo] = useState(false);

  // const pricingPlans = [
  //   {
  //     name: 'Starter',
  //     price: 0,
  //     features: [
  //       'Upload up to 1K rows/month',
  //       'Basic AI Forecasting',
  //       'Anomaly Detection',
  //       'PDF Report Export',
  //       'Email Support'
  //     ]
  //   },
  //   {
  //     name: 'Pro',
  //     price: 49,
  //     features: [
  //       'All Starter Features',
  //       'Root Cause Engine',
  //       'Suggested Actions',
  //       'Slack/Teams Alerts',
  //       'Basic API Access',
  //       'Up to 10K rows/month'
  //     ]
  //   },
  //   {
  //     name: 'Growth',
  //     price: 99,
  //     features: [
  //       'All Pro Features',
  //       'Firestore Sync & Auto Dashboard',
  //       'Custom Report Branding',
  //       'Advanced API Access',
  //       'Multi-user Team Support',
  //       'Up to 50K rows/month'
  //     ]
  //   },
  //   {
  //     name: 'Enterprise',
  //     price: 499,
  //     features: [
  //       'Custom AI Model Deployment',
  //       'Unlimited Machine Connections',
  //       'Dedicated Account Manager',
  //       'Full API + Webhook Integration',
  //       'On-Prem Deployment (Optional)',
  //       'White Labeling & SLA Support'
  //     ]
  //   }
  // ];

  // const testimonials = [
  //   {
  //     name: 'Sarah Johnson',
  //     role: 'CTO at TechCorp',
  //     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
  //     quote: 'ProvansIQ has transformed our maintenance operations. The AI predictions are incredibly accurate.',
  //     rating: 5
  //   },
  //   {
  //     name: 'Michael Chen',
  //     role: 'Operations Manager',
  //     image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
  //     quote: 'The real-time monitoring and alerts have helped us prevent multiple critical failures.',
  //     rating: 5
  //   },
  //   {
  //     name: 'Emily Rodriguez',
  //     role: 'Plant Director',
  //     image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
  //     quote: 'Outstanding support team and the platform is incredibly user-friendly. Highly recommended!',
  //     rating: 5
  //   }
  // ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.3)",
            }}
          />
          <div className="container mx-auto px-4 z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6 gradient-text"
            >
              AI-Powered Predictive Maintenance
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 text-gray-300"
            >
              Transform your maintenance strategy with cutting-edge AI
              technology
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <button
                onClick={() => navigate("/introduction")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-yellow-500/50"
              >
                GET STARTED <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-yellow-500/50"
              >
                Watch Demo
              </button>
            </motion.div>
          </div>
          <VideoModal show={showVideo} onClose={() => setShowVideo(false)} />
        </section>

        {/* Features Section */}
        <section id= "features" className="py-20 bg-background dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
              Our Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AutoML Forecasting",
                  desc: "Advanced machine learning models that adapt to your data",
                },
                {
                  icon: Zap,
                  title: "Anomaly Detection",
                  desc: "Real-time monitoring and instant alerts",
                },
                {
                  icon: BarChart3,
                  title: "Custom Dashboards",
                  desc: "Intuitive visualization of complex data",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 card-hover"
                >
                  <feature.icon className="w-12 h-12 mb-4 text-indigo-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: 99.5, suffix: "%", label: "Forecast Accuracy" },
                { value: 24, suffix: "/7", label: "Monitoring" },
                { value: 40, suffix: "%", label: "Downtime Reduction" },
                { value: 80, suffix: "%", label: "Cost Savings" },
                // { value: 90, suffix: '%', label: 'Anomaly Detection' }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold mb-2 gradient-text">
                    <CountUp end={metric.value} duration={2} />
                    {metric.suffix}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section
         <section className="py-20 bg-background dark:bg-gray-900  ">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-8 text-center card-hover"
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-6 gradient-text">
                    ${plan.price}
                    <span className="text-lg text-gray-500 dark:text-gray-400">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400">{feature}</li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigate('/introduction')}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Start Free Trial
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Learn More Section */}
        <section className="py-20 bg-background dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 gradient-text">
              Learn More About ProvansIQ
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Discover how ProvansIQ can transform your maintenance strategy
              with AI-powered insights.
            </p>
            <a
              href="https://drive.google.com/file/d/1UtQrhvjtenz9cAnDC8qddQzlrxYS3BFS/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-lg"
            >
              ProvansIQ Overview
            </a>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="py-20 bg-background dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
              We Value Your Feedback
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-8">
                <form
                  action="https://formspree.io/f/xnndqlwv"
                  method="POST"
                  className="space-y-6"
                >
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        
                      />
                    </div>
                  </div>

                  {/* Use Case */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Which feature did you use the most?
                    </label>
                    <select
                      name="use_case"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a use case</option>
                      <option value="forecasting">AutoML Forecasting</option>
                      <option value="anomaly">Anomaly Detection</option>
                      <option value="root-cause">Root Cause Engine</option>
                      <option value="alerts">Smart Alerts</option>
                      <option value="reporting">PDF Reporting</option>
                      <option value="dashboard">
                        Live Monitoring Dashboard
                      </option>
                    </select>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What did you find helpful?
                    </label>
                    <textarea
                      name="feedback"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tell us how ProvansIQ helped you or your team..."
                    />
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Suggestions for improvement
                    </label>
                    <textarea
                      name="suggestions"
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="What can we do better?"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rate your overall experience
                    </label>
                    <select
                      name="rating"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Choose a rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="2">⭐⭐ Needs Improvement</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>

                  {/* Consent */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="consent"
                      className="accent-indigo-600 h-5 w-5"
                      id="consent"
                    />
                    <label htmlFor="consent" className="text-sm">
                      I agree to let my feedback be featured on ProvansIQ’s
                      testimonials.
                    </label>
                  </div>

                  {/* Optional Subject for Formspree Email */}
                  <input
                    type="hidden"
                    name="_subject"
                    value="New Feedback from ProvansIQ User"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-300 py-12 dark:bg-gray-800 dark:text-white ">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">
                ProvansIQ
              </h3>
              <p className="text-black dark:text-zinc-50 ">
                Transforming maintenance with AI-powered predictions and
                real-time monitoring.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4  text-black dark:text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 text-black dark:text-white">
                <li>
                  <a
                    href="#features"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4  text-black dark:text-white">
                Contact Info
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2  text-black dark:text-white">
                  <MapPin className="w-4 h-4" />
                  Dallas, TX
                </li>
                <li className="flex items-center gap-2  text-black dark:text-white">
                  <Phone className="w-4 h-4" />
                  +1 (425) 504-9728
                </li>
                <li className="flex items-center gap-2  text-black dark:text-white">
                  <Mail className="w-4 h-4" />
                  myakalarajkumar1998@gmail.com
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4  text-black dark:text-white">
                Follow Me
              </h4>
              <div className="flex space-x-4  text-black dark:text-white">
                <a
                  href="https://medium.com/@myakalarajkumar1998"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <FaMedium className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/raj-kumar-myakala-927860264/"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/rajkumar160798/predictasense"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center dark:border-white text-black dark:text-white">
            <p>
              &copy; {new Date().getFullYear()} ProvansIQ. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <a
              href="https://www.linkedin.com/in/raj-kumar-myakala-927860264/"
              className="text-gray-500 hover:text-indigo-400 transition-colors text-sm dark:text-white dark:hover:text-indigo-400  "
            >
              Developed by Raj Kumar Myakala 
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 p-3 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
function useState<T>(
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return reactUseState(initialValue);
}
