import React from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';

export default function LoginPromptModal({ isOpen, onClose, onSignUp, tabName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-200">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign In Required</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-slate-700 font-medium">
              Access to <span className="text-emerald-600 font-bold">"{tabName}"</span>
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              You need to sign in to access this feature. Create an account or log in to your existing account to explore destinations, check weather, and plan your budget.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">After signing in, you can:</p>
            <ul className="space-y-1 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span>Explore destinations worldwide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span>Check weather forecasts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span>Plan your trip budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span>Save all your data in the cloud</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onSignUp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <span>Sign Up Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full border border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-3 rounded-lg transition"
            >
              Not Now
            </button>
          </div>

          {/* Footer text */}
          <p className="text-xs text-slate-500 text-center">
            Already have an account? Click "Sign Up" and choose "Sign In" on the modal.
          </p>
        </div>
      </div>
    </div>
  );
}
