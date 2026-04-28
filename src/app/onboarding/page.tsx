'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import AccountTypeAndBasicInfo from '@/components/onboarding/AccountTypeAndBasicInfo';
import MobileVerificationStep from '@/components/onboarding/MobileVerificationStep';
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

  const steps = [
    { id: 1, name: 'Choose Plan', shortName: 'Subscription' },
    { id: 2, name: 'Personal Details', shortName: 'Details' },
    { id: 3, name: 'Verification', shortName: 'Verification' },
    { id: 4, name: 'Risk Assessment', shortName: 'Risk' },
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

  return (
    <div className="min-h-screen trading-background">
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
                Logout
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
            <SubscriptionStep
              onComplete={handleStepComplete}
              onSkip={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <AccountTypeAndBasicInfo
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 3 && (
            <MobileVerificationStep
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 4 && (
            <ComplianceRiskAssessment
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}