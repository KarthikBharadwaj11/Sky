'use client';

import { useState } from 'react';

interface AccountTypeAndBasicInfoProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function AccountTypeAndBasicInfo({ data, onComplete, previewMode = false }: AccountTypeAndBasicInfoProps) {
  const [accountType, setAccountType] = useState(data.accountType || '');
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [middleName, setMiddleName] = useState(data.middleName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth || '');
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
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      address,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">Personal Details</h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Tell us a bit about yourself
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Personal Information
            </h3>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Middle Name
                  </label>
                  <input
                    id="middleName"
                    type="text"
                    className="form-input"
                    placeholder="Middle name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="md:w-1/3">
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
