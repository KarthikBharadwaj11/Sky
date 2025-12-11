'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    const success = await register(email, email, password); // Using email as username

    if (success) {
      router.push('/onboarding');
    } else {
      setError('Email already exists');
    }
    
    setLoading(false);
  };

  const handleSocialRegister = (provider: string) => {
    // Mock social registration - in production, integrate with actual OAuth providers
    alert(`${provider} registration would be integrated here with actual OAuth flow`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-48 pb-32 px-4 sm:px-6 lg:px-8 trading-background">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - App Branding */}
          <div className="text-center lg:text-left">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-7xl font-bold text-gradient gradient-shift">
                Sky
              </h1>
            </div>
            <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Start Your Trading Journey Today
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of successful traders and unlock powerful tools to grow your wealth with confidence.
            </p>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-primary)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Start with $0 - No minimum deposit required</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-primary)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Advanced trading tools and real-time data</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-primary)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Learn from expert traders in our community</span>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">X</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">X</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">X</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="card max-w-md mx-auto w-full">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Join Sky
              </h2>
              <p className="text-base mt-2" style={{ color: 'var(--text-tertiary)' }}>
                Create your account and unlock professional trading tools
              </p>
            </div>

            {/* Social Registration Options */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleSocialRegister('Google')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-medium bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <button
                onClick={() => handleSocialRegister('Twitter')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-medium bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Sign up with Twitter
              </button>

              <button
                onClick={() => handleSocialRegister('Apple')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-medium bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.025.044 8.016.053c-5.56.305-9.971 4.896-9.971 10.563C-1.955 16.503 2.033 21.5 7.29 21.5c1.101 0 2.648-.368 4.038-.999 1.343.631 2.907.999 4.038.999 5.236 0 9.26-4.997 9.26-10.864 0-5.667-4.411-10.258-9.971-10.563-.009-.009-.379-.053-2.638-.053zM8.5 20.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                </svg>
                Sign up with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--glass-border)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-base font-medium" style={{ background: 'var(--glass-bg)', color: 'var(--text-tertiary)' }}>
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="form-input"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="form-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="glass-morphism p-4 rounded-lg">
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="acceptTerms" className="ml-3 block text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    I agree to the{' '}
                    <a href="#" className="underline font-medium" style={{ color: 'var(--text-accent)' }}>
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="underline font-medium" style={{ color: 'var(--text-accent)' }}>
                      Privacy Policy
                    </a>
                    . I understand that Sky will use my information to provide trading services.
                  </label>
                </div>
              </div>

              {error && (
                <div className="glass-morphism p-4 rounded-lg border-2 border-red-500">
                  <p className="text-red-400 text-base font-medium text-center">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-lg glow-effect hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-shimmer w-6 h-6 rounded-full mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold hover:underline transition-all duration-200"
                  style={{ color: 'var(--text-accent)' }}
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Grid closing div */}
        </div>
      </div>
    </div>
  );
}