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
    { id: 1, name: 'Account Type', shortName: 'Account' },
    { id: 2, name: 'Verification', shortName: 'Verification' },
    { id: 3, name: 'Residency Status', shortName: 'Residency' },
    { id: 4, name: 'Professional Details', shortName: 'Professional' },
    { id: 5, name: 'Funding Source', shortName: 'Funding' },
    { id: 6, name: 'Investment Goals', shortName: 'Goals' },
    { id: 7, name: 'Risk Assessment', shortName: 'Risk' },
    { id: 8, name: 'Family/Advisor Access', shortName: 'Family' },
    { id: 9, name: 'Member Details', shortName: 'Details' },
    { id: 10, name: 'Create Account', shortName: 'Account Setup' },
    { id: 11, name: 'Choose Plan', shortName: 'Subscription' },
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
            <AccountTypeAndBasicInfo
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 2 && (
            <MobileVerificationStep
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 3 && (
            <ResidencyVerificationStep
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 4 && (
            <ProfessionalDetails
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 5 && (
            <SourceOfFunds
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 6 && (
            <InvestmentGoalsExperience
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 7 && (
            <ComplianceRiskAssessment
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 8 && (
            <AddFamilyMemberPrompt
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 9 && (
            <FamilyMemberDetailsStep
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 10 && (
            <AddAccountPrompt
              data={onboardingData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 11 && (
            <SubscriptionStep
              onComplete={handleStepComplete}
              onSkip={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}