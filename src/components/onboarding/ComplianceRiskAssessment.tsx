'use client';

import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface ComplianceRiskAssessmentProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

export default function ComplianceRiskAssessment({ data, onComplete, previewMode = false }: ComplianceRiskAssessmentProps) {
  const [riskTolerance, setRiskTolerance] = useState(data.riskTolerance || '');
  const [agreements, setAgreements] = useState({
    termsOfService: data.agreements?.termsOfService || false,
    privacyPolicy: data.agreements?.privacyPolicy || false,
  });
  const [errors, setErrors] = useState<any>({});

  const riskLevels = [
    {
      id: 'conservative',
      label: 'Conservative',
      description: 'Low risk tolerance. Focus on capital preservation with minimal volatility. Suitable for investors prioritizing safety over growth.',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500/10',
      riskLevel: 'Low Risk'
    },
    {
      id: 'moderately-conservative',
      label: 'Moderately Conservative',
      description: 'Below-average risk tolerance. Balanced approach with emphasis on stability while accepting limited growth opportunities.',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      riskLevel: 'Low-Medium Risk'
    },
    {
      id: 'moderate',
      label: 'Moderate',
      description: 'Average risk tolerance. Balanced portfolio seeking equilibrium between growth and stability with moderate volatility.',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10',
      riskLevel: 'Medium Risk'
    },
    {
      id: 'moderately-aggressive',
      label: 'Moderately Aggressive',
      description: 'Above-average risk tolerance. Focus on growth with acceptance of higher volatility for potentially greater returns.',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-500/10',
      riskLevel: 'Medium-High Risk'
    },
    {
      id: 'aggressive',
      label: 'Aggressive',
      description: 'High risk tolerance. Maximum growth focus with acceptance of significant volatility and potential for substantial gains or losses.',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500/10',
      riskLevel: 'High Risk'
    }
  ];

  const regulatoryAgreements = [
    {
      id: 'termsOfService',
      title: 'Terms of Service',
      description: 'I have read and agree to the Terms of Service governing the use of Sky trading platform.',
      link: '#'
    },
    {
      id: 'privacyPolicy',
      title: 'Privacy Policy',
      description: 'I acknowledge and consent to the collection, use, and processing of my personal data as described in the Privacy Policy.',
      link: '#'
    }
  ];

  const handleAgreementChange = (agreementId: string) => {
    setAgreements(prev => ({
      ...prev,
      [agreementId]: !prev[agreementId as keyof typeof prev]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      riskTolerance,
      agreements,
    });
  };

  const allAgreementsAccepted = Object.values(agreements).every(value => value === true);

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Compliance & Risk Assessment
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Understand your risk profile and review regulatory requirements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Risk Tolerance Section */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Risk Tolerance Assessment
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Select the risk level that best matches your investment comfort level
              </p>
            </div>

            <div className="space-y-2">
              {riskLevels.map((level) => {
                const isSelected = riskTolerance === level.id;

                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setRiskTolerance(level.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                      isSelected
                        ? `${level.borderColor} ${level.bgColor} shadow-lg`
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

                    <div className="pr-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {level.label}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${level.bgColor} ${level.borderColor} border`}>
                          {level.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {level.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.riskTolerance && (
              <p className="text-red-400 text-sm mt-2">{errors.riskTolerance}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="glass-morphism p-3 rounded-lg border border-yellow-500/30">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong>Important:</strong> Your risk tolerance helps us recommend suitable investment strategies. You can change this setting later in your account preferences.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}></div>

          {/* Regulatory Agreements Section */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Regulatory Agreements & Disclosures
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Please review and accept the following agreements to proceed
              </p>
            </div>

            <div className="space-y-3">
              {regulatoryAgreements.map((agreement) => (
                <div
                  key={agreement.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    agreements[agreement.id as keyof typeof agreements]
                      ? 'border-green-500 bg-green-500/5'
                      : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={agreement.id}
                      checked={agreements[agreement.id as keyof typeof agreements]}
                      onChange={() => handleAgreementChange(agreement.id)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <label
                          htmlFor={agreement.id}
                          className="text-sm font-bold cursor-pointer"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {agreement.title}
                        </label>
                        <a
                          href={agreement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {agreement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.agreements && (
              <p className="text-red-400 text-sm mt-2">{errors.agreements}</p>
            )}

            {/* Agreement Status */}
            <div className={`mt-4 p-4 rounded-lg border ${
              allAgreementsAccepted
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-600 bg-gray-600/10'
            }`}>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {allAgreementsAccepted
                    ? 'All agreements accepted ✓'
                    : `${Object.values(agreements).filter(v => v).length} of ${Object.keys(agreements).length} agreements accepted`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Final Warning */}
          <div className="glass-morphism p-4 rounded-lg border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong className="text-red-400">Risk Warning:</strong> Trading and investing involve risk of loss. You should only invest money you can afford to lose. Past performance does not guarantee future results.
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
