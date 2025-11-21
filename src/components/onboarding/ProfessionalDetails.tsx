'use client';

import { useState } from 'react';
import { Briefcase } from 'lucide-react';

interface ProfessionalDetailsProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function ProfessionalDetails({ data, onComplete, previewMode = false }: ProfessionalDetailsProps) {
  const [employmentStatus, setEmploymentStatus] = useState(data.employmentStatus || '');
  const [positionOrOccupation, setPositionOrOccupation] = useState(data.positionOrOccupation || '');
  const [employerName, setEmployerName] = useState(data.employerName || '');
  const [designation, setDesignation] = useState(data.designation || '');
  const [monthlyIncome, setMonthlyIncome] = useState(data.monthlyIncome || '');
  const [investingExperience, setInvestingExperience] = useState(data.investingExperience || '');
  const [errors, setErrors] = useState<any>({});

  const employmentStatuses = [
    'Employed',
    'Self-employed',
    'Retired',
    'Unemployed',
    'Student'
  ];

  const incomeRanges = [
    { value: 'under-2k', label: 'Under $2,000' },
    { value: '2k-5k', label: '$2,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-20k', label: '$10,000 - $20,000' },
    { value: '20k-50k', label: '$20,000 - $50,000' },
    { value: 'above-50k', label: 'Above $50,000' }
  ];

  const experienceLevels = [
    { value: 'less-than-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-plus', label: '10+ years' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      employmentStatus,
      positionOrOccupation,
      employerName,
      designation,
      monthlyIncome,
      investingExperience,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Professional Details
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your professional background
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employment Status */}
          <div>
            <label htmlFor="employmentStatus" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Employment Status <span className="text-red-400">*</span>
            </label>
            <select
              id="employmentStatus"
              className={`form-input ${errors.employmentStatus ? 'border-red-500' : ''}`}
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
            >
              <option value="">Select your employment status</option>
              {employmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.employmentStatus && (
              <p className="text-red-400 text-sm mt-1">{errors.employmentStatus}</p>
            )}
          </div>

          {/* Position or Occupation */}
          <div>
            <label htmlFor="positionOrOccupation" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Position or Occupation <span className="text-red-400">*</span>
            </label>
            <input
              id="positionOrOccupation"
              type="text"
              className={`form-input ${errors.positionOrOccupation ? 'border-red-500' : ''}`}
              placeholder="e.g., Software Engineer, Teacher, Business Owner"
              value={positionOrOccupation}
              onChange={(e) => setPositionOrOccupation(e.target.value)}
            />
            {errors.positionOrOccupation && (
              <p className="text-red-400 text-sm mt-1">{errors.positionOrOccupation}</p>
            )}
          </div>

          {/* Employer Name & Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employerName" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Employer Name <span className="text-red-400">*</span>
              </label>
              <input
                id="employerName"
                type="text"
                className={`form-input ${errors.employerName ? 'border-red-500' : ''}`}
                placeholder="Company or organization name"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
              />
              {errors.employerName && (
                <p className="text-red-400 text-sm mt-1">{errors.employerName}</p>
              )}
            </div>

            <div>
              <label htmlFor="designation" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Designation/Job Title <span className="text-red-400">*</span>
              </label>
              <input
                id="designation"
                type="text"
                className={`form-input ${errors.designation ? 'border-red-500' : ''}`}
                placeholder="Your role or position"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
              {errors.designation && (
                <p className="text-red-400 text-sm mt-1">{errors.designation}</p>
              )}
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Monthly Income Range <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomeRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setMonthlyIncome(range.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    monthlyIncome === range.value
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {range.label}
                  </span>
                </button>
              ))}
            </div>
            {errors.monthlyIncome && (
              <p className="text-red-400 text-sm mt-2">{errors.monthlyIncome}</p>
            )}
          </div>

          {/* Investing Experience */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Overall Investing Experience <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setInvestingExperience(level.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    investingExperience === level.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
            {errors.investingExperience && (
              <p className="text-red-400 text-sm mt-2">{errors.investingExperience}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="glass-morphism p-4 rounded-lg border border-blue-500/30">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              💡 <strong>Why we ask:</strong> This information helps us understand your financial background and provide personalized investment recommendations suited to your profile.
            </p>
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
