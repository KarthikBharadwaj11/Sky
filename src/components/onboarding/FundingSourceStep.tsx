'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AccountFunding from '../accounts/AccountFunding';

interface FundingSourceStepProps {
  onComplete: (data: any) => void;
}

export default function FundingSourceStep({ onComplete }: FundingSourceStepProps) {
  const [showFunding, setShowFunding] = useState(false);

  const handleSkip = () => {
    onComplete({ fundingCompleted: false });
  };

  const handleFundingComplete = (method: string, fundingData: any) => {
    onComplete({ fundingCompleted: true, fundingMethod: method, fundingData });
  };

  if (showFunding) {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="card-body">
          <button
            onClick={() => setShowFunding(false)}
            className="text-sm font-medium hover:text-blue-400 transition-colors mb-6"
            style={{ color: 'var(--text-tertiary)' }}
          >
            ← Back
          </button>
          <AccountFunding
            accountType="Sky Trading Account"
            onComplete={handleFundingComplete}
            onSkip={handleSkip}
            showSkipOption={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-body">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">Add a Funding Source</h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Connect a bank account or card to start trading. You can always do this later from your profile.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            'Debit card — instant funding',
            'Bank transfer (ACH) — 1–3 business days',
            'Wire transfer — same day',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--text-accent)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowFunding(true)}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            Add Funding Source
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}
          >
            Do this later
          </button>
        </div>
      </div>
    </div>
  );
}
