'use client';

import { useState } from 'react';
import { Check, X, Sparkles, TrendingUp, Zap, Shield, Crown, Users, Brain } from 'lucide-react';

interface SubscriptionStepProps {
  onComplete: (data: any) => void;
  onSkip?: () => void;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'monthly' | 'annual';
  onConfirm: () => void;
}

function PaymentModal({ isOpen, onClose, planType, onConfirm }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'debit' | 'bank'>('debit');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardholderName: '',
    billingZip: ''
  });

  if (!isOpen) return null;

  const amount = planType === 'monthly' ? 5.99 : 58.00;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="card max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="card-body p-6">
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Complete Payment
          </h3>
          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
            Subscribe to {planType === 'monthly' ? 'Monthly' : 'Annual'} Plan - ${amount.toFixed(2)}
          </p>
          <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              You'll receive a 7-day free trial. Your card will be charged ${amount.toFixed(2)} after the trial period ends.
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('debit')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'debit'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Debit/Credit Card</p>
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Bank Account</p>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'debit' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={cardData.cardholderName}
                  onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={cardData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setCardData({...cardData, cardNumber: formatted});
                  }}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardData.expirationDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardData({...cardData, expirationDate: value});
                    }}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Billing ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="12345"
                  maxLength={5}
                  value={cardData.billingZip}
                  onChange={(e) => setCardData({...cardData, billingZip: e.target.value.replace(/\D/g, '')})}
                  className="form-input"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Routing Number
                </label>
                <input
                  type="text"
                  placeholder="000000000"
                  maxLength={9}
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
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary py-3"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 btn-primary py-3"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionStep({ onComplete, onSkip }: SubscriptionStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'annual' | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePlanSelect = (plan: 'free' | 'monthly' | 'annual') => {
    setSelectedPlan(plan);

    if (plan === 'free') {
      // Skip payment for free plan
      onComplete({ subscription: 'free', promoCode: '' });
    } else {
      // Show payment modal for paid plans
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    onComplete({ subscription: selectedPlan, promoCode });
  };

  // Features to be determined later

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Crown className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Choose Your Plan
          </h2>
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            Start trading with our free plan or unlock premium features
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
            <p className="text-sm font-semibold text-blue-400">
              7-day free trial on all premium plans
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="card hover:scale-105 transition-all duration-300 border-2 border-transparent">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Free
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>$0</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/month</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Perfect for getting started
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Basic trading features</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Paper trading</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>Copy Trading</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>AI Analytics</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('free')}
                className="w-full btn-secondary py-3"
              >
                Continue with Free
              </button>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="card hover:scale-105 transition-all duration-300 border-2 border-blue-500">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Monthly
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                  Popular
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>$5.99</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/month</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Billed monthly, cancel anytime
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>All free features</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Copy Trading</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">AI Analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Advanced charts & indicators</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('monthly')}
                className="w-full btn-primary py-3"
              >
                Subscribe Monthly
              </button>
            </div>
          </div>

          {/* Annual Plan */}
          <div className="card hover:scale-105 transition-all duration-300 border-2 border-purple-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              20% OFF
            </div>
            <div className="card-body p-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Annual
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>$58</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/year</span>
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="line-through">$72</span> · Save $14/year
                </div>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Best value for serious traders
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>All free features</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Copy Trading</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">AI Analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Advanced charts & indicators</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('annual')}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                Subscribe Annually
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="card max-w-md mx-auto">
          <div className="card-body p-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Have a promo code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="form-input flex-1"
              />
              <button className="btn-secondary px-4">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        {onSkip && (
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-sm font-medium hover:text-blue-400 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlan(null);
        }}
        planType={selectedPlan === 'monthly' ? 'monthly' : 'annual'}
        onConfirm={handlePaymentConfirm}
      />
    </>
  );
}
