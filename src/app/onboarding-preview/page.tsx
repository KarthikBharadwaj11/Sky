'use client';

import { useState } from 'react';
import AccountTypeAndBasicInfo from '@/components/onboarding/AccountTypeAndBasicInfo';
import MobileVerificationStep from '@/components/onboarding/MobileVerificationStep';
import ResidencyVerificationStep from '@/components/onboarding/ResidencyVerificationStep';
import ProfessionalDetails from '@/components/onboarding/ProfessionalDetails';
import SourceOfFunds from '@/components/onboarding/SourceOfFunds';
import InvestmentGoalsExperience from '@/components/onboarding/InvestmentGoalsExperience';
import ComplianceRiskAssessment from '@/components/onboarding/ComplianceRiskAssessment';
import AddFamilyMemberPrompt from '@/components/onboarding/AddFamilyMemberPrompt';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OnboardingPreview() {
  const [currentScreen, setCurrentScreen] = useState(1);
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
    // Professional Details
    profession: '',
    otherProfession: '',
    employerName: '',
    designation: '',
    monthlyIncome: '',
    investingExperience: '',
    // Source of Funds
    sourceOfFunds: [],
    otherSource: '',
    // Investment Goals & Experience
    investmentGoals: [],
    otherGoal: '',
    stocksExperience: '',
    optionsExperience: '',
    etfsExperience: '',
    // Compliance & Risk
    riskTolerance: '',
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
    },
    // Family Member
    wantsToAddFamilyMember: '',
    familyMemberRelationship: '',
    otherRelationship: '',
  });

  const screens = [
    { id: 1, name: 'Account Type & Basic Info', component: 'AccountTypeAndBasicInfo' },
    { id: 2, name: 'Mobile Verification', component: 'MobileVerificationStep' },
    { id: 3, name: 'Citizenship & ID Upload', component: 'ResidencyVerificationStep' },
    { id: 4, name: 'Professional Details', component: 'ProfessionalDetails' },
    { id: 5, name: 'Source of Funds', component: 'SourceOfFunds' },
    { id: 6, name: 'Investment Goals & Experience', component: 'InvestmentGoalsExperience' },
    { id: 7, name: 'Compliance & Risk Assessment', component: 'ComplianceRiskAssessment' },
    { id: 8, name: 'Family Access', component: 'AddFamilyMemberPrompt' },
  ];

  const handleComplete = (data: any) => {
    // Update data and automatically move to next screen
    console.log('Data submitted:', data);
    setOnboardingData(prev => ({ ...prev, ...data }));

    // Auto-navigate to next screen
    if (currentScreen < screens.length) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Last screen - show completion message
      alert('Onboarding preview complete! All screens reviewed.');
    }
  };

  const goToScreen = (screenNumber: number) => {
    setCurrentScreen(screenNumber);
  };

  const goToNext = () => {
    if (currentScreen < screens.length) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const goToPrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  return (
    <div className="min-h-screen trading-background">
      <div className="container mx-auto px-4 py-8">
        {/* Development Header */}
        <div className="mb-8 text-center">
          <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg mb-4">
            <p className="text-yellow-400 font-semibold">⚠️ DEVELOPMENT PREVIEW MODE</p>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Onboarding Flow Preview</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Navigate between screens to preview the onboarding flow
          </p>
        </div>

        {/* Screen Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Screen Navigation
                </h3>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500">
                  Currently viewing: Screen {currentScreen}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => goToScreen(screen.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      currentScreen === screen.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        currentScreen === screen.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {screen.id}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {screen.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <button
                  onClick={goToPrevious}
                  disabled={currentScreen === 1}
                  className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentScreen === screens.length}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Data Preview */}
        <details className="max-w-4xl mx-auto mb-8">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 text-center">
            Click to view current onboarding data (Debug)
          </summary>
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <pre className="text-xs text-gray-300 overflow-auto">
              {JSON.stringify(onboardingData, null, 2)}
            </pre>
          </div>
        </details>

        {/* Screen Content */}
        <div className="max-w-2xl mx-auto">
          {currentScreen === 1 && (
            <AccountTypeAndBasicInfo
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 2 && (
            <MobileVerificationStep
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 3 && (
            <ResidencyVerificationStep
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 4 && (
            <ProfessionalDetails
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 5 && (
            <SourceOfFunds
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 6 && (
            <InvestmentGoalsExperience
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 7 && (
            <ComplianceRiskAssessment
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
          {currentScreen === 8 && (
            <AddFamilyMemberPrompt
              data={onboardingData}
              onComplete={handleComplete}
              previewMode={true}
            />
          )}
        </div>

        {/* Helper Text */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="card p-4">
            <p className="text-sm font-semibold text-blue-400 mb-2">
              Design Preview Mode
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Navigate freely between screens using the buttons above or the grid navigation.<br />
              No need to fill forms - this is purely for design review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
