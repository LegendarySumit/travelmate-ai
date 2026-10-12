// By Sasanka Sekhar Malla

import React, { useState, useEffect } from 'react';
import { 
  Compass, Search, ArrowRight, Sparkles, RefreshCw, Calculator, 
  PieChart, DollarSign, Calendar, MapPin, Eye, Edit3, Trash2, 
  ArrowLeftRight, Check, ShieldCheck, Play, Save, RotateCcw, X,
  Hotel, UtensilsCrossed, Car, Camera, MoreHorizontal, ChevronDown
} from 'lucide-react';
import { onAuthStateChange, getCurrentUser } from '../services/auth';
import { 
  saveBudget, 
  getUserBudgets, 
  updateBudget, 
  deleteBudget 
} from '../services/firestore';
import { fetchExchangeRate, fetchBudgetEstimates } from '../services/api';
import { CURRENCY_LIST } from '../config/currencies';
import { POPULAR_DESTINATIONS, getCurrencyForDestination, getAllDestinations } from '../config/destinations';
import { validateNumber, validateCurrencyCode } from '../utils/validation';

const INITIAL_EXPENSES = {
  accommodation: { perDay: 80, total: 560 },
  food: { perDay: 40, total: 280 },
  transport: { perDay: 20, total: 140 },
  activities: { perDay: 25, total: 175 },
  other: { perDay: 15, total: 105 },
};

export default function BudgetPlanner() {
  const [destination, setDestination] = useState('Italy');
  const [currency, setCurrency] = useState('EUR');
  const [duration, setDuration] = useState(7);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load saved budgets from Firestore
  const [savedBudgets, setSavedBudgets] = useState([]);

  // Fetch and set budget estimates from AI
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState(null);

  // Auto-set currency when destination changes
  const handleDestinationChange = (newDestination) => {
    setDestination(newDestination);
    const newCurrency = getCurrencyForDestination(newDestination);
    setCurrency(newCurrency);
    // Fetch budget estimates for the new destination
    fetchBudgetEstimatesForDestination(newDestination, newCurrency);
  };

  const [converterFromCurrency, setConverterFromCurrency] = useState('INR');
  const [converterToCurrency, setConverterToCurrency] = useState('EUR');
  const [converterFromAmount, setConverterFromAmount] = useState(10000);
  const [converterRate, setConverterRate] = useState(0.01065);
  const [convertedAmount, setConvertedAmount] = useState((10000 * 0.01065).toFixed(2));
  const [exchangeRateTimestamp, setExchangeRateTimestamp] = useState('');
  const [exchangeRateError, setExchangeRateError] = useState(null);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [showFromCurrencyDropdown, setShowFromCurrencyDropdown] = useState(false);
  const [showToCurrencyDropdown, setShowToCurrencyDropdown] = useState(false);

  // Fetch budget estimates from AI for country-specific costs
  const fetchBudgetEstimatesForDestination = async (dest, curr) => {
    setBudgetLoading(true);
    setBudgetError(null);
    try {
      const estimates = await fetchBudgetEstimates(dest, curr);
      if (estimates && estimates.estimates) {
        // Use "midrange" as default realistic estimate
        const e = estimates.estimates;
        const newExpenses = {
          accommodation: { perDay: Math.round(e.accommodation.midrange), total: Math.round(e.accommodation.midrange * duration) },
          food: { perDay: Math.round(e.food.midrange), total: Math.round(e.food.midrange * duration) },
          transport: { perDay: Math.round(e.transport.midrange), total: Math.round(e.transport.midrange * duration) },
          activities: { perDay: Math.round(e.activities.midrange), total: Math.round(e.activities.midrange * duration) },
          other: { perDay: Math.round(e.other.midrange), total: Math.round(e.other.midrange * duration) },
        };
        setExpenses(newExpenses);
      }
    } catch (error) {
      console.error('Error fetching budget estimates:', error);
      setBudgetError('Could not fetch AI estimates, using defaults. You can adjust them manually.');
    } finally {
      setBudgetLoading(false);
    }
  };

  // Load initial budget estimates when component mounts
  useEffect(() => {
    fetchBudgetEstimatesForDestination(destination, currency);
  }, []);

  // Monitor auth state and load budgets
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const budgets = await getUserBudgets(currentUser.uid);
          setSavedBudgets(budgets);
        } catch (error) {
          console.error('Error loading budgets:', error);
        }
      } else {
        setSavedBudgets([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Reverse currency conversion
  const handleReverseCurrency = () => {
    setConverterFromCurrency(converterToCurrency);
    setConverterToCurrency(converterFromCurrency);
  };

  // Fetch real-time exchange rates from backend API
  useEffect(() => {
    const fetchExchangeRateData = async () => {
      try {
        // Validate currency codes
        const fromValidation = validateCurrencyCode(converterFromCurrency);
        const toValidation = validateCurrencyCode(converterToCurrency);
        
        if (!fromValidation.valid || !toValidation.valid) {
          setExchangeRateError('Invalid currency codes');
          return;
        }

        // Call backend API proxy (which calls open.er-api.com)
        const rateData = await fetchExchangeRate(fromValidation.value, toValidation.value);
        
        setConverterRate(rateData.rate);
        setConvertedAmount((converterFromAmount * rateData.rate).toFixed(2));
        setExchangeRateError(null);
        
        // Update timestamp
        const now = new Date();
        setExchangeRateTimestamp(now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRateError('Failed to fetch exchange rates. Using last known rate.');
      }
    };
    
    fetchExchangeRateData();
  }, [converterFromCurrency, converterToCurrency]);

  // Update converted amount when input changes
  useEffect(() => {
    setConvertedAmount((converterFromAmount * converterRate).toFixed(2));
  }, [converterFromAmount, converterRate]);

  // Handle per day input change
  const handleExpenseChange = (key, value) => {
    const num = Math.max(0, Number(value) || 0);
    setExpenses(prev => ({
      ...prev,
      [key]: { perDay: num, total: num * duration }
    }));
  };

  // Update totals when duration changes
  const handleDurationChange = (e) => {
    const newDur = Math.max(1, Number(e.target.value) || 1);
    setDuration(newDur);
    setExpenses(prev => {
      const updated = {};
      Object.keys(prev).forEach(k => {
        updated[k] = { perDay: prev[k].perDay, total: prev[k].perDay * newDur };
      });
      return updated;
    });
  };

  const calculateTotalCost = () => {
    return Object.values(expenses).reduce((acc, curr) => acc + curr.total, 0);
  };

  const totalCost = calculateTotalCost();
  const perDayCost = Math.round(totalCost / duration);

  const percentages = {
    accommodation: Math.round((expenses.accommodation.total / (totalCost || 1)) * 100),
    food: Math.round((expenses.food.total / (totalCost || 1)) * 100),
    transport: Math.round((expenses.transport.total / (totalCost || 1)) * 100),
    activities: Math.round((expenses.activities.total / (totalCost || 1)) * 100),
    other: Math.round((expenses.other.total / (totalCost || 1)) * 100),
  };

  const handleReset = () => {
    setExpenses(INITIAL_EXPENSES);
    setDuration(7);
  };

  const handleDeleteBudget = async (id) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      if (!user) {
        alert('Please sign in to delete budgets');
        return;
      }
      try {
        await deleteBudget(user.uid, id);
        setSavedBudgets(prev => prev.filter(b => b.id !== id));
        if (editingBudgetId === id) {
          setEditingBudgetId(null);
        }
        alert('Budget deleted successfully!');
      } catch (error) {
        alert('Error deleting budget: ' + error.message);
      }
    }
  };

  // Save a new budget (or update existing)
  const handleSaveBudget = async () => {
    if (!user) {
      alert('Please sign in to save budgets');
      return;
    }

    const budgetToSave = {
      destination: destination,
      currency: currency,
      duration: duration,
      expenses: expenses,
      cost: `${CURRENCY_LIST[currency]?.symbol}${calculateTotalCost()}`,
      dates: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    try {
      if (editingBudgetId) {
        // Update existing budget
        await updateBudget(user.uid, editingBudgetId, budgetToSave);
        setSavedBudgets(prev => prev.map(b => b.id === editingBudgetId ? { id: editingBudgetId, ...budgetToSave } : b));
        alert('Budget updated successfully!');
        setEditingBudgetId(null);
      } else {
        // Add new budget
        const budgetId = await saveBudget(user.uid, budgetToSave);
        setSavedBudgets(prev => [{ id: budgetId, ...budgetToSave }, ...prev]);
        alert('Budget saved successfully!');
      }
    } catch (error) {
      alert('Error saving budget: ' + error.message);
    }
  };

  // Load a saved budget into the calculator
  const handleLoadBudget = (budget) => {
    setDestination(budget.destination);
    setCurrency(budget.currency);
    setDuration(budget.duration);
    setExpenses(budget.expenses);
    setEditingBudgetId(budget.id);
    // Scroll to calculator
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* HERO BANNER - Matching Destination Explorer & Weather Planner */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 px-4 sm:px-8 lg:px-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1600" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto z-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800 mb-4 shadow-sm">
            Budget Planner
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 max-w-3xl">
            Plan your trip, <br />
            <span className="text-emerald-400">stay within budget.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-8">
            Estimate travel expenses, convert currencies, and get AI-powered budget tips for a smarter and stress-free journey.
          </p>

          {/* Search Bar */}
          <form className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl max-w-3xl w-full">
            <div className="flex items-center pl-3 w-full sm:w-auto flex-grow text-slate-400">
              <Search className="w-5 h-5 mr-2 shrink-0" />
              <input 
                type="text"
                placeholder="Search for a destination..."
                className="w-full py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Plan Budget</span>
            </button>
          </form>

          {/* Popular Destinations Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Popular destinations:</span>
            {POPULAR_DESTINATIONS.slice(0, 12).map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleDestinationChange(dest.name)}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-full border border-slate-700 transition-all"
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trip Budget Calculator Left Box */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Trip Budget Calculator</h2>
                  <p className="text-xs text-slate-500">Enter your estimated expenses and get a complete breakdown.</p>
                </div>
              </div>
              {editingBudgetId && (
                <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3" />
                  Editing Mode
                </div>
              )}
            </div>

            {/* Inputs: Destination, Currency, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Destination</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm">🌍</span>
                  <select 
                    value={destination} 
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-8 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {getAllDestinations().map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(CURRENCY_LIST).map((code) => (
                    <option key={code} value={code}>
                      {code} ({CURRENCY_LIST[code]?.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Trip duration (days)</label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1" 
                    max="90"
                    value={duration}
                    onChange={handleDurationChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Expense breakdown table */}
            <div className="space-y-4">
              {/* AI Budget Estimates Status */}
              {budgetLoading && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-emerald-600 animate-spin"></div>
                  <span className="text-sm font-medium text-emerald-700">Analyzing {destination} prices...</span>
                </div>
              )}
              {budgetError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">{budgetError}</span>
                </div>
              )}


              <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">
                <div className="col-span-6">Category</div>
                <div className="col-span-3 text-right">Per day</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {[
                { key: 'accommodation', label: 'Accommodation', icon: Hotel },
                { key: 'food', label: 'Food & Drinks', icon: UtensilsCrossed },
                { key: 'transport', label: 'Transportation', icon: Car },
                { key: 'activities', label: 'Activities & Sightseeing', icon: Camera },
                { key: 'other', label: 'Other Expenses', icon: MoreHorizontal },
              ].map(item => (
                <div key={item.key} className="grid grid-cols-12 items-center gap-2 py-2 border-b border-slate-100/60">
                  <div className="col-span-6 flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <div className="col-span-3">
                    <div className="relative flex items-center">
                      <input 
                        type="number" 
                        value={expenses[item.key].perDay}
                        onChange={(e) => handleExpenseChange(item.key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-8 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 font-medium pointer-events-none">{CURRENCY_LIST[currency]?.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right font-bold text-slate-900 text-sm">
                    {CURRENCY_LIST[currency]?.symbol}{expenses[item.key].total}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100 flex-wrap">
              <button 
                onClick={handleSaveBudget}
                className={`font-semibold px-6 py-3 rounded-xl shadow-md text-sm transition flex items-center gap-2 ${
                  editingBudgetId 
                    ? 'bg-blue-800 hover:bg-blue-900 text-white shadow-blue-800/20'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/20'
                }`}
              >
                {editingBudgetId ? (
                  <>
                    <Check className="w-4 h-4" />
                    Update Budget
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Budget
                  </>
                )}
              </button>
              <button 
                onClick={handleReset}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              {editingBudgetId && (
                <button 
                  onClick={() => {
                    setEditingBudgetId(null);
                    setExpenses(INITIAL_EXPENSES);
                    setDestination('Italy');
                    setCurrency('EUR');
                    setDuration(7);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Budget Summary & Currency Converter */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Budget Summary Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Budget Summary</h3>
                  <p className="text-xs text-slate-500">Estimated cost for your trip to {destination}</p>
                </div>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 my-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Total Estimated Cost</p>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{CURRENCY_LIST[currency]?.symbol}{totalCost.toLocaleString()}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">({CURRENCY_LIST[currency]?.symbol}{perDayCost} per day for {duration} days)</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Donut Chart Simulation with SVG & Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-6">
                <div className="sm:col-span-6 flex justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      {/* Accommodation */}
                      <path className="text-emerald-700" strokeDasharray={`${percentages.accommodation}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      {/* Food */}
                      <path className="text-blue-500" strokeDasharray={`${percentages.food}, 100`} strokeDashoffset={`-${percentages.accommodation}`} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-slate-400 block">Total</span>
                      <span className="text-sm font-black text-slate-800">{CURRENCY_LIST[currency]?.symbol}{totalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6 space-y-2 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> Accommodation</span>
                    <span className="font-bold text-slate-800">{percentages.accommodation}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Food & Drinks</span>
                    <span className="font-bold text-slate-800">{percentages.food}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Transportation</span>
                    <span className="font-bold text-slate-800">{percentages.transport}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Activities</span>
                    <span className="font-bold text-slate-800">{percentages.activities}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Other</span>
                    <span className="font-bold text-slate-800">{percentages.other}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Converter Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Currency Converter</h3>
                  <p className="text-xs text-slate-500">Convert and compare currency values in real time.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center mt-4">
                {/* From Currency Dropdown */}
                <div className="sm:col-span-5 relative">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">From</label>
                  <button
                    onClick={() => setShowFromCurrencyDropdown(!showFromCurrencyDropdown)}
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 hover:border-slate-400 transition"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://flagsapi.com/${CURRENCY_LIST[converterFromCurrency]?.code}/flat/32.png`}
                        alt={converterFromCurrency}
                        onError={(e) => e.target.style.display = 'none'}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-700">{converterFromCurrency}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {/* From Currency Dropdown List */}
                  {showFromCurrencyDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {Object.keys(CURRENCY_LIST).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setConverterFromCurrency(curr);
                            setShowFromCurrencyDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition text-left"
                        >
                          <img 
                            src={`https://flagsapi.com/${CURRENCY_LIST[curr]?.code}/flat/32.png`}
                            alt={curr}
                            onError={(e) => e.target.style.display = 'none'}
                            className="w-5 h-5 rounded"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-700">{curr}</span>
                            <span className="text-[11px] text-slate-500 ml-1">{CURRENCY_LIST[curr]?.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reverse Button */}
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    onClick={handleReverseCurrency}
                    className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm hover:bg-emerald-200 transition mt-5"
                    title="Reverse currencies"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* To Currency Dropdown */}
                <div className="sm:col-span-5 relative">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">To</label>
                  <button
                    onClick={() => setShowToCurrencyDropdown(!showToCurrencyDropdown)}
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 hover:border-slate-400 transition"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://flagsapi.com/${CURRENCY_LIST[converterToCurrency]?.code}/flat/32.png`}
                        alt={converterToCurrency}
                        onError={(e) => e.target.style.display = 'none'}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-700">{converterToCurrency}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {/* To Currency Dropdown List */}
                  {showToCurrencyDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {Object.keys(CURRENCY_LIST).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setConverterToCurrency(curr);
                            setShowToCurrencyDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition text-left"
                        >
                          <img 
                            src={`https://flagsapi.com/${CURRENCY_LIST[curr]?.code}/flat/32.png`}
                            alt={curr}
                            onError={(e) => e.target.style.display = 'none'}
                            className="w-5 h-5 rounded"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-700">{curr}</span>
                            <span className="text-[11px] text-slate-500 ml-1">{CURRENCY_LIST[curr]?.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input 
                  type="number" 
                  value={converterFromAmount}
                  onChange={(e) => setConverterFromAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 flex items-center">
                  {convertedAmount}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3">
                1 {converterFromCurrency} = {converterRate.toFixed(5)} {converterToCurrency} <span className="text-slate-500 font-medium">(Updated: {exchangeRateTimestamp || 'Loading...'})</span>
              </p>
            </div>

          </div>

        </div>

        {/* AI Budget Tips & Daily Cost Estimate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AI Budget Tips Box */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">AI Budget Tips</h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  Powered by Groq
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Here are some personalized budget tips for your trip to <span className="font-semibold text-slate-800">{destination}</span>:
              </p>

              <div className="space-y-3.5">
                {[
                  `Book accommodation in ${destination} well in advance for the best rates.`,
                  `Use public transportation in ${destination} to save on travel costs.`,
                  `Look for local restaurants instead of tourist-oriented establishments.`,
                  `Consider purchasing travel passes or city cards for attractions in ${destination}.`,
                  `Travel during off-peak seasons to get better deals and avoid crowds.`,
                  `Carry a reusable water bottle and refill it from public fountains to save money.`
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Cost Estimate Bar Chart */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Daily Cost Estimate</h3>
                  <p className="text-xs text-slate-500">Your estimated daily expenses for {duration} days</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>

              {/* Stacked Bar Chart - Dynamic based on expenses */}
              <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-200">
                {Array.from({ length: duration }).map((_, dayIndex) => {
                  // Vary expenses slightly per day for realism (±20%)
                  const variance = 0.8 + Math.random() * 0.4;
                  const accHeight = Math.max(10, expenses.accommodation.perDay * variance / 2);
                  const foodHeight = Math.max(8, expenses.food.perDay * variance / 2);
                  const transHeight = Math.max(5, expenses.transport.perDay * variance / 2);
                  const actHeight = Math.max(8, expenses.activities.perDay * variance / 2);
                  const othHeight = Math.max(3, expenses.other.perDay * variance / 2);

                  return (
                    <div key={dayIndex} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex flex-col justify-end rounded-t-lg overflow-hidden space-y-0.5 max-w-[36px]">
                        <div className="bg-rose-400 w-full" style={{ height: `${othHeight}px` }}></div>
                        <div className="bg-purple-500 w-full" style={{ height: `${actHeight}px` }}></div>
                        <div className="bg-amber-400 w-full" style={{ height: `${transHeight}px` }}></div>
                        <div className="bg-blue-500 w-full" style={{ height: `${foodHeight}px` }}></div>
                        <div className="bg-emerald-700 w-full" style={{ height: `${accHeight}px` }}></div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 mt-2">Day {dayIndex + 1}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> Accommodation (₹{expenses.accommodation.perDay})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Food & Drinks (₹{expenses.food.perDay})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Transport (₹{expenses.transport.perDay})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Activities (₹{expenses.activities.perDay})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Other (₹{expenses.other.perDay})</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sample Budgets for Popular Destinations */}
        <section className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Sample Budgets for Popular Destinations</h3>
              <p className="text-xs text-slate-500">Get an idea of average daily costs for different destinations.</p>
            </div>
            <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <div 
                key={idx}
                onClick={() => setDestination(dest.name)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div className="h-32 overflow-hidden relative">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-3 text-white font-bold text-sm">{dest.name}</span>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">Click to plan</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">Budget Calculator</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Saved Budgets */}
        <section className="pt-4 pb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Saved Budgets</h3>
              <p className="text-xs text-slate-500">View and manage your saved trip budgets.</p>
            </div>
            <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Dates</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6">Estimated Cost</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {savedBudgets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">No saved budgets found.</td>
                    </tr>
                  ) : (
                    savedBudgets.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2.5">
                          <span className="text-base">{b.flag}</span>
                          <span>{b.destination}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-xs">{b.dates}</td>
                        <td className="py-4 px-6 text-slate-600 text-xs">{b.duration} days</td>
                        <td className="py-4 px-6 font-bold text-emerald-700">{b.cost}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <button 
                              title="Load" 
                              onClick={() => handleLoadBudget(b)}
                              className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              title="Edit" 
                              onClick={() => handleLoadBudget(b)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              title="Delete" 
                              onClick={() => handleDeleteBudget(b.id)} 
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
