'use client';

import { useState } from 'react';
import { Users, Eye, Unlock, Mail, Phone, User as UserIcon, Shield } from 'lucide-react';

interface FamilyMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  relationship: string;
  accessLevel: 'view-only' | 'full-access';
}

interface FamilyMemberDetailsStepProps {
  data: any;
  onComplete: (data: any) => void;
}

export default function FamilyMemberDetailsStep({ data, onComplete }: FamilyMemberDetailsStepProps) {
  const [memberDetails, setMemberDetails] = useState({
    fullName: 'Bruce Banner',
    email: 'bruce.banner@avengers.com',
    phone: '+1 (555) 123-4567',
    accessLevel: 'view-only' as 'view-only' | 'full-access' | ''
  });
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: string) => {
    setMemberDetails(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!memberDetails.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!memberDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!memberDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(memberDetails.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!memberDetails.accessLevel) {
      newErrors.accessLevel = 'Please select an access level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get the relationship from previous step
    const relationship = data.familyMemberRelationship === 'other'
      ? data.otherRelationship
      : data.familyMemberRelationship;

    // Create the family member object
    const familyMember = {
      id: Date.now().toString(),
      ...memberDetails,
      relationship
    };

    onComplete({
      familyMember
    });
  };

  // If user selected "no" in previous step, skip this step
  if (data.wantsToAddFamilyMember === 'no') {
    onComplete({});
    return null;
  }

  const getRelationshipLabel = () => {
    if (data.familyMemberRelationship === 'other') {
      return data.otherRelationship || 'Family Member';
    }

    const relationshipMap: any = {
      'father': 'Father',
      'mother': 'Mother',
      'son': 'Son',
      'daughter': 'Daughter',
      'spouse': 'Spouse',
      'trading-advisor': 'Trading Advisor'
    };

    return relationshipMap[data.familyMemberRelationship] || 'Family Member';
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {getRelationshipLabel()} Details
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter the contact details and access level for your {getRelationshipLabel().toLowerCase()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Box */}
          <div className="glass-morphism p-3 rounded-lg border border-blue-500/30">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong>Selected Relationship:</strong> {getRelationshipLabel()}
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
              <input
                id="fullName"
                type="text"
                className={`form-input pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Enter full name"
                value={memberDetails.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
              <input
                id="email"
                type="email"
                className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@example.com"
                value={memberDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
              <input
                id="phone"
                type="tel"
                className={`form-input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="+1 (555) 123-4567"
                value={memberDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}></div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Access Level <span className="text-red-400">*</span>
            </label>
            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Choose what level of access this person will have to your portfolio
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* View Only Option */}
              <button
                type="button"
                onClick={() => handleInputChange('accessLevel', 'view-only')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  memberDetails.accessLevel === 'view-only'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {memberDetails.accessLevel === 'view-only' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      View Only
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    Can view your portfolio holdings, performance, and transaction history. Cannot execute trades.
                  </p>
                </div>
              </button>

              {/* Full Access Option */}
              <button
                type="button"
                onClick={() => handleInputChange('accessLevel', 'full-access')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  memberDetails.accessLevel === 'full-access'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {memberDetails.accessLevel === 'full-access' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-5 h-5 text-purple-400" />
                    <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Full Access
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    Can view your portfolio AND execute trades on your behalf. Recommended for trusted advisors only.
                  </p>
                </div>
              </button>
            </div>

            {errors.accessLevel && (
              <p className="text-red-400 text-sm mt-2">{errors.accessLevel}</p>
            )}
          </div>

          {/* Security Notice */}
          {memberDetails.accessLevel === 'full-access' && (
            <div className="glass-morphism p-3 rounded-lg border border-yellow-500/30 animate-fadeIn">
              <div className="flex gap-2">
                <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Security Notice
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Full access allows this person to make trades on your behalf. Only grant this to people you completely trust. You can change or revoke access anytime from your profile settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit and Skip Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => onComplete({})}
              className="btn-secondary px-6 py-3 text-sm"
            >
              Skip for Now
            </button>
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
