'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface SourceOfFundsProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function SourceOfFunds({ data, onComplete, previewMode = false }: SourceOfFundsProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(data.sourceOfFunds || []);
  const [otherSource, setOtherSource] = useState(data.otherSource || '');
  const [errors, setErrors] = useState<any>({});

  const fundSources = [
    { id: 'salary', label: 'Salary', description: 'Regular employment income' },
    { id: 'savings', label: 'Savings', description: 'Personal savings account' },
    { id: 'business-income', label: 'Business Income', description: 'Self-employed or business profits' },
    { id: 'investments', label: 'Investments', description: 'Stock, bonds, or asset returns' },
    { id: 'pension', label: 'Pension', description: 'Retirement pension funds' },
    { id: 'inheritance', label: 'Inheritance', description: 'Inherited wealth or gifts' },
    { id: 'other', label: 'Other', description: 'Other sources of income' }
  ];

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      sourceOfFunds: selectedSources,
      otherSource: selectedSources.includes('other') ? otherSource : '',
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Source of Funds
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Where will your investment funds come from?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Message */}
          <div className="glass-morphism p-3 rounded-lg border border-blue-500/30">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              ℹ️ You can select <strong>multiple sources</strong>. This helps us comply with regulatory requirements.
            </p>
          </div>

          {/* Source Selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Select all that apply <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {fundSources.map((source) => {
                const isSelected = selectedSources.includes(source.id);

                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => toggleSource(source.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                      isSelected
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="pr-6">
                      <h4 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {source.label}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {source.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.sources && (
              <p className="text-red-400 text-sm mt-2">{errors.sources}</p>
            )}
          </div>

          {selectedSources.length > 0 && (
            <div className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
              {selectedSources.length} source{selectedSources.length > 1 ? 's' : ''} selected
            </div>
          )}

          {/* Other Source Specification */}
          {selectedSources.includes('other') && (
            <div className="animate-fadeIn">
              <label htmlFor="otherSource" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Please specify <span className="text-red-400">*</span>
              </label>
              <input
                id="otherSource"
                type="text"
                className={`form-input ${errors.otherSource ? 'border-red-500' : ''}`}
                placeholder="e.g., Rental income, Freelance work"
                value={otherSource}
                onChange={(e) => setOtherSource(e.target.value)}
              />
              {errors.otherSource && (
                <p className="text-red-400 text-sm mt-1">{errors.otherSource}</p>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="glass-morphism p-3 rounded-lg border border-yellow-500/30">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              🔒 <strong>Privacy Note:</strong> This information is kept confidential and used solely for regulatory compliance purposes.
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
