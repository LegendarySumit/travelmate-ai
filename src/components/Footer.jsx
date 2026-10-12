import { Plane, Mail } from 'lucide-react';
import { FaInstagram, FaYoutube, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      reactIcon: FaGithub,
      href: "https://github.com",
      label: "GitHub"
    },
    {
      reactIcon: FaLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn"
    },
    {
      reactIcon: FaTwitter,
      href: "https://twitter.com",
      label: "Twitter"
    },
    {
      reactIcon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram"
    },
    {
      reactIcon: FaYoutube,
      href: "https://youtube.com",
      label: "YouTube"
    }
  ];

  const features = [
    { name: "Destination Explorer", href: "/destination" },
    { name: "Weather Planner", href: "/weather" },
    { name: "Budget Planner", href: "/budget" }
  ];

  const company = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" }
  ];

  return (
    <footer style={{ backgroundColor: '#0f172a' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-xl" style={{ backgroundColor: '#10b981' }}>
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TravelMate AI</span>
            </div>
            <p style={{ color: '#cbd5e1' }} className="max-w-sm leading-relaxed mb-6 text-sm">
              Your smart travel companion for exploring destinations, checking weather, and planning budgets with AI-powered insights.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.reactIcon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981'
                    }}
                    title={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-6" style={{ color: '#10b981' }}>
              Features
            </h3>
            <ul className="space-y-3">
              {features.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    className="text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: '#cbd5e1' }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-6" style={{ color: '#10b981' }}>
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    className="text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: '#cbd5e1' }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-6" style={{ color: '#10b981' }}>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: '#cbd5e1' }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: '#cbd5e1' }}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTopColor: '#1e293b' }} className="border-t pt-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Copyright */}
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            &copy; {currentYear} <span style={{ color: '#10b981' }} className="font-semibold">TravelMate AI</span>. Built for CX Design Project.
          </p>

          {/* Footer Note */}
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Made with <span style={{ color: '#10b981' }}>❤️</span> by the TravelMate Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
