'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';

interface AddFamilyMemberPromptProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function AddFamilyMemberPrompt({ data, onComplete, previewMode = false }: AddFamilyMemberPromptProps) {
  const [wantsToAdd, setWantsToAdd] = useState<string>(data.wantsToAddFamilyMember || '');
  const [relationship, setRelationship] = useState(data.familyMemberRelationship || '');
  const [otherRelationship, setOtherRelationship] = useState(data.otherRelationship || '');
  const [errors, setErrors] = useState<any>({});

  const relationships = [
    { id: 'father', label: 'Father' },
    { id: 'mother', label: 'Mother' },
    { id: 'son', label: 'Son' },
    { id: 'daughter', label: 'Daughter' },
    { id: 'spouse', label: 'Spouse' },
    { id: 'trading-advisor', label: 'Trading Advisor' },
    { id: 'other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      wantsToAddFamilyMember: wantsToAdd,
      familyMemberRelationship: wantsToAdd === 'yes' ? relationship : '',
      otherRelationship: relationship === 'other' ? otherRelationship : '',
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Family/Advisor Access
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Grant family members or trading advisors access to your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Box */}
          <div className="glass-morphism p-3 rounded-lg border border-blue-500/30">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              You can add family members or trading advisors who can view and manage your portfolio. This is optional and can be configured later in settings.
            </p>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Would you like to add a family member or trading advisor now?
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Yes Option */}
              <button
                type="button"
                onClick={() => setWantsToAdd('yes')}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  wantsToAdd === 'yes'
                    ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {wantsToAdd === 'yes' && (
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
                    Yes, Add Now
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    I want to add a family member or advisor
                  </p>
                </div>
              </button>

              {/* No Option */}
              <button
                type="button"
                onClick={() => setWantsToAdd('no')}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                  wantsToAdd === 'no'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {wantsToAdd === 'no' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="pr-6">
                  <h4 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    Skip for Now
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    I'll add them later
                  </p>
                </div>
              </button>
            </div>

            {errors.wantsToAdd && (
              <p className="text-red-400 text-sm mt-2">{errors.wantsToAdd}</p>
            )}
          </div>

          {/* Divider */}
          {wantsToAdd === 'yes' && (
            <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}></div>
          )}

          {/* Relationship Selection - Only show if Yes is selected */}
          {wantsToAdd === 'yes' && (
            <div className="animate-fadeIn space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Relationship Type
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  What is your relationship with this person?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Select relationship <span className="text-red-400">*</span>
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {relationships.map((rel) => {
                    const isSelected = relationship === rel.id;

                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => setRelationship(rel.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-center relative ${
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

                        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {rel.label}
                        </h4>
                      </button>
                    );
                  })}
                </div>

                {errors.relationship && (
                  <p className="text-red-400 text-sm mt-2">{errors.relationship}</p>
                )}
              </div>

              {/* Other Relationship Input */}
              {relationship === 'other' && (
                <div className="animate-fadeIn">
                  <label htmlFor="otherRelationship" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Please specify <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="otherRelationship"
                    type="text"
                    className={`form-input ${errors.otherRelationship ? 'border-red-500' : ''}`}
                    placeholder="e.g., Brother, Sister, Financial Advisor"
                    value={otherRelationship}
                    onChange={(e) => setOtherRelationship(e.target.value)}
                  />
                  {errors.otherRelationship && (
                    <p className="text-red-400 text-sm mt-1">{errors.otherRelationship}</p>
                  )}
                </div>
              )}

              {/* Info Box for Selected Relationship */}
              {relationship && (
                <div className="glass-morphism p-3 rounded-lg border border-purple-500/30">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Selected:</strong> {relationship === 'other' ? (otherRelationship || 'Other') : relationships.find(r => r.id === relationship)?.label}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Info for Skip */}
          {wantsToAdd === 'no' && (
            <div className="glass-morphism p-3 rounded-lg border border-blue-500/30">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                You can add family members or advisors later from your account settings.
              </p>
            </div>
          )}

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
