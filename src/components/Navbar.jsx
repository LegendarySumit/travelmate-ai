import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FaGlobeAmericas } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/destination', label: 'Destinations' },
    { path: '/weather', label: 'Weather' },
    { path: '/budget', label: 'Budget Planner' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white sticky top-0 z-50" style={{ 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: '#10b981' }}
            >
              <FaGlobeAmericas className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#0f172a' }}>
              TravelMate <span style={{ color: '#10b981' }}>AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm font-medium transition-colors group"
                style={{
                  color: isActive(link.path) ? '#065f46' : '#64748b'
                }}
              >
                <span className="group-hover:text-emerald-700">{link.label}</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 transition-all duration-300"
                  style={{
                    backgroundColor: '#10b981',
                    transform: isActive(link.path) ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left'
                  }}
                ></span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    backgroundColor: '#10b981',
                    transform: isActive(link.path) ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left'
                  }}
                ></span>
                {!isActive(link.path) && (
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                    style={{ backgroundColor: '#10b981' }}
                  ></span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/destination"
              className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-md transition-all transform hover:-translate-y-0.5"
              style={{ 
                backgroundColor: '#1b4332',
                color: 'white'
              }}
            >
              <span>Start planning</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            aria-label="Toggle menu"
            style={{ color: '#64748b' }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: '#e2e8f0' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive(link.path) ? '#d1fae5' : 'transparent',
                  color: isActive(link.path) ? '#065f46' : '#334155'
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link
                to="/destination"
                className="w-full px-5 py-2.5 rounded-full text-sm font-medium flex items-center justify-center space-x-2 shadow-md"
                style={{ 
                  backgroundColor: '#1b4332',
                  color: 'white'
                }}
              >
                <span>Start planning</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
