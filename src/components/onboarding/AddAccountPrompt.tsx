'use client';

import { useState } from 'react';
import { PiggyBank, ArrowRight, X } from 'lucide-react';
import AccountTypeSelection from '../accounts/AccountTypeSelection';
import AccountFunding from '../accounts/AccountFunding';

interface AddAccountPromptProps {
  data: any;
  onComplete: (data: any) => void;
  previewMode?: boolean;
}

type FlowStep = 'prompt' | 'select-type' | 'funding' | 'complete';

export default function AddAccountPrompt({ data, onComplete, previewMode = false }: AddAccountPromptProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>('prompt');
  const [accountData, setAccountData] = useState<any>({
    accountType: null,
    accountSubType: null,
    fundingMethod: null,
    fundingData: null
  });

  const handleSkip = () => {
    onComplete({
      ...data,
      accountCreated: false,
      skippedAccountCreation: true
    });
  };

  const handleStartAccountCreation = () => {
    setFlowStep('select-type');
  };

  const handleAccountTypeSelected = (type: 'individual' | 'ira' | 'trust', subType?: 'traditional' | 'roth') => {
    setAccountData({
      ...accountData,
      accountType: type,
      accountSubType: subType
    });
    setFlowStep('funding');
  };

  const handleFundingComplete = (method: string, fundingData: any) => {
    const finalData = {
      ...data,
      accountCreated: true,
      account: {
        ...accountData,
        fundingMethod: method,
        fundingData: fundingData,
        createdAt: new Date().toISOString()
      }
    };
    onComplete(finalData);
  };

  const handleSkipFunding = () => {
    const finalData = {
      ...data,
      accountCreated: true,
      account: {
        ...accountData,
        fundingMethod: null,
        fundingData: null,
        createdAt: new Date().toISOString(),
        fundingSkipped: true
      }
    };
    onComplete(finalData);
  };

  if (flowStep === 'select-type') {
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={handleSkip}
              className="text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <X className="w-4 h-4" />
              Skip for now
            </button>
          </div>

          <AccountTypeSelection
            onSelectType={handleAccountTypeSelected}
            onSkip={handleSkip}
            showSkipOption={false}
          />
        </div>
      </div>
    );
  }

  if (flowStep === 'funding') {
    const accountTypeName = accountData.accountSubType
      ? `${accountData.accountSubType === 'traditional' ? 'Traditional' : 'Roth'} IRA`
      : accountData.accountType === 'individual'
        ? 'Individual Brokerage'
        : accountData.accountType === 'trust'
          ? 'Trust'
          : accountData.accountType;

    return (
      <div className="card max-w-4xl mx-auto">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setFlowStep('select-type')}
              className="text-sm font-medium hover:text-blue-400 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              ← Change account type
            </button>
            <button
              onClick={handleSkip}
              className="text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <X className="w-4 h-4" />
              Skip account creation
            </button>
          </div>

          <AccountFunding
            accountType={accountTypeName}
            onComplete={handleFundingComplete}
            onSkip={handleSkipFunding}
            showSkipOption={true}
          />
        </div>
      </div>
    );
  }

  // Prompt step
  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-body text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
          <PiggyBank className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-gradient mb-4">
          Ready to Start Trading?
        </h2>

        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Create your trading account now to start investing. You can add funds immediately or do it later.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="glass-morphism p-5 rounded-xl text-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-3">
              <span className="text-white font-bold">✓</span>
            </div>
            <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Multiple Account Types</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Individual, IRA, and Trust accounts available
            </p>
          </div>

          <div className="glass-morphism p-5 rounded-xl text-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
              <span className="text-white font-bold">✓</span>
            </div>
            <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Flexible Funding</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Wire, ACH, check, or rollover options
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartAccountCreation}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            Create Account Now
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleSkip}
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            I'll do this later
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Don't worry! You can always create additional accounts or add funds later from your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
