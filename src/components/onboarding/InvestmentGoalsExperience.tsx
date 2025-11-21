'use client';

import { useState } from 'react';
import { Target, BarChart3, Activity, PieChart } from 'lucide-react';

interface InvestmentGoalsExperienceProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function InvestmentGoalsExperience({ data, onComplete, previewMode = false }: InvestmentGoalsExperienceProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.investmentGoals || []);
  const [otherGoal, setOtherGoal] = useState(data.otherGoal || '');
  const [stocksExperience, setStocksExperience] = useState(data.stocksExperience || '');
  const [optionsExperience, setOptionsExperience] = useState(data.optionsExperience || '');
  const [etfsExperience, setEtfsExperience] = useState(data.etfsExperience || '');
  const [errors, setErrors] = useState<any>({});

  const investmentGoals = [
    {
      id: 'long-term-growth',
      label: 'Long-term Growth',
      description: 'Build wealth over years'
    },
    {
      id: 'short-term-trading',
      label: 'Short-term Trading',
      description: 'Active day/swing trading'
    },
    {
      id: 'passive-income',
      label: 'Passive Income',
      description: 'Generate regular dividends'
    },
    {
      id: 'retirement-planning',
      label: 'Retirement Planning',
      description: 'Secure your future'
    },
    {
      id: 'capital-preservation',
      label: 'Capital Preservation',
      description: 'Protect existing wealth'
    },
    {
      id: 'wealth-building',
      label: 'Wealth Building',
      description: 'Aggressive growth strategy'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Custom investment goal'
    }
  ];

  const experienceLevels = [
    { value: 'none', label: 'None', description: 'No experience', color: 'gray' },
    { value: 'beginner', label: 'Beginner', description: 'Less than 1 year', color: 'blue' },
    { value: 'intermediate', label: 'Intermediate', description: '1-3 years', color: 'green' },
    { value: 'advanced', label: 'Advanced', description: '3+ years', color: 'purple' }
  ];

  const assetTypes = [
    {
      id: 'stocks',
      label: 'Stocks',
      description: 'Individual company shares',
      Icon: BarChart3,
      value: stocksExperience,
      setValue: setStocksExperience
    },
    {
      id: 'options',
      label: 'Options',
      description: 'Derivatives contracts',
      Icon: Activity,
      value: optionsExperience,
      setValue: setOptionsExperience
    },
    {
      id: 'etfs',
      label: 'ETFs',
      description: 'Exchange-traded funds',
      Icon: PieChart,
      value: etfsExperience,
      setValue: setEtfsExperience
    }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      investmentGoals: selectedGoals,
      otherGoal: selectedGoals.includes('other') ? otherGoal : '',
      stocksExperience,
      optionsExperience,
      etfsExperience,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Investment Goals & Experience
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Help us personalize your trading experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Investment Goals Section */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Investment Goals
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                What are you looking to achieve? Select all that apply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {investmentGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);

                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="pr-6">
                      <h4 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {goal.label}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {goal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.goals && (
              <p className="text-red-400 text-sm mt-2">{errors.goals}</p>
            )}

            {selectedGoals.length > 0 && (
              <div className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                {selectedGoals.length} goal{selectedGoals.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Other Goal Specification */}
          {selectedGoals.includes('other') && (
            <div className="animate-fadeIn">
              <label htmlFor="otherGoal" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Please specify your other investment goal <span className="text-red-400">*</span>
              </label>
              <input
                id="otherGoal"
                type="text"
                className={`form-input ${errors.otherGoal ? 'border-red-500' : ''}`}
                placeholder="e.g., Education fund, House down payment"
                value={otherGoal}
                onChange={(e) => setOtherGoal(e.target.value)}
              />
              {errors.otherGoal && (
                <p className="text-red-400 text-sm mt-1">{errors.otherGoal}</p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}></div>

          {/* Asset Experience Section */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Trading Experience by Asset Type
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Rate your experience level for each asset type
              </p>
            </div>

            <div className="space-y-6">
              {assetTypes.map((asset) => {
                const Icon = asset.Icon;

                return (
                  <div key={asset.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-5 h-5" style={{ color: 'var(--text-accent)' }} />
                      <div>
                        <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {asset.label} <span className="text-red-400">*</span>
                        </h4>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {asset.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => asset.setValue(level.value)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                            asset.value === level.value
                              ? `border-${level.color}-500 bg-${level.color}-500/10`
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                            {level.label}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {level.description}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors[`${asset.id}Experience`] && (
                      <p className="text-red-400 text-sm mt-2">{errors[`${asset.id}Experience`]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="glass-morphism p-4 rounded-lg border border-blue-500/30">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              💡 <strong>Personalized Recommendations:</strong> Based on your goals and experience, we'll suggest appropriate trading strategies, educational resources, and investment opportunities tailored to your profile.
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
