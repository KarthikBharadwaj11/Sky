'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import AccountTypeSelection from '../accounts/AccountTypeSelection';
import AccountFunding from '../accounts/AccountFunding';

interface AddAccountPromptProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

type FlowStep = 'account-prompt' | 'select-type' | 'account-details' | 'funding-prompt' | 'select-funding' | 'funding-details';

export default function AddAccountPrompt({ data, onComplete, previewMode = false }: AddAccountPromptProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>('account-prompt');
  const [accountData, setAccountData] = useState<any>({
    accountType: null,
    accountSubType: null,
    fullName: '',
    ssn: '',
    dateOfBirth: '',
    fundingSource: '',
    initialDeposit: '',
    employmentInfo: '',
    incomeRange: '',
    investmentExperience: '',
    riskTolerance: '',
    trustName: '',
    trusteeInfo: '',
    fundingMethod: null,
    fundingData: null
  });

  const handleSkipAll = () => {
    onComplete({
      ...data,
      accountCreated: false,
      fundingCompleted: false,
      skipped: true
    });
  };

  const handleStartAccountCreation = () => {
    setFlowStep('select-type');
  };

  const handleSkipAccountCreation = () => {
    setFlowStep('funding-prompt');
  };

  const handleAccountTypeSelected = (type: 'individual' | 'ira' | 'trust', subType?: 'traditional' | 'roth') => {
    setAccountData({
      ...accountData,
      accountType: type,
      accountSubType: subType
    });
    setFlowStep('account-details');
  };

  const handleAccountDetailsComplete = () => {
    // Move to funding prompt after account details
    setFlowStep('funding-prompt');
  };

  const handleStartFunding = () => {
    setFlowStep('select-funding');
  };

  const handleSkipFundingFlow = () => {
    // Complete onboarding with account but no funding
    const finalData = {
      ...data,
      accountCreated: true,
      fundingCompleted: false,
      account: {
        ...accountData,
        createdAt: new Date().toISOString()
      }
    };
    onComplete(finalData);
  };

  const handleFundingComplete = (method: string, fundingData: any) => {
    const finalData = {
      ...data,
      accountCreated: true,
      fundingCompleted: true,
      account: {
        ...accountData,
        fundingMethod: method,
        fundingData: fundingData,
        createdAt: new Date().toISOString()
      }
    };
    onComplete(finalData);
  };

  if (flowStep === 'select-type') {
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="card-body">
          <button
            onClick={() => setFlowStep('account-prompt')}
            className="text-sm font-medium hover:text-blue-400 transition-colors mb-6"
            style={{ color: 'var(--text-tertiary)' }}
          >
            ← Back
          </button>

          <AccountTypeSelection
            onSelectType={handleAccountTypeSelected}
            onSkip={handleSkipAccountCreation}
            showSkipOption={true}
          />
        </div>
      </div>
    );
  }

  if (flowStep === 'account-details') {
    const accountTypeName = accountData.accountSubType
      ? `${accountData.accountSubType === 'traditional' ? 'Traditional' : 'Roth'} IRA`
      : accountData.accountType === 'individual'
        ? 'Individual Brokerage'
        : accountData.accountType === 'trust'
          ? 'Trust'
          : accountData.accountType;

    return (
      <div className="card max-w-2xl mx-auto">
        <div className="card-body">
          <button
            onClick={() => setFlowStep('select-type')}
            className="text-sm font-medium hover:text-blue-400 transition-colors mb-6"
            style={{ color: 'var(--text-tertiary)' }}
          >
            ← Change account type
          </button>

          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Account Details
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Enter the details for your {accountTypeName} account (Optional)
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAccountDetailsComplete();
            }}
            className="space-y-4"
          >
            {/* Common fields for all account types */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                placeholder="Enter your full legal name"
                value={accountData.fullName || ''}
                onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Social Security Number
              </label>
              <input
                type="text"
                placeholder="XXX-XX-XXXX"
                value={accountData.ssn || ''}
                onChange={(e) => setAccountData({ ...accountData, ssn: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={accountData.dateOfBirth || ''}
                onChange={(e) => setAccountData({ ...accountData, dateOfBirth: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Individual/Trust Account specific fields */}
            {(accountData.accountType === 'individual' || accountData.accountType === 'trust') && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Employment Information
                  </label>
                  <input
                    type="text"
                    placeholder="Employer name and position"
                    value={accountData.employmentInfo || ''}
                    onChange={(e) => setAccountData({ ...accountData, employmentInfo: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Annual Income Range
                  </label>
                  <select
                    value={accountData.incomeRange || ''}
                    onChange={(e) => setAccountData({ ...accountData, incomeRange: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select income range</option>
                    <option value="0-25000">$0 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000-100000">$50,000 - $100,000</option>
                    <option value="100000-250000">$100,000 - $250,000</option>
                    <option value="250000+">$250,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Investment Experience
                  </label>
                  <select
                    value={accountData.investmentExperience || ''}
                    onChange={(e) => setAccountData({ ...accountData, investmentExperience: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (3-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Initial Deposit Amount
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={accountData.initialDeposit || ''}
                    onChange={(e) => setAccountData({ ...accountData, initialDeposit: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Funding Source
                  </label>
                  <select
                    value={accountData.fundingSource || ''}
                    onChange={(e) => setAccountData({ ...accountData, fundingSource: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select funding source</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="wire-transfer">Wire Transfer</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </>
            )}

            {/* Trust specific field */}
            {accountData.accountType === 'trust' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Trust Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name of the trust"
                    value={accountData.trustName || ''}
                    onChange={(e) => setAccountData({ ...accountData, trustName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Trustee Information
                  </label>
                  <input
                    type="text"
                    placeholder="Trustee name and contact"
                    value={accountData.trusteeInfo || ''}
                    onChange={(e) => setAccountData({ ...accountData, trusteeInfo: e.target.value })}
                    className="form-input"
                  />
                </div>
              </>
            )}

            {/* IRA specific fields */}
            {accountData.accountType === 'ira' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Funding Source
                  </label>
                  <select
                    value={accountData.fundingSource || ''}
                    onChange={(e) => setAccountData({ ...accountData, fundingSource: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select funding source</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="wire-transfer">Wire Transfer</option>
                    <option value="check">Check</option>
                    <option value="rollover">IRA Rollover</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Note:</strong> {accountData.accountSubType === 'traditional' ? 'Traditional IRA contributions may be tax-deductible.' : 'Roth IRA contributions are made with after-tax dollars.'} Annual contribution limit is $7,000 ($8,000 if age 50+).
                  </p>
                </div>
              </>
            )}

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="btn-primary w-full py-3"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleSkipAccountCreation}
                className="w-full py-3 rounded-xl font-medium transition-colors"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-secondary)'
                }}
              >
                Skip account creation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (flowStep === 'funding-prompt') {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Fund Your Account
          </h2>

          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Add funds to your trading account. You can choose from multiple funding methods or skip and add funds later.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Wire transfer for same-day funding
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Bank transfer (ACH), check, or account rollover options
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  You can always add funds later from your profile
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartFunding}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              Add Funds Now
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSkipFundingFlow}
              className="w-full py-3 rounded-xl font-medium transition-colors"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-secondary)'
              }}
            >
              Skip funding
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (flowStep === 'select-funding') {
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="card-body">
          <button
            onClick={() => setFlowStep('funding-prompt')}
            className="text-sm font-medium hover:text-blue-400 transition-colors mb-6"
            style={{ color: 'var(--text-tertiary)' }}
          >
            ← Back
          </button>

          <AccountFunding
            accountType="Your Account"
            onComplete={handleFundingComplete}
            onSkip={handleSkipFundingFlow}
            showSkipOption={true}
          />
        </div>
      </div>
    );
  }

  // Account Prompt step
  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Create Your Trading Account
        </h2>

        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Set up your account to start investing. You can choose from multiple account types and configure your account details.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Choose from Individual, IRA, or Trust accounts
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Provide account details (all optional)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                You can add additional accounts later from your profile
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartAccountCreation}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSkipAll}
            className="w-full py-3 rounded-xl font-medium transition-colors"
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-secondary)'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
