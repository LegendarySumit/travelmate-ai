import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { FaGlobeAmericas } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { onAuthStateChange, logout } from '../services/auth';
import AuthModal from './AuthModal';
import LoginPromptModal from './LoginPromptModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState('');
  const location = useLocation();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      alert('Logged out successfully');
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  const handleProtectedTabClick = (e, tabName, path) => {
    if (!user) {
      e.preventDefault();
      setSelectedTabName(tabName);
      setIsLoginPromptOpen(true);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', protected: false },
    { path: '/destination', label: 'Destinations', protected: true },
    { path: '/weather', label: 'Weather', protected: true },
    { path: '/budget', label: 'Budget Planner', protected: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
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
                onClick={(e) => link.protected && handleProtectedTabClick(e, link.label, link.path)}
                className="relative text-sm font-medium transition-colors group"
                style={{
                  color: isActive(link.path) ? '#065f46' : '#64748b',
                  cursor: link.protected && !user ? 'pointer' : 'default'
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-900">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-full flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2.5 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-md transition-all transform hover:-translate-y-0.5"
                  style={{ 
                    backgroundColor: '#1b4332',
                    color: 'white'
                  }}
                >
                  <span>Sign Up</span>
                </button>
              </>
            )}
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
                onClick={(e) => {
                  link.protected && handleProtectedTabClick(e, link.label, link.path);
                  setIsMenuOpen(false);
                }}
                className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive(link.path) ? '#d1fae5' : 'transparent',
                  color: isActive(link.path) ? '#065f46' : '#334155'
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-4 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">
                      {user.displayName || user.email.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-medium"
                    style={{ 
                      backgroundColor: '#1b4332',
                      color: 'white'
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Auth Modal */}
    <AuthModal 
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      isSignUp={isSignUp}
      setIsSignUp={setIsSignUp}
    />

    {/* Login Prompt Modal */}
    <LoginPromptModal 
      isOpen={isLoginPromptOpen}
      onClose={() => setIsLoginPromptOpen(false)}
      onSignUp={() => {
        setIsLoginPromptOpen(false);
        setIsSignUp(true);
        setIsAuthModalOpen(true);
      }}
      tabName={selectedTabName}
    />
    </>
  );
};

export default Navbar;
