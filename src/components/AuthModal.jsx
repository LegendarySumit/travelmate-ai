import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signupWithEmail, loginWithEmail, loginWithGoogle } from '../services/auth';
import { initializeUserProfile } from '../services/firestore';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthModal({ isOpen, onClose, isSignUp, setIsSignUp }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Check password requirements
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const shouldShowRequirements = passwordFocused || password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate sign up fields
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (!allRequirementsMet) {
          setError('Password must have at least 8 characters, 1 uppercase letter, and 1 number');
          setPasswordFocused(true);
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Sign up
        const user = await signupWithEmail(email, password);
        
        // Update profile with name
        await updateProfile(user, {
          displayName: fullName,
        });

        // Initialize user document in Firestore
        await initializeUserProfile(user.uid, {
          email: user.email,
          displayName: fullName,
          photoURL: user.photoURL || '',
        });

        alert('Account created successfully! You can now log in.');
        setFullName('');
      } else {
        await loginWithEmail(email, password);
        alert('Logged in successfully!');
      }
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const user = await loginWithGoogle();
      
      // Initialize/update user document in Firestore for Google users
      await initializeUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
      });
      
      alert('Logged in with Google successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in flex flex-col max-h-[90vh]">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-2 rounded-lg text-sm">
              <p className="font-semibold">Error</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm"
                    required={isSignUp}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">This name will show in your profile</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(password.length === 0)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition text-sm"
                    required={isSignUp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-emerald-600 mt-1">✓ Passwords match</p>
                )}
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">✗ Passwords don't match</p>
                )}
              </div>
            )}

            {/* Password Requirements (Conditional - Show on typing or focus) */}
            {isSignUp && shouldShowRequirements && (
              <div className={`rounded-lg p-3 border ${allRequirementsMet ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                {allRequirementsMet ? (
                  <p className="text-xs font-semibold text-emerald-700">✓ Password is strong</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-amber-900 mb-2">Password Requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li className={passwordRequirements.length ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                        {passwordRequirements.length ? '✓' : '○'} At least 8 characters
                      </li>
                      <li className={passwordRequirements.uppercase ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                        {passwordRequirements.uppercase ? '✓' : '○'} One uppercase letter
                      </li>
                      <li className={passwordRequirements.number ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                        {passwordRequirements.number ? '✓' : '○'} One number
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 shadow-lg hover:shadow-xl text-sm"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 py-2.5 rounded-lg transition disabled:opacity-50 font-semibold text-slate-700 text-sm"
          >
            <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>

          {/* Toggle Sign Up / Login */}
          <p className="text-center text-xs text-slate-600 pt-2">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPasswordFocused(false);
              }}
              className="text-emerald-600 hover:text-emerald-700 font-bold transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
