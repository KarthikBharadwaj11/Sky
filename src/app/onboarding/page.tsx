'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import AccountTypeAndBasicInfo from '@/components/onboarding/AccountTypeAndBasicInfo';
import ResidencyVerificationStep from '@/components/onboarding/ResidencyVerificationStep';
import ProfessionalDetails from '@/components/onboarding/ProfessionalDetails';
import SourceOfFunds from '@/components/onboarding/SourceOfFunds';
import InvestmentGoalsExperience from '@/components/onboarding/InvestmentGoalsExperience';
import ComplianceRiskAssessment from '@/components/onboarding/ComplianceRiskAssessment';
import AddFamilyMemberPrompt from '@/components/onboarding/AddFamilyMemberPrompt';
import FamilyMemberDetailsStep from '@/components/onboarding/FamilyMemberDetailsStep';
import AddAccountPrompt from '@/components/onboarding/AddAccountPrompt';
import SubscriptionStep from '@/components/onboarding/SubscriptionStep';
import ProgressStepper from '@/components/onboarding/ProgressStepper';
import { ChevronLeft } from 'lucide-react';

export default function OnboardingPage() {
  const { user, logout, completeOnboarding } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'trader' | 'expert' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    accountType: '',
    fullName: '',
    email: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    mobile: '',
    otp: '',
    password: '',
    residencyStatus: '',
    ssn: '',
    idType: '',
    idDocument: null,
    employmentStatus: '',
    positionOrOccupation: '',
    employerName: '',
    designation: '',
    monthlyIncome: '',
    investingExperience: '',
    sourceOfFunds: [],
    otherSource: '',
    investmentGoals: [],
    otherGoal: '',
    stocksExperience: '',
    optionsExperience: '',
    etfsExperience: '',
    riskTolerance: '',
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
    },
    wantsToAddFamilyMember: '',
    familyMemberRelationship: '',
    otherRelationship: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/register');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const steps = selectedRole === 'expert'
    ? [
        { id: 1, name: 'Personal Details', shortName: 'Details' },
        { id: 2, name: 'Risk Assessment', shortName: 'Risk' },
      ]
    : [
        { id: 1, name: 'Personal Details', shortName: 'Details' },
        { id: 2, name: 'Risk Assessment', shortName: 'Risk' },
        { id: 3, name: 'Choose Plan', shortName: 'Subscription' },
      ];

  const handleStepComplete = (stepData: any) => {
    console.log('Step completed:', currentStep, stepData);
    setOnboardingData(prev => ({ ...prev, ...stepData }));

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete(stepData);
    }
  };

  const handleComplete = (finalStepData?: any) => {
    const finalData = finalStepData ? { ...onboardingData, ...finalStepData } : onboardingData;

    console.log('Onboarding Complete!', finalData);

    // Mark onboarding as complete
    completeOnboarding();

    // Redirect to overview page
    router.push('/overview');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Account Setup</h1>
            <button
              onClick={() => { logout(); router.push('/register'); }}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="flex-1 flex items-start justify-center px-4 pt-16 pb-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gradient mb-3">How are you joining Sky?</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Choose your account type to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trader */}
              <button
                onClick={() => {
                  setSelectedRole('trader');
                  setOnboardingData(prev => ({ ...prev, accountType: 'trader' }));
                }}
                className="glass-morphism rounded-2xl border-2 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group overflow-hidden relative"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
                <div className="p-10">
                  <h3 className="text-4xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Trader</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Invest, trade stocks, and copy strategies from expert traders
                  </p>
                  <div className="space-y-2 text-center">
                    {['Buy & sell stocks', 'Copy expert traders', 'Portfolio analytics'].map(f => (
                      <p key={f} className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{f}</p>
                    ))}
                  </div>
                  <div className="mt-8 py-2.5 px-6 rounded-xl text-sm font-semibold text-white inline-block"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                    Get Started
                  </div>
                </div>
              </button>

              {/* Expert */}
              <button
                onClick={() => {
                  setSelectedRole('expert');
                  setOnboardingData(prev => ({ ...prev, accountType: 'expert' }));
                }}
                className="glass-morphism rounded-2xl border-2 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group overflow-hidden relative"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }} />
                <div className="p-10">
                  <h3 className="text-4xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Expert</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Share your strategies, grow a following, and earn from your expertise
                  </p>
                  <div className="space-y-2 text-center">
                    {['Share your strategies', 'Earn from followers', 'Build your reputation'].map(f => (
                      <p key={f} className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{f}</p>
                    ))}
                  </div>
                  <div className="mt-8 py-2.5 px-6 rounded-xl text-sm font-semibold text-white inline-block"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                    Get Started
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Account Setup</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Step {currentStep} of {steps.length}
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/register');
                }}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper steps={steps} currentStep={currentStep} />

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className={`${currentStep === 3 ? 'max-w-5xl' : 'max-w-2xl'} mx-auto`}>
          {/* Back Button */}
          {currentStep === 1 ? (
            <button
              onClick={() => { setSelectedRole(null); setCurrentStep(1); }}
              className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Change account type
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to previous step
            </button>
          )}

          {/* Current Step Component */}
          {currentStep === 1 && (
            <AccountTypeAndBasicInfo
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 2 && (
            <ComplianceRiskAssessment
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 3 && (
            <SubscriptionStep
              onComplete={handleStepComplete}
              onSkip={() => handleComplete()}
            />
          )}
        </div>
      </div>
    </div>
  );
}