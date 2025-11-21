'use client';

import { useState } from 'react';
import { X, Building2, CreditCard } from 'lucide-react';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BankAccountData | CardData) => void;
}

export interface BankAccountData {
  type: 'bank';
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
}

export interface CardData {
  type: 'debit-card' | 'credit-card';
  bankName: string;
  cardNumber: string;
  cardNetwork: 'visa' | 'mastercard' | 'amex' | 'discover';
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
}

type PaymentMethodType = 'bank' | 'card';

export default function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
  const [methodType, setMethodType] = useState<PaymentMethodType>('bank');

  const [bankFormData, setBankFormData] = useState<Omit<BankAccountData, 'type'>>({
    bankName: '',
    accountType: 'checking',
    accountNumber: '',
    routingNumber: '',
    isDefault: false,
  });

  const [cardFormData, setCardFormData] = useState<Omit<CardData, 'type'>>({
    bankName: '',
    cardNumber: '',
    cardNetwork: 'visa',
    expiryDate: '',
    cvv: '',
    isDefault: false,
  });

  const [cardType, setCardType] = useState<'debit-card' | 'credit-card'>('debit-card');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (methodType === 'bank') {
      // Validate bank account
      if (!bankFormData.bankName || !bankFormData.accountNumber || !bankFormData.routingNumber) {
        alert('Please fill in all required fields');
        return;
      }

      if (bankFormData.routingNumber.length !== 9) {
        alert('Routing number must be 9 digits');
        return;
      }

      onAdd({ ...bankFormData, type: 'bank' });
    } else {
      // Validate card
      if (!cardFormData.bankName || !cardFormData.cardNumber || !cardFormData.expiryDate || !cardFormData.cvv) {
        alert('Please fill in all required fields');
        return;
      }

      if (cardFormData.cardNumber.replace(/\s/g, '').length < 13) {
        alert('Invalid card number');
        return;
      }

      if (cardFormData.cvv.length < 3) {
        alert('Invalid CVV');
        return;
      }

      onAdd({ ...cardFormData, type: cardType });
    }

    // Reset forms
    setBankFormData({
      bankName: '',
      accountType: 'checking',
      accountNumber: '',
      routingNumber: '',
      isDefault: false,
    });
    setCardFormData({
      bankName: '',
      cardNumber: '',
      cardNetwork: 'visa',
      expiryDate: '',
      cvv: '',
      isDefault: false,
    });

    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-morphism rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gradient">Add Payment Method</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Type Selection Tabs */}
        <div className="flex gap-2 mb-6 p-1 glass-morphism rounded-xl">
          <button
            onClick={() => setMethodType('bank')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              methodType === 'bank'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Account
            </div>
          </button>
          <button
            onClick={() => setMethodType('card')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              methodType === 'card'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Debit/Credit Card
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {methodType === 'bank' ? (
            <>
              {/* Bank Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Bank Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bankFormData.bankName}
                  onChange={(e) => setBankFormData({ ...bankFormData, bankName: e.target.value })}
                  placeholder="e.g., Chase, Bank of America, Wells Fargo"
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-green-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Account Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={bankFormData.accountType}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountType: e.target.value as 'checking' | 'savings' })}
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-green-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Account Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                  placeholder="Enter your account number"
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-green-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Routing Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bankFormData.routingNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, routingNumber: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                  placeholder="9-digit routing number"
                  maxLength={9}
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-green-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  Usually found at the bottom of your checks
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Card Type Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Card Type <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cardType"
                      value="debit-card"
                      checked={cardType === 'debit-card'}
                      onChange={() => setCardType('debit-card')}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl text-center text-sm font-semibold transition-all ${
                      cardType === 'debit-card'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'glass-morphism text-gray-400'
                    }`}>
                      Debit Card
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cardType"
                      value="credit-card"
                      checked={cardType === 'credit-card'}
                      onChange={() => setCardType('credit-card')}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl text-center text-sm font-semibold transition-all ${
                      cardType === 'credit-card'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'glass-morphism text-gray-400'
                    }`}>
                      Credit Card
                    </div>
                  </label>
                </div>
              </div>

              {/* Card Issuer */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Card Issuer <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cardFormData.bankName}
                  onChange={(e) => setCardFormData({ ...cardFormData, bankName: e.target.value })}
                  placeholder="e.g., Chase, Capital One, Citi"
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-purple-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>

              {/* Card Network */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Card Network <span className="text-red-400">*</span>
                </label>
                <select
                  value={cardFormData.cardNetwork}
                  onChange={(e) => setCardFormData({ ...cardFormData, cardNetwork: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-purple-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Card Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cardFormData.cardNumber}
                  onChange={(e) => setCardFormData({ ...cardFormData, cardNumber: formatCardNumber(e.target.value) })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-purple-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Expiry Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardFormData.expiryDate}
                    onChange={(e) => setCardFormData({ ...cardFormData, expiryDate: formatExpiryDate(e.target.value) })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-purple-500 outline-none transition-all"
                    style={{ color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    CVV <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardFormData.cvv}
                    onChange={(e) => setCardFormData({ ...cardFormData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-purple-500 outline-none transition-all"
                    style={{ color: 'var(--text-primary)' }}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Set as Default */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="setDefault"
              checked={methodType === 'bank' ? bankFormData.isDefault : cardFormData.isDefault}
              onChange={(e) => {
                if (methodType === 'bank') {
                  setBankFormData({ ...bankFormData, isDefault: e.target.checked });
                } else {
                  setCardFormData({ ...cardFormData, isDefault: e.target.checked });
                }
              }}
              className="w-4 h-4 rounded border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="setDefault" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              Set as default payment method
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                methodType === 'bank'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
              }`}
            >
              Add {methodType === 'bank' ? 'Bank Account' : 'Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
