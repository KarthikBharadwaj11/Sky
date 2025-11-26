'use client';

import { useState } from 'react';
import { Building2, CreditCard, Upload, RefreshCw, ArrowRight, Copy, Check, AlertCircle } from 'lucide-react';

interface AccountFundingProps {
  accountType: string;
  accountNumber?: string;
  onComplete: (method: string, data: any) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
}

export default function AccountFunding({
  accountType,
  accountNumber,
  onComplete,
  onSkip,
  showSkipOption = true
}: AccountFundingProps) {
  const [selectedMethod, setSelectedMethod] = useState<'wire' | 'ach' | 'check' | 'rollover' | null>(null);
  const [copiedWireInfo, setCopiedWireInfo] = useState(false);
  const [achFormData, setAchFormData] = useState({
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    amount: ''
  });
  const [rolloverData, setRolloverData] = useState({
    previousBroker: '',
    accountNumber: '',
    accountType: '',
    estimatedValue: ''
  });

  const fundingMethods = [
    {
      id: 'wire' as const,
      icon: Building2,
      title: 'Wire Transfer',
      description: 'Same-day transfer from your bank',
      time: 'Same day',
      fee: 'May vary by bank',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ach' as const,
      icon: CreditCard,
      title: 'Bank Transfer (ACH)',
      description: 'Link your bank account for transfers',
      time: '3-5 business days',
      fee: 'Free',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'check' as const,
      icon: Upload,
      title: 'Check Deposit',
      description: 'Upload a photo of your check',
      time: '3-5 business days',
      fee: 'Free',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'rollover' as const,
      icon: RefreshCw,
      title: 'Account Rollover',
      description: 'Transfer from another brokerage',
      time: '5-7 business days',
      fee: 'Free',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const wireInfo = {
    bankName: 'Apex Clearing Corporation',
    routingNumber: '021000021',
    accountNumber: accountNumber || 'XXXXXXXXXX',
    swiftCode: 'APEXUS33',
    beneficiaryName: 'Your Trading Platform LLC',
    reference: `Account: ${accountNumber || 'TBD'}`
  };

  const handleCopyWireInfo = () => {
    const wireText = `
Bank Name: ${wireInfo.bankName}
Routing Number: ${wireInfo.routingNumber}
Account Number: ${wireInfo.accountNumber}
SWIFT Code: ${wireInfo.swiftCode}
Beneficiary: ${wireInfo.beneficiaryName}
Reference: ${wireInfo.reference}
    `.trim();

    navigator.clipboard.writeText(wireText);
    setCopiedWireInfo(true);
    setTimeout(() => setCopiedWireInfo(false), 2000);
  };

  const renderMethodDetails = () => {
    switch (selectedMethod) {
      case 'wire':
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Wire Transfer Instructions
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Bank Name</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wireInfo.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Routing Number</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wireInfo.routingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Account Number</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wireInfo.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>SWIFT Code</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wireInfo.swiftCode}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Beneficiary</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wireInfo.beneficiaryName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Reference (Important)</p>
                    <p className="text-sm font-medium text-blue-400">{wireInfo.reference}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyWireInfo}
                  className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  {copiedWireInfo ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Wire Instructions
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-1">Important</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Contact your bank to initiate the wire transfer. Include your account number in the reference field to ensure proper crediting.
                </p>
              </div>
            </div>

            <button
              onClick={() => onComplete('wire', wireInfo)}
              className="w-full btn-primary py-4"
            >
              I've Initiated the Wire Transfer
            </button>
          </div>
        );

      case 'ach':
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Link Your Bank Account
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Routing Number
                  </label>
                  <input
                    type="text"
                    placeholder="000000000"
                    maxLength={9}
                    value={achFormData.routingNumber}
                    onChange={(e) => setAchFormData({...achFormData, routingNumber: e.target.value.replace(/\D/g, '')})}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your account number"
                    value={achFormData.accountNumber}
                    onChange={(e) => setAchFormData({...achFormData, accountNumber: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAchFormData({...achFormData, accountType: 'checking'})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        achFormData.accountType === 'checking'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Checking</p>
                    </button>
                    <button
                      onClick={() => setAchFormData({...achFormData, accountType: 'savings'})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        achFormData.accountType === 'savings'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Savings</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Transfer Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    value={achFormData.amount}
                    onChange={(e) => setAchFormData({...achFormData, amount: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => onComplete('ach', achFormData)}
              disabled={!achFormData.routingNumber || !achFormData.accountNumber || !achFormData.amount}
              className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Link Bank & Transfer
            </button>
          </div>
        );

      case 'check':
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Mobile Check Deposit
              </h3>

              <div className="space-y-4">
                <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <p className="font-semibold">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Endorse the back of your check with your signature</li>
                    <li>Write "For Mobile Deposit Only" below your signature</li>
                    <li>Take a clear photo of the front and back of the check</li>
                    <li>Upload both images below</li>
                  </ol>
                </div>

                <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: 'var(--glass-border)' }}>
                  <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Check Images</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Front and back of the check</p>
                  <button className="btn-secondary mt-4 px-6 py-2">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-1">Review Time</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Check deposits are typically reviewed within 1 business day. Funds will be available in 3-5 business days.
                </p>
              </div>
            </div>

            <button
              onClick={() => onComplete('check', {})}
              className="w-full btn-primary py-4"
            >
              Submit Check Deposit
            </button>
          </div>
        );

      case 'rollover':
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Account Rollover Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Previous Brokerage Firm
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fidelity, Charles Schwab"
                    value={rolloverData.previousBroker}
                    onChange={(e) => setRolloverData({...rolloverData, previousBroker: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Previous Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Account number at previous brokerage"
                    value={rolloverData.accountNumber}
                    onChange={(e) => setRolloverData({...rolloverData, accountNumber: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Account Type
                  </label>
                  <select
                    value={rolloverData.accountType}
                    onChange={(e) => setRolloverData({...rolloverData, accountType: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select account type</option>
                    <option value="traditional-ira">Traditional IRA</option>
                    <option value="roth-ira">Roth IRA</option>
                    <option value="401k">401(k)</option>
                    <option value="individual">Individual Brokerage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Estimated Account Value (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    value={rolloverData.estimatedValue}
                    onChange={(e) => setRolloverData({...rolloverData, estimatedValue: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-1">Next Steps</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We'll contact your previous brokerage to initiate the transfer. You may also need to complete forms from your previous firm.
                </p>
              </div>
            </div>

            <button
              onClick={() => onComplete('rollover', rolloverData)}
              disabled={!rolloverData.previousBroker || !rolloverData.accountNumber || !rolloverData.accountType}
              className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Initiate Account Rollover
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedMethod) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMethod(null)}
          className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2"
          style={{ color: 'var(--text-tertiary)' }}
        >
          ← Back to funding methods
        </button>

        {renderMethodDetails()}

        {showSkipOption && onSkip && (
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-sm font-medium hover:text-blue-400 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              I'll fund this later
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Fund Your Account</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose how you'd like to add funds to your {accountType} account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fundingMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className="card hover:border-blue-500 transition-all text-left group"
            >
              <div className="card-body">
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {method.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {method.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs ml-8">
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Time: </span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{method.time}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Fee: </span>
                    <span className="font-medium text-green-400">{method.fee}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showSkipOption && onSkip && (
        <div className="text-center mt-6">
          <button
            onClick={onSkip}
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            I'll fund this later
          </button>
        </div>
      )}
    </div>
  );
}
