'use client';

import { Building2, PiggyBank, TrendingUp, Users } from 'lucide-react';

interface AccountTypeSelectionProps {
  onSelectType: (type: 'individual' | 'ira' | 'trust', subType?: 'traditional' | 'roth') => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
}

export default function AccountTypeSelection({
  onSelectType,
  onSkip,
  showSkipOption = false
}: AccountTypeSelectionProps) {

  const accountTypes = [
    {
      type: 'individual' as const,
      icon: Users,
      title: 'Individual Brokerage',
      description: 'Standard investment account for buying stocks, ETFs, and options',
      features: ['No contribution limits', 'Taxable gains', 'Full trading access'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'ira' as const,
      subType: 'traditional' as const,
      icon: PiggyBank,
      title: 'Traditional IRA',
      description: 'Tax-deferred retirement account with potential tax deductions',
      features: ['Tax-deductible contributions', 'Tax-deferred growth', '$7,000 annual limit'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'ira' as const,
      subType: 'roth' as const,
      icon: TrendingUp,
      title: 'Roth IRA',
      description: 'After-tax retirement account with tax-free withdrawals',
      features: ['Tax-free growth', 'Tax-free withdrawals', '$7,000 annual limit'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'trust' as const,
      icon: Building2,
      title: 'Trust Account',
      description: 'Account held by a trustee for beneficiaries',
      features: ['Estate planning', 'Beneficiary protection', 'Professional management'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Choose Your Account Type</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select the account that best fits your investment goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountTypes.map((account) => {
          const Icon = account.icon;
          return (
            <button
              key={`${account.type}-${account.subType || 'default'}`}
              onClick={() => onSelectType(account.type, account.subType)}
              className="card hover:border-blue-500 transition-all text-left group"
            >
              <div className="card-body">
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {account.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {account.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 ml-8">
                  {account.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: 'var(--text-tertiary)' }}></div>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showSkipOption && onSkip && (
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-xl font-medium transition-colors mt-4"
          style={{
            background: 'var(--glass-bg)',
            color: 'var(--text-secondary)'
          }}
        >
          Skip account creation
        </button>
      )}
    </div>
  );
}
