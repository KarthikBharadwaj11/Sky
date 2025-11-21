'use client';

import { useState } from 'react';

interface AccountTypeAndBasicInfoProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function AccountTypeAndBasicInfo({ data, onComplete, previewMode = false }: AccountTypeAndBasicInfoProps) {
  const [accountType, setAccountType] = useState(data.accountType || '');
  const [fullName, setFullName] = useState(data.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth || '');
  const [email, setEmail] = useState(data.email || '');
  const [address, setAddress] = useState({
    street: data.address?.street || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    zipCode: data.address?.zipCode || '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      accountType,
      fullName,
      dateOfBirth,
      email,
      address,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">Choose Your Account Type</h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Select how you want to use Sky
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Type Selection */}
          <div>
            <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              I want to register as:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Regular User Card */}
              <button
                type="button"
                onClick={() => setAccountType('user')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  accountType === 'user'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {accountType === 'user' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  User
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Trade stocks, invest long-term, copy strategies from expert traders, and build your portfolio
                </p>
                <div className="space-y-1">
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Buy & sell stocks
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Copy expert traders
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Portfolio analytics
                  </div>
                </div>
              </button>

              {/* Copy Trader Card */}
              <button
                type="button"
                onClick={() => setAccountType('copyTrader')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  accountType === 'copyTrader'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {accountType === 'copyTrader' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Copy Trader (Expert)
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Share your trading strategies as an expert. Users can copy your trades and you earn from your expertise
                </p>
                <div className="space-y-1">
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Share your strategies
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Earn from followers
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    • Build your reputation
                  </div>
                </div>
              </button>
            </div>
            {errors.accountType && (
              <p className="text-red-400 text-sm mt-2">{errors.accountType}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}></div>

          {/* Personal Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Personal Information
            </h3>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Enter your full legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Date of Birth & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="street" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Street Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="street"
                  type="text"
                  className={`form-input ${errors.street ? 'border-red-500' : ''}`}
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
                {errors.street && (
                  <p className="text-red-400 text-sm mt-1">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="New York"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                    placeholder="NY"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                  {errors.state && (
                    <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    ZIP Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                    placeholder="10001"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  />
                  {errors.zipCode && (
                    <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-lg"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
