import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi'; // Correct imports for the Menu and Close icons
import { FaBrain } from 'react-icons/fa'; // Importing Brain icon from react-icons


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
            <FaBrain className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProvansIQ
            </span>
          

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className="nav-link">Home</Link>
            <a href="#features" className="nav-link">Features</a>
            <a href="#why-us" className="nav-link">Why Us</a>
            <a href="#metrics" className="nav-link">Metrics</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contact</a>
             */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}

            {/* <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl p-4 space-y-4"
          >
            <Link to="/" className="block nav-link">Home</Link>
            <a href="#features" className="block nav-link">Features</a>
            <a href="#why-us" className="block nav-link">Why Us</a>
            <a href="#metrics" className="block nav-link">Metrics</a>
            <a href="#testimonials" className="block nav-link">Testimonials</a>
            <a href="#contact" className="block nav-link">Contact</a>
            <Link
              to="/dashboard"
              className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}