import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkedAlt, 
  FaCloudSun, 
  FaWallet, 
  FaSearch, 
  FaChartLine,
  FaLightbulb,
  FaArrowRight,
  FaPlay,
  FaPlane,
  FaHotel,
  FaUtensils,
  FaStar
} from 'react-icons/fa';
import { 
  WiDayCloudy, 
  WiThermometer 
} from 'react-icons/wi';
import { DottedFlightPath, CloudIllustration, AirplaneIcon } from '../components/Decorations';

const Home = () => {
  const [activeCard, setActiveCard] = useState(1);

  // Auto-cycle through cards every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => prev === 3 ? 1 : prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const destinations = [
    { 
      name: 'Bali', 
      country: 'Indonesia', 
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Santorini', 
      country: 'Greece', 
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Kyoto', 
      country: 'Japan', 
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Swiss Alps', 
      country: 'Switzerland', 
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Banff', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Dubrovnik', 
      country: 'Croatia', 
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80' 
    }
  ];

  const testimonials = [
    {
      quote: "TravelMate AI made my trip planning so much easier! The AI suggestions were really helpful.",
      name: "Priya S.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The budget planner and weather tips are a game changer. Highly recommended!",
      name: "Aman K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Clean interface, useful information, and great recommendations. Perfect for travelers!",
      name: "Neha R.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Mountain background"
            className="w-full h-full object-cover"
            style={{ opacity: 0.4 }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-white">
              <div 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase"
                style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <span>YOUR SMART TRAVEL COMPANION</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                Discover. Plan.<br />
                <span style={{ color: '#10b981' }}>Travel Smarter.</span>
              </h1>
              
              <p className="text-lg max-w-xl font-normal leading-relaxed" style={{ color: '#cbd5e1' }}>
                Explore destinations, check the weather, estimate your travel budget, and get AI-powered suggestions — all in one place.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/destination"
                  className="px-7 py-3.5 rounded-full font-medium flex items-center space-x-2 shadow-lg transition-transform transform hover:-translate-y-0.5"
                  style={{ 
                    backgroundColor: '#1b4332',
                    color: 'white'
                  }}
                >
                  <span>Start exploring</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
                
                <button 
                  className="px-6 py-3.5 rounded-full font-medium flex items-center space-x-2 shadow-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#0f172a'
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#10b981', color: 'white' }}
                  >
                    <FaPlay className="w-3 h-3" />
                  </div>
                  <span>Watch video</span>
                </button>
              </div>
              
              <div 
                className="grid grid-cols-3 gap-6 pt-8 max-w-lg"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>Destinations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Real-time</div>
                  <div className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>Weather data</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">AI Powered</div>
                  <div className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>Smart suggestions</div>
                </div>
              </div>
            </div>

            {/* Right Side - Floating Widgets */}
            <div className="lg:col-span-5 relative flex flex-col items-end justify-center space-y-6">
              {/* Weather Widget */}
              <div 
                className="p-4 rounded-2xl shadow-xl w-full max-w-sm border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <WiDayCloudy className="text-4xl" style={{ color: '#f59e0b' }} />
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#64748b' }}>Interlaken, Switzerland</div>
                      <div className="text-xl font-bold" style={{ color: '#0f172a' }}>18°C</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold" style={{ color: '#334155' }}>Partly cloudy</div>
                    <div className="text-xs" style={{ color: '#94a3b8' }}>Mon, 14 Oct</div>
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div 
                className="p-5 rounded-2xl shadow-2xl w-full max-w-md border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=100&q=80" 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded-xl object-cover shadow"
                    />
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#64748b' }}>Trip Budget</div>
                      <div className="text-xl font-bold" style={{ color: '#0f172a' }}>₹85,000</div>
                    </div>
                  </div>
                  <span 
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      borderColor: '#a7f3d0'
                    }}
                  >
                    estimated for 7 days
                  </span>
                </div>
                
                <div 
                  className="space-y-2 pt-2 text-sm"
                  style={{ borderTop: '1px solid #e2e8f0' }}
                >
                  <div className="flex justify-between items-center" style={{ color: '#64748b' }}>
                    <span className="flex items-center space-x-2">
                      <FaPlane /> <span>Flights</span>
                    </span>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>₹35,000</span>
                  </div>
                  <div className="flex justify-between items-center" style={{ color: '#64748b' }}>
                    <span className="flex items-center space-x-2">
                      <FaHotel /> <span>Accommodations</span>
                    </span>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>₹28,000</span>
                  </div>
                  <div className="flex justify-between items-center" style={{ color: '#64748b' }}>
                    <span className="flex items-center space-x-2">
                      <FaUtensils /> <span>Food</span>
                    </span>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>₹12,000</span>
                  </div>
                  <div className="flex justify-between items-center" style={{ color: '#64748b' }}>
                    <span className="flex items-center space-x-2">
                      <span>•••</span> <span>Other</span>
                    </span>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>₹10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative Dotted Flight Path - Top Right */}
        <div className="absolute top-10 right-16 hidden lg:block opacity-50">
          <DottedFlightPath />
          <span className="absolute top-12 right-2 text-xs font-semibold text-emerald-900 tracking-wide whitespace-nowrap">
            Plan better<br />Explore more
          </span>
        </div>

        {/* Decorative Cloud - Bottom Left */}
        <div className="absolute bottom-20 left-10 hidden lg:block opacity-30">
          <CloudIllustration className="w-24 h-16" color="#10b981" />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
          <span 
            className="inline-block font-semibold text-xs tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{ 
              color: '#065f46',
              backgroundColor: '#d1fae5',
              borderColor: '#a7f3d0'
            }}
          >
            OUR FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>
            Everything you need for a perfect trip
          </h2>
          <p style={{ color: '#64748b' }} className="text-base">
            Three powerful tools. One seamless travel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Feature 1 */}
          <div 
            className="bg-white rounded-2xl overflow-visible hover:shadow-xl transition-all duration-300 flex flex-col group"
            style={{ 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Image Container with Overlapping Icon */}
            <div className="h-48 overflow-visible relative">
              <img 
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80" 
                alt="Explore Destinations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
              />
              {/* Overlapping Icon */}
              <div 
                className="absolute -bottom-7 left-6 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg z-10"
                style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
              >
                <FaMapMarkedAlt className="text-2xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-12 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Explore Destinations</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748b' }}>
                  Discover detailed information about countries, cities, attractions and local culture.
                </p>
              </div>
              <Link 
                to="/destination"
                className="w-full flex items-center justify-center space-x-2 font-semibold text-sm px-4 py-2 rounded-lg"
                style={{ 
                  color: '#065f46',
                  backgroundColor: '#d1fae5'
                }}
              >
                <span>Explore Destinations</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            className="bg-white rounded-2xl overflow-visible hover:shadow-xl transition-all duration-300 flex flex-col group"
            style={{ 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Image Container with Overlapping Icon */}
            <div className="h-48 overflow-visible relative">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" 
                alt="Check the Weather"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
              />
              {/* Overlapping Icon */}
              <div 
                className="absolute -bottom-7 left-6 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg z-10"
                style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
              >
                <FaCloudSun className="text-2xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-12 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Check the Weather</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748b' }}>
                  Get real-time weather updates and smart packing suggestions for your destination.
                </p>
              </div>
              <Link 
                to="/weather"
                className="w-full flex items-center justify-center space-x-2 font-semibold text-sm px-4 py-2 rounded-lg"
                style={{ 
                  color: '#065f46',
                  backgroundColor: '#d1fae5'
                }}
              >
                <span>Explore Weather</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            className="bg-white rounded-2xl overflow-visible hover:shadow-xl transition-all duration-300 flex flex-col group"
            style={{ 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Image Container with Overlapping Icon */}
            <div className="h-48 overflow-visible relative">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80" 
                alt="Plan Your Budget"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
              />
              {/* Overlapping Icon */}
              <div 
                className="absolute -bottom-7 left-6 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg z-10"
                style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
              >
                <FaWallet className="text-2xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-12 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Plan Your Budget</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748b' }}>
                  Estimate your travel expenses, convert currencies, and get AI-powered budget tips.
                </p>
              </div>
              <Link 
                to="/budget"
                className="w-full flex items-center justify-center space-x-2 font-semibold text-sm px-4 py-2 rounded-lg"
                style={{ 
                  color: '#065f46',
                  backgroundColor: '#d1fae5'
                }}
              >
                <span>Explore Budget Planner</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-y" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span 
            className="font-semibold text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ 
              color: '#065f46',
              backgroundColor: 'rgba(209, 250, 229, 0.6)'
            }}
          >
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-16" style={{ color: '#0f172a' }}>
            Plan your trip in 3 simple steps
          </h2>
          
          <div className="relative">
            {/* Steps Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div 
                onMouseEnter={() => setActiveCard(1)}
                className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 relative flex flex-col justify-between ${
                  activeCard === 1 ? 'shadow-2xl scale-105' : 'shadow-sm hover:shadow-lg'
                }`}
                style={{ 
                  border: '1px solid #e2e8f0',
                  borderTop: activeCard === 1 ? '4px solid #10b981' : '4px solid #e2e8f0'
                }}
              >
                <div className="p-6">
                  {/* Top Row: Number and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md"
                      style={{ backgroundColor: '#1b4332', color: 'white' }}
                    >
                      1
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 shadow ${
                        activeCard === 1 ? 'scale-110' : 'scale-100'
                      }`}
                      style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                    >
                      <FaSearch />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 text-center" style={{ color: '#0f172a' }}>Explore</h3>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: '#64748b' }}>
                    Search for destinations and get detailed information.
                  </p>
                  
                  {/* Tags Container */}
                  <div className="flex flex-wrap gap-2 justify-center pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    {['Real-time Search', 'Maps', 'Culture'].map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: activeCard === 1 ? '#10b981' : '#d1fae5',
                          color: activeCard === 1 ? 'white' : '#065f46'
                        }}
                      >
                        ✓ {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                onMouseEnter={() => setActiveCard(2)}
                className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 relative flex flex-col justify-between ${
                  activeCard === 2 ? 'shadow-2xl scale-105' : 'shadow-sm hover:shadow-lg'
                }`}
                style={{ 
                  border: '1px solid #e2e8f0',
                  borderTop: activeCard === 2 ? '4px solid #10b981' : '4px solid #e2e8f0'
                }}
              >
                <div className="p-6">
                  {/* Top Row: Number and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md"
                      style={{ backgroundColor: '#1b4332', color: 'white' }}
                    >
                      2
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 shadow ${
                        activeCard === 2 ? 'scale-110' : 'scale-100'
                      }`}
                      style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                    >
                      <FaChartLine />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 text-center" style={{ color: '#0f172a' }}>Plan</h3>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: '#64748b' }}>
                    Check the weather and estimate your travel budget.
                  </p>
                  
                  {/* Tags Container */}
                  <div className="flex flex-wrap gap-2 justify-center pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    {['Weather', 'Budget', 'Scheduler'].map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: activeCard === 2 ? '#10b981' : '#d1fae5',
                          color: activeCard === 2 ? 'white' : '#065f46'
                        }}
                      >
                        ✓ {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                onMouseEnter={() => setActiveCard(3)}
                className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 relative flex flex-col justify-between ${
                  activeCard === 3 ? 'shadow-2xl scale-105' : 'shadow-sm hover:shadow-lg'
                }`}
                style={{ 
                  border: '1px solid #e2e8f0',
                  borderTop: activeCard === 3 ? '4px solid #10b981' : '4px solid #e2e8f0'
                }}
              >
                <div className="p-6">
                  {/* Top Row: Number and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md"
                      style={{ backgroundColor: '#1b4332', color: 'white' }}
                    >
                      3
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 shadow ${
                        activeCard === 3 ? 'scale-110' : 'scale-100'
                      }`}
                      style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                    >
                      <FaLightbulb />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 text-center" style={{ color: '#0f172a' }}>Get AI Suggestions</h3>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: '#64748b' }}>
                    Receive personalized travel tips and recommendations.
                  </p>
                  
                  {/* Tags Container */}
                  <div className="flex flex-wrap gap-2 justify-center pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    {['Smart Tips', 'Packing', 'Tuning'].map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: activeCard === 3 ? '#10b981' : '#d1fae5',
                          color: activeCard === 3 ? 'white' : '#065f46'
                        }}
                      >
                        ✓ {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Popular Destinations</h2>
            <p className="text-base mt-1" style={{ color: '#64748b' }}>Get inspired by these incredible places around the world.</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center space-x-2 font-semibold" style={{ color: '#065f46' }}>
            <span>View all</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
              style={{ 
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>{dest.name}</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>{dest.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#10b981', transform: 'translate(100px, -100px)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#10b981', transform: 'translate(-100px, 100px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span 
            className="font-semibold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full inline-block"
            style={{ 
              color: '#065f46',
              backgroundColor: '#d1fae5',
              border: '1px solid #a7f3d0'
            }}
          >
            ⭐ WHAT TRAVELERS SAY
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mt-6 mb-4" style={{ color: '#0f172a' }}>
            Loved by travel enthusiasts
          </h2>
          <p className="text-lg mb-16 max-w-2xl mx-auto" style={{ color: '#64748b' }}>
            See what real travelers think about TravelMate AI and how it transformed their journey planning experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-102 relative"
                style={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0'
                }}
              >
                {/* Top accent bar */}
                <div 
                  className="h-1"
                  style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
                />

                {/* Content container */}
                <div className="p-6 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed font-medium text-left flex-1 mb-4" style={{ color: '#334155' }}>
                    "{t.quote}"
                  </p>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />

                  {/* Author info */}
                  <div className="flex items-center space-x-3">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full object-cover shadow-sm" 
                    />
                    <div className="text-left">
                      <div className="font-semibold text-sm" style={{ color: '#0f172a' }}>{t.name}</div>
                      <div className="text-xs" style={{ color: '#10b981' }}>Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats below testimonials */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>50K+</div>
              <p className="text-xs" style={{ color: '#64748b' }}>Happy Travelers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>4.9/5</div>
              <p className="text-xs" style={{ color: '#64748b' }}>Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>180+</div>
              <p className="text-xs" style={{ color: '#64748b' }}>Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#0f172a' }}>
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80" 
              alt="Adventure background" 
              className="w-full h-full object-cover"
              style={{ opacity: 0.3 }}
            />
          </div>
          <div className="relative z-10 p-8 sm:p-16 max-w-2xl space-y-6 mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-base sm:text-lg" style={{ color: '#cbd5e1' }}>
              Start planning today and turn your travel dreams into reality.
            </p>
            <div className="flex justify-center pt-4">
              <Link 
                to="/destination"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-sm shadow-lg transition-transform transform hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: 'white',
                  color: '#0f172a'
                }}
              >
                <span>Get started now</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;