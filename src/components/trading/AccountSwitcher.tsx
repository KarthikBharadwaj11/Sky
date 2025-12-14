'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface AccountSwitcherProps {
  className?: string;
}

export default function AccountSwitcher({ className = '' }: AccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('margin');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock accounts data
  const accounts: Account[] = [
    { id: 'margin', name: 'Margin Account', type: 'Margin', balance: 25840.75 },
    { id: 'individual', name: 'Individual Account', type: 'Individual', balance: 15420.50 },
    { id: 'ira-trad', name: 'Traditional IRA', type: 'IRA', balance: 48230.25 },
    { id: 'ira-roth', name: 'Roth IRA', type: 'IRA', balance: 32180.90 },
  ];

  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccount(accountId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl glass-morphism border-2 border-blue-500/30 hover:border-blue-500/50 hover:bg-white/5 transition-all shadow-lg"
      >
        <div className="flex flex-col items-start">
          <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {currentAccount.name}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            ${currentAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-secondary)' }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-morphism rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSelectAccount(account.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {account.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: 'var(--glass-bg)',
                      color: 'var(--text-tertiary)'
                    }}>
                      {account.type}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {selectedAccount === account.id && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
