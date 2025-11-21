'use client';

import { useState } from 'react';

interface PersonalDetailsStepProps {
  data: any;
  onComplete: (stepData: any) => void;
}

export default function PersonalDetailsStep({ data, onComplete }: PersonalDetailsStepProps) {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    dateOfBirth: {
      month: data.dateOfBirth ? new Date(data.dateOfBirth).getMonth() + 1 : '',
      day: data.dateOfBirth ? new Date(data.dateOfBirth).getDate() : '',
      year: data.dateOfBirth ? new Date(data.dateOfBirth).getFullYear() : ''
    },
    address: {
      street: data.address?.street || '',
      city: data.address?.city || '',
      state: data.address?.state || '',
      zipCode: data.address?.zipCode || '',
      country: data.address?.country || 'United States'
    }
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.dateOfBirth.month || !formData.dateOfBirth.day || !formData.dateOfBirth.year) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth.year, formData.dateOfBirth.month - 1, formData.dateOfBirth.day);
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Birth date cannot be in the future';
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          // Adjust age if birthday hasn't occurred this year
        }
        
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be at least 18 years old';
        }
      }
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert date of birth to ISO string format
      const dateOfBirth = `${formData.dateOfBirth.year}-${String(formData.dateOfBirth.month).padStart(2, '0')}-${String(formData.dateOfBirth.day).padStart(2, '0')}`;
      const submissionData = {
        ...formData,
        dateOfBirth
      };
      onComplete(submissionData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (field.startsWith('dateOfBirth.')) {
      const dobField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dateOfBirth: {
          ...prev.dateOfBirth,
          [dobField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Generate years from 1900 to current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate days based on selected month and year
  const generateDays = () => {
    if (!formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      return Array.from({length: 31}, (_, i) => i + 1);
    }
    
    const daysInMonth = new Date(formData.dateOfBirth.year, formData.dateOfBirth.month, 0).getDate();
    return Array.from({length: daysInMonth}, (_, i) => i + 1);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Personal Information
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            We need some basic information to set up your trading account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Enter your full legal name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Date of Birth *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Month */}
              <div>
                <select
                  className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  value={formData.dateOfBirth.month}
                  onChange={(e) => handleInputChange('dateOfBirth.month', e.target.value)}
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Day */}
              <div>
                <select
                  className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  value={formData.dateOfBirth.day}
                  onChange={(e) => handleInputChange('dateOfBirth.day', e.target.value)}
                >
                  <option value="">Day</option>
                  {generateDays().map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Year */}
              <div>
                <select
                  className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  value={formData.dateOfBirth.year}
                  onChange={(e) => handleInputChange('dateOfBirth.year', e.target.value)}
                >
                  <option value="">Year</option>
                  {generateYears().map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.dateOfBirth && (
              <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Residential Address
              </h3>
            </div>

            {/* Street Address */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Street Address *
              </label>
              <input
                id="street"
                type="text"
                className={`form-input ${errors['address.street'] ? 'border-red-500' : ''}`}
                placeholder="Enter your street address"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
              />
              {errors['address.street'] && (
                <p className="text-red-400 text-sm mt-1">{errors['address.street']}</p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  className={`form-input ${errors['address.city'] ? 'border-red-500' : ''}`}
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                />
                {errors['address.city'] && (
                  <p className="text-red-400 text-sm mt-1">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  State/Province *
                </label>
                <input
                  id="state"
                  type="text"
                  className={`form-input ${errors['address.state'] ? 'border-red-500' : ''}`}
                  placeholder="State or Province"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                />
                {errors['address.state'] && (
                  <p className="text-red-400 text-sm mt-1">{errors['address.state']}</p>
                )}
              </div>
            </div>

            {/* ZIP Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  ZIP/Postal Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  className={`form-input ${errors['address.zipCode'] ? 'border-red-500' : ''}`}
                  placeholder="ZIP or Postal Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                />
                {errors['address.zipCode'] && (
                  <p className="text-red-400 text-sm mt-1">{errors['address.zipCode']}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Country *
                </label>
                <select
                  id="country"
                  className="form-input"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
          >
            Continue to Verification
          </button>
        </form>
      </div>
    </div>
  );
}