'use client';

import { useState } from 'react';
import { X, Send, Calendar, Repeat } from 'lucide-react';

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccountType?: string;
}

type TransferType = 'one-time' | 'recurring' | 'wire';

const accountOptions = [
  { value: 'debit-card', label: 'Debit Card' },
  { value: 'brokerage', label: 'Brokerage Account' },
  { value: 'margin', label: 'Margin Account' },
  { value: 'traditional-ira', label: 'Traditional IRA' },
  { value: 'roth-ira', label: 'Roth IRA' },
  { value: 'rollover-ira', label: 'Rollover IRA' },
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export default function TransferFundsModal({ isOpen, onClose, currentAccountType }: TransferFundsModalProps) {
  const [transferType, setTransferType] = useState<TransferType>('one-time');
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.toAccount === 'debit-card') {
      alert('Cannot transfer funds to a debit card');
      return;
    }

    if (formData.fromAccount === formData.toAccount) {
      alert('Cannot transfer to the same account');
      return;
    }

    if (transferType === 'recurring' && !formData.startDate) {
      alert('Please select a start date for recurring transfer');
      return;
    }

    // Process transfer
    alert(`${transferType === 'one-time' ? 'One-time' : 'Recurring'} transfer initiated!\nFrom: ${formData.fromAccount}\nTo: ${formData.toAccount}\nAmount: $${formData.amount}${transferType === 'recurring' ? `\nFrequency: ${formData.frequency}\nStart Date: ${formData.startDate}` : ''}`);

    // Reset and close
    setFormData({ fromAccount: '', toAccount: '', amount: '', frequency: 'monthly', startDate: '' });
    onClose();
  };

  const getToAccountOptions = () => {
    // Filter out debit card from "to" options
    return accountOptions.filter(option => option.value !== 'debit-card');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-morphism rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gradient">Transfer Funds</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Transfer Type Tabs */}
        <div className="flex gap-2 mb-6 p-1 glass-morphism rounded-xl">
          <button
            onClick={() => setTransferType('one-time')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              transferType === 'one-time'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              One-Time
            </div>
          </button>
          <button
            onClick={() => setTransferType('recurring')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              transferType === 'recurring'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Repeat className="w-4 h-4" />
              Recurring
            </div>
          </button>
          <button
            onClick={() => setTransferType('wire')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              transferType === 'wire'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            disabled
          >
            <div className="flex items-center justify-center gap-2">
              Wire Transfer
              <span className="text-xs">(Coming Soon)</span>
            </div>
          </button>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* From Account */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Transfer From <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.fromAccount}
              onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-blue-500 outline-none transition-all"
              style={{ color: 'var(--text-primary)' }}
              required
            >
              <option value="">Select account</option>
              {accountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Transfer To <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.toAccount}
              onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-blue-500 outline-none transition-all"
              style={{ color: 'var(--text-primary)' }}
              required
            >
              <option value="">Select account</option>
              {getToAccountOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Note: Cannot transfer to debit card
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: 'var(--text-tertiary)' }}>
                $
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-blue-500 outline-none transition-all"
                style={{ color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          {/* Recurring Transfer Fields */}
          {transferType === 'recurring' && (
            <>
              {/* Frequency */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Transfer Frequency <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-blue-500 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  required
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Start Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-morphism border-2 border-transparent focus:border-blue-500 outline-none transition-all"
                    style={{ color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  First transfer will occur on this date
                </p>
              </div>
            </>
          )}

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
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {transferType === 'one-time' ? 'Transfer Now' : 'Schedule Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
