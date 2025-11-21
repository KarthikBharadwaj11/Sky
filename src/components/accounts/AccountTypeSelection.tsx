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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-3">Choose Your Account Type</h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Select the account that best fits your investment goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accountTypes.map((account) => {
          const Icon = account.icon;
          return (
            <button
              key={`${account.type}-${account.subType || 'default'}`}
              onClick={() => onSelectType(account.type, account.subType)}
              className="card hover:scale-105 transition-all duration-300 text-left group"
            >
              <div className="card-body">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${account.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {account.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {account.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {account.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <span className="text-sm font-semibold text-gradient">
                    Select →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showSkipOption && onSkip && (
        <div className="text-center mt-8">
          <button
            onClick={onSkip}
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            I'll do this later
          </button>
        </div>
      )}
    </div>
  );
}
