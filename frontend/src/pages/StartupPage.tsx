import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Database, BarChart3, Brain, Cpu, Star, Sun, Moon, Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import CountUp from 'react-countup';
import { useTheme } from '../context/ThemeContext';

export default function StartupPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const pricingPlans = [
    {
      name: 'Starter',
      price: 49,
      features: [
        'Basic AI Predictions',
        '5 Machine Connections',
        'Email Support',
        'Basic Analytics'
      ]
    },
    {
      name: 'Professional',
      price: 149,
      features: [
        'Advanced AI Models',
        '25 Machine Connections',
        '24/7 Priority Support',
        'Advanced Analytics',
        'Custom Dashboards'
      ]
    },
    {
      name: 'Enterprise',
      price: 499,
      features: [
        'Custom AI Solutions',
        'Unlimited Connections',
        'Dedicated Support Team',
        'Full API Access',
        'White Labeling',
        'Custom Integration'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      quote: 'ProvansIQ has transformed our maintenance operations. The AI predictions are incredibly accurate.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      quote: 'The real-time monitoring and alerts have helped us prevent multiple critical failures.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Plant Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      quote: 'Outstanding support team and the platform is incredibly user-friendly. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3)'
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
              Transform your maintenance strategy with cutting-edge AI technology
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <button 
                onClick={() => navigate('/upload')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
              >
                Try Demo
              </button>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105">
                Schedule Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Our Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Brain, title: 'AutoML Forecasting', desc: 'Advanced machine learning models that adapt to your data' },
                { icon: Zap, title: 'Anomaly Detection', desc: 'Real-time monitoring and instant alerts' },
                { icon: BarChart3, title: 'Custom Dashboards', desc: 'Intuitive visualization of complex data' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 card-hover"
                >
                  <feature.icon className="w-12 h-12 mb-4 text-indigo-500" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
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
                { value: 99.5, suffix: '%', label: 'Forecast Accuracy' },
                { value: 24, suffix: '/7', label: 'Monitoring' },
                { value: 40, suffix: '%', label: 'Downtime Reduction' },
                { value: 100, suffix: '+', label: 'Active Clients' }
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
                  <p className="text-gray-600 dark:text-gray-400">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-background">
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
                    onClick={() => navigate('/dashboard')}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Start Free Trial
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center card-hover"
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic mb-4">"{testimonial.quote}"</p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Get in Touch</h2>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">ProvansIQ</h3>
              <p className="text-gray-400">Transforming maintenance with AI-powered predictions and real-time monitoring.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-indigo-400 transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  123 AI Street, Tech City
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@provansiq.com
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} ProvansIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>

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