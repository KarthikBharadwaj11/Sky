'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import AccountTypeAndBasicInfo from '@/components/onboarding/AccountTypeAndBasicInfo';
import ComplianceRiskAssessment from '@/components/onboarding/ComplianceRiskAssessment';
import FundingSourceStep from '@/components/onboarding/FundingSourceStep';
import ProgressStepper from '@/components/onboarding/ProgressStepper';
import { ChevronLeft } from 'lucide-react';

export default function OnboardingPage() {
  const { user, logout, completeOnboarding } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    accountType: 'trader',
    firstName: '',
    middleName: '',
    lastName: '',
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

  const steps = [
    { id: 1, name: 'Personal Details', shortName: 'Details' },
    { id: 2, name: 'Risk Assessment', shortName: 'Risk' },
    { id: 3, name: 'Funding Source', shortName: 'Funding' },
  ];

  const handleStepComplete = (stepData: any) => {
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

    completeOnboarding();
    router.push('/overview');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          {currentStep > 1 && (
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
            <FundingSourceStep
              onComplete={handleStepComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
