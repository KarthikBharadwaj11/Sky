'use client';

import { useState } from 'react';

interface FamilyMemberDetailsProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function FamilyMemberDetails({ data, onComplete, previewMode = false }: FamilyMemberDetailsProps) {
  const [relationship, setRelationship] = useState(data.familyMemberRelationship || '');
  const [otherRelationship, setOtherRelationship] = useState(data.otherRelationship || '');
  const [errors, setErrors] = useState<any>({});

  const relationships = [
    {
      id: 'father',
      label: 'Father'
    },
    {
      id: 'mother',
      label: 'Mother'
    },
    {
      id: 'son',
      label: 'Son'
    },
    {
      id: 'daughter',
      label: 'Daughter'
    },
    {
      id: 'spouse',
      label: 'Spouse'
    },
    {
      id: 'other',
      label: 'Other'
    }
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!relationship) {
      newErrors.relationship = 'Please select a relationship';
    }

    if (relationship === 'other' && !otherRelationship.trim()) {
      newErrors.otherRelationship = 'Please specify the relationship';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In preview mode, skip validation
    if (previewMode || validateForm()) {
      onComplete({
        familyMemberRelationship: relationship,
        otherRelationship: relationship === 'other' ? otherRelationship : '',
      });
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Select Relationship
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            What is your relationship with this family member?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Relationship Selection */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
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
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}

                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {rel.label}
                    </h3>
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
              <label htmlFor="otherRelationship" className="block text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Please specify the relationship <span className="text-red-400">*</span>
              </label>
              <input
                id="otherRelationship"
                type="text"
                className={`form-input ${errors.otherRelationship ? 'border-red-500' : ''}`}
                placeholder="e.g., Brother, Sister, Grandparent, Friend"
                value={otherRelationship}
                onChange={(e) => setOtherRelationship(e.target.value)}
              />
              {errors.otherRelationship && (
                <p className="text-red-400 text-sm mt-1">{errors.otherRelationship}</p>
              )}
            </div>
          )}

          {/* Info Message */}
          {relationship && (
            <div className="glass-morphism p-3 rounded-lg border border-green-500/30">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Selected: <strong>{relationship === 'other' ? (otherRelationship || 'Other') : relationships.find(r => r.id === relationship)?.label}</strong>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-base"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
