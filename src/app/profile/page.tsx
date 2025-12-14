'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { User, CreditCard, Settings, Gift, Share2, MapPin, Mail, Briefcase, DollarSign, Target, TrendingUp, Plus, X, Building2, PiggyBank, TrendingUpIcon, Activity, Copy, Check, Users, Bell, Moon, Sun, Lock, Globe, Eye, Download, Smartphone, Trash2, Edit, Star, Unlock, Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import TransferFundsModal from '@/components/accounts/TransferFundsModal';
import AddPaymentMethodModal, { BankAccountData, CardData } from '@/components/accounts/AddPaymentMethodModal';
import SubscriptionStep from '@/components/onboarding/SubscriptionStep';

interface Beneficiary {
  id: string;
  fullName: string;
  dateOfBirth: string;
  relationship: string;
}

interface Account {
  id: string;
  type: 'individual' | 'ira' | 'margin' | 'trust';
  subType?: 'traditional' | 'roth';
  accountNumber: string;
  createdAt: string;
  beneficiaries?: Beneficiary[];
  details: {
    fullName?: string;
    ssn?: string;
    dateOfBirth?: string;
    fundingSource?: string;
    initialDeposit?: string;
    employmentInfo?: string;
    incomeRange?: string;
    investmentExperience?: string;
    riskTolerance?: string;
    trustName?: string;
    trusteeInfo?: string;
  };
}

interface BankAccount {
  id: string;
  type: 'bank' | 'debit-card' | 'credit-card';
  bankName: string;
  accountNumber?: string;
  cardNumber?: string;
  accountType?: 'checking' | 'savings';
  cardNetwork?: 'visa' | 'mastercard' | 'amex' | 'discover';
  expiryDate?: string;
  isDefault: boolean;
  addedDate: string;
  balance?: number;
}

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  status: 'pending' | 'active' | 'rewarded';
  firstTradeDate?: string;
  rewardAmount?: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'settings' | 'refer' | 'shared-portfolio'>('profile');
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<'individual' | 'ira' | 'margin' | 'trust' | null>(null);
  const [selectedIRAType, setSelectedIRAType] = useState<'traditional' | 'roth' | null>(null);
  const [accountFormData, setAccountFormData] = useState<any>({});
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [currentBeneficiary, setCurrentBeneficiary] = useState({ fullName: '', dateOfBirth: '', relationship: '' });
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [marginAgreements, setMarginAgreements] = useState({ termsAccepted: false, riskDisclosureAccepted: false });
  const [referralCode, setReferralCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [accountSection, setAccountSection] = useState<'brokerage' | 'bank'>('brokerage');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Shared Portfolio state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [sharedMembers, setSharedMembers] = useState<any[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<any[]>([]);
  const [memberFormData, setMemberFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    relationship: '',
    otherRelationship: '',
    accessLevel: '' as 'view-only' | 'full-access' | ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    theme: 'dark' as 'light' | 'dark',
    notifications: {
      email: true,
      push: true,
      sms: false,
      trades: true,
      priceAlerts: true,
      news: false,
      copyTrading: true
    },
    privacy: {
      profileVisible: true,
      showPortfolio: false,
      activityVisible: true
    },
    language: 'en',
    currency: 'USD',
    twoFactorAuth: false
  });

  useEffect(() => {
    if (user) {
      // Load onboarding data from localStorage
      const storedData = localStorage.getItem(`onboarding_${user.id}`);
      if (storedData) {
        setOnboardingData(JSON.parse(storedData));
      }
      // Load accounts
      const storedAccounts = localStorage.getItem(`accounts_${user.id}`);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      } else {
        // Generate demo brokerage accounts
        const demoAccounts: Account[] = [
          {
            id: 'account-1',
            type: 'brokerage',
            accountNumber: '987654321',
            balance: 25840.75,
            status: 'active',
            openedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            details: {
              accountType: 'Individual Account',
              marginEnabled: false,
              cashBalance: 5420.50,
              buyingPower: 5420.50
            }
          },
          {
            id: 'account-2',
            type: 'margin',
            accountNumber: '987654322',
            balance: 48200.30,
            status: 'active',
            openedDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            details: {
              accountType: 'Margin Account',
              marginEnabled: true,
              cashBalance: 12050.00,
              buyingPower: 24100.00,
              marginUsed: 8150.30
            }
          },
          {
            id: 'account-3',
            type: 'traditional-ira',
            accountNumber: '987654323',
            balance: 72500.00,
            status: 'active',
            openedDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
            details: {
              accountType: 'Traditional IRA',
              marginEnabled: false,
              cashBalance: 2500.00,
              buyingPower: 2500.00,
              contributionYear: 2024,
              contributionLimit: 7000
            }
          },
          {
            id: 'account-4',
            type: 'roth-ira',
            accountNumber: '987654324',
            balance: 34200.50,
            status: 'active',
            openedDate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
            details: {
              accountType: 'Roth IRA',
              marginEnabled: false,
              cashBalance: 1200.50,
              buyingPower: 1200.50,
              contributionYear: 2024,
              contributionLimit: 7000
            }
          }
        ];
        setAccounts(demoAccounts);
        localStorage.setItem(`accounts_${user.id}`, JSON.stringify(demoAccounts));
      }
      // Load bank accounts
      const storedBankAccounts = localStorage.getItem(`bankAccounts_${user.id}`);
      if (storedBankAccounts) {
        setBankAccounts(JSON.parse(storedBankAccounts));
      } else {
        // Generate demo bank accounts
        const demoBankAccounts: BankAccount[] = [
          {
            id: 'bank-1',
            type: 'bank',
            bankName: 'Chase Bank',
            accountNumber: '****1234',
            accountType: 'checking',
            isDefault: true,
            addedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            balance: 5420.50
          },
          {
            id: 'card-1',
            type: 'debit-card',
            bankName: 'Bank of America',
            cardNumber: '****5678',
            cardNetwork: 'visa',
            expiryDate: '12/26',
            isDefault: false,
            addedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setBankAccounts(demoBankAccounts);
        localStorage.setItem(`bankAccounts_${user.id}`, JSON.stringify(demoBankAccounts));
      }
      // Generate or load referral code
      const storedReferralCode = localStorage.getItem(`referralCode_${user.id}`);
      if (storedReferralCode) {
        setReferralCode(storedReferralCode);
      } else {
        const newCode = generateReferralCode(user.username);
        setReferralCode(newCode);
        localStorage.setItem(`referralCode_${user.id}`, newCode);
      }
      // Load referred users
      const storedReferrals = localStorage.getItem(`referrals_${user.id}`);
      if (storedReferrals) {
        setReferredUsers(JSON.parse(storedReferrals));
      } else {
        // Generate mock referrals for demo
        const mockReferrals = generateMockReferrals();
        setReferredUsers(mockReferrals);
        localStorage.setItem(`referrals_${user.id}`, JSON.stringify(mockReferrals));
      }
      // Load settings
      const storedSettings = localStorage.getItem(`settings_${user.id}`);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    }
  }, [user]);

  // Save settings whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
    }
  }, [settings, user]);

  // Initialize shared portfolio dummy data
  useEffect(() => {
    // Dummy data: People I've shared my portfolio with
    setSharedMembers([
      {
        id: '1',
        fullName: 'Tony Stark',
        email: 'tony.stark@starkindustries.com',
        phone: '+1 (555) 123-4567',
        relationship: 'Father',
        accessLevel: 'view-only',
        addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: '2',
        fullName: 'Hermione Granger',
        email: 'hermione.granger@hogwarts.edu',
        phone: '+1 (555) 987-6543',
        relationship: 'Trading Advisor',
        accessLevel: 'full-access',
        addedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastAccessed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ]);

    // Dummy data: People who have shared their portfolio with me
    setSharedWithMe([
      {
        id: '3',
        ownerName: 'Natasha Romanoff',
        ownerEmail: 'natasha.romanoff@shield.gov',
        relationship: 'Spouse',
        accessLevel: 'full-access',
        sharedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        portfolioValue: 125430.50,
        portfolioReturn: 12.5
      },
      {
        id: '4',
        ownerName: 'Harry Potter',
        ownerEmail: 'harry.potter@hogwarts.edu',
        relationship: 'Son',
        accessLevel: 'view-only',
        sharedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        portfolioValue: 45200.25,
        portfolioReturn: -3.2
      }
    ]);
  }, []);

  const generateReferralCode = (username: string) => {
    const prefix = username.substring(0, 3).toUpperCase();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomChars}`;
  };

  const generateMockReferrals = (): ReferredUser[] => {
    return [
      {
        id: '1',
        name: 'Steve Rogers',
        email: 'steve.rogers@avengers.com',
        joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'rewarded',
        firstTradeDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        rewardAmount: 50
      },
      {
        id: '2',
        name: 'Luna Lovegood',
        email: 'luna.lovegood@ravenclaw.edu',
        joinedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'rewarded',
        firstTradeDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        rewardAmount: 50
      },
      {
        id: '3',
        name: 'Peter Parker',
        email: 'peter.parker@dailybugle.com',
        joinedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        firstTradeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        rewardAmount: 50
      },
      {
        id: '4',
        name: 'Ron Weasley',
        email: 'ron.weasley@hogwarts.edu',
        joinedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ];
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const generateAccountNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
  };

  const handleAddBeneficiary = () => {
    if (!currentBeneficiary.fullName || !currentBeneficiary.dateOfBirth || !currentBeneficiary.relationship) {
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      ...currentBeneficiary
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setCurrentBeneficiary({ fullName: '', dateOfBirth: '', relationship: '' });
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const handleAddAccount = () => {
    if (!selectedAccountType) return;

    const newAccount: Account = {
      id: Date.now().toString(),
      type: selectedAccountType,
      subType: selectedAccountType === 'ira' ? selectedIRAType || undefined : undefined,
      accountNumber: generateAccountNumber(),
      createdAt: new Date().toISOString(),
      beneficiaries: selectedAccountType === 'ira' ? beneficiaries : undefined,
      details: accountFormData
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);

    if (user) {
      localStorage.setItem(`accounts_${user.id}`, JSON.stringify(updatedAccounts));
    }

    // Reset form
    setShowAddAccountModal(false);
    setSelectedAccountType(null);
    setSelectedIRAType(null);
    setAccountFormData({});
    setBeneficiaries([]);
    setCurrentBeneficiary({ fullName: '', dateOfBirth: '', relationship: '' });
  };

  const closeModal = () => {
    setShowAddAccountModal(false);
    setSelectedAccountType(null);
    setSelectedIRAType(null);
    setAccountFormData({});
    setBeneficiaries([]);
    setCurrentBeneficiary({ fullName: '', dateOfBirth: '', relationship: '' });
    setMarginAgreements({ termsAccepted: false, riskDisclosureAccepted: false });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-lg font-bold text-gradient mb-4">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information'
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      description: 'Manage your accounts'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App preferences'
    },
    {
      id: 'refer',
      label: 'Refer',
      icon: Gift,
      description: 'Invite friends'
    },
    {
      id: 'shared-portfolio',
      label: 'Shared Portfolio',
      icon: Share2,
      description: 'Portfolio sharing'
    }
  ];

  const renderProfile = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-bold text-gradient">Personal Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Basic Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Full Name</label>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {onboardingData?.fullName || user.username}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Username</label>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {user.username}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Date of Birth</label>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {onboardingData?.dateOfBirth || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Contact Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Email</label>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {onboardingData?.email || user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Mobile Number</label>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {onboardingData?.mobile || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-morphism p-4 rounded-xl md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Address</h3>
              </div>
              {onboardingData?.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Street Address</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.address.street}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>City</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.address.city}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>State</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.address.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>ZIP Code</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.address.zipCode}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Country</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.address.country}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No address information available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      {onboardingData?.employmentStatus && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold text-gradient">Professional Information</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Employment</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Employment Status</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.employmentStatus}
                    </p>
                  </div>
                  {onboardingData.employerName && (
                    <div>
                      <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Employer</label>
                      <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {onboardingData.employerName}
                      </p>
                    </div>
                  )}
                  {onboardingData.positionOrOccupation && (
                    <div>
                      <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Position</label>
                      <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {onboardingData.positionOrOccupation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {onboardingData.monthlyIncome && (
                <div className="glass-morphism p-4 rounded-xl">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Income</h3>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Monthly Income Range</label>
                    <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.monthlyIncome}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Investment Information */}
      {(onboardingData?.investmentGoals || onboardingData?.riskTolerance) && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold text-gradient">Investment Profile</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onboardingData.investmentGoals && (
                <div className="glass-morphism p-4 rounded-xl">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Investment Goals</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(onboardingData.investmentGoals) && onboardingData.investmentGoals.map((goal: string, index: number) => (
                      <span key={index} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        background: 'var(--gradient-secondary)',
                        color: 'var(--text-primary)'
                      }}>
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {onboardingData.riskTolerance && (
                <div className="glass-morphism p-4 rounded-xl">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Risk Tolerance</h3>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {onboardingData.riskTolerance}
                    </p>
                  </div>
                </div>
              )}

              {onboardingData.sourceOfFunds && Array.isArray(onboardingData.sourceOfFunds) && onboardingData.sourceOfFunds.length > 0 && (
                <div className="glass-morphism p-4 rounded-xl md:col-span-2">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Source of Funds</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {onboardingData.sourceOfFunds.map((source: string, index: number) => (
                      <span key={index} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        background: 'var(--gradient-secondary)',
                        color: 'var(--text-primary)'
                      }}>
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const getAccountTypeLabel = (account: Account) => {
    if (account.type === 'ira') {
      return `IRA - ${account.subType === 'traditional' ? 'Traditional' : 'Roth'}`;
    }
    return account.type.charAt(0).toUpperCase() + account.type.slice(1);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return Building2;
      case 'ira':
        return PiggyBank;
      case 'margin':
        return TrendingUpIcon;
      default:
        return CreditCard;
    }
  };

  const renderAccountSummary = (account: Account) => {
    // Portfolio composition data
    const portfolioData = [
      { name: 'Stocks', value: 6000, color: '#3b82f6' },
      { name: 'ETFs', value: 3000, color: '#10b981' },
      { name: 'Options', value: 1000, color: '#f59e0b' }
    ];

    return (
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Account Balance</h4>
            <p className="text-lg font-bold text-green-400">$10,000.00</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Available to trade</p>
          </div>
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Total Return</h4>
            <p className="text-lg font-bold text-green-400">+$543.21</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>+5.43%</p>
          </div>
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Account Type</h4>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{getAccountTypeLabel(account)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>#{account.accountNumber}</p>
          </div>
        </div>

        {/* Portfolio Composition and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Portfolio Composition</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {portfolioData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Account Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Opened</p>
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </div>
              {account.details.fundingSource && (
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Funding Source</p>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {account.details.fundingSource.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                </div>
              )}
              {account.beneficiaries && account.beneficiaries.length > 0 && (
                <div>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Beneficiaries</p>
                  <div className="space-y-2">
                    {account.beneficiaries.map((ben) => (
                      <div key={ben.id} className="p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ben.fullName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {ben.relationship} • DOB: {new Date(ben.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactions = () => (
    <div className="glass-morphism p-4 rounded-xl">
      <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h4>
      <div className="text-center py-10">
        <Activity className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Transactions Yet</p>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Your transaction history will appear here</p>
      </div>
    </div>
  );

  const renderIRAContributions = () => (
    <div className="glass-morphism p-4 rounded-xl">
      <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>IRA Contributions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-morphism p-4 rounded-xl">
          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>2025 Contributions</h5>
          <p className="text-lg font-bold text-green-400">$0</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Limit: $7,000</p>
        </div>
        <div className="glass-morphism p-4 rounded-xl">
          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Remaining</h5>
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>$7,000</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Available to contribute</p>
        </div>
      </div>
      <div className="text-center py-6">
        <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>No contributions made yet</p>
        <button className="btn-primary px-4 py-2.5">Make a Contribution</button>
      </div>
    </div>
  );

  const renderAccounts = () => {
    // If an account is selected, show detailed view
    if (selectedAccount) {
      return (
        <div className="space-y-4">
          {/* Back button and account header */}
          <div className="card">
            <div className="card-body">
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-sm hover:underline mb-3 flex items-center gap-2"
                style={{ color: 'var(--text-accent)' }}
              >
                ← Back to all accounts
              </button>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = getAccountIcon(selectedAccount.type);
                    return (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-lg font-bold text-gradient">{getAccountTypeLabel(selectedAccount)}</h2>
                    <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>Account #{selectedAccount.accountNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4" />
                  Transfer Funds
                </button>
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="card">
            <div className="card-body">
              {renderAccountSummary(selectedAccount)}
            </div>
          </div>

          {/* Transactions */}
          <div className="card">
            <div className="card-body">
              {renderTransactions()}
            </div>
          </div>

          {/* IRA Contributions - Only for IRA accounts */}
          {selectedAccount.type === 'ira' && (
            <div className="card">
              <div className="card-body">
                {renderIRAContributions()}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Otherwise show account list
    return (
      <div className="space-y-4">
        {/* Account Type Tabs */}
        <div className="flex gap-2 p-1 glass-morphism rounded-xl max-w-md">
          <button
            onClick={() => setAccountSection('brokerage')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              accountSection === 'brokerage'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Individual Accounts
          </button>
          <button
            onClick={() => setAccountSection('bank')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              accountSection === 'bank'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bank Accounts
          </button>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-bold text-gradient">
              {accountSection === 'brokerage' ? 'Individual Accounts' : 'Bank Accounts'}
            </h2>
            {accountSection === 'brokerage' && (
              <button
                onClick={() => setShowAddAccountModal(true)}
                className="btn-primary px-4 py-2.5 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Individual Account
              </button>
            )}
          </div>
          <div className="card-body">
            {/* Brokerage Accounts Section */}
            {accountSection === 'brokerage' && (
              <>
                {accounts.length === 0 ? (
                  <div className="text-center py-10">
                    <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      No Brokerage Accounts Yet
                    </p>
                    <p className="text-lg mb-4" style={{ color: 'var(--text-tertiary)' }}>
                      Add your first brokerage account to start trading
                    </p>
                    <button
                      onClick={() => setShowAddAccountModal(true)}
                      className="btn-primary px-6 py-2.5 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Account
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts.map((account) => {
                  const Icon = getAccountIcon(account.type);
                  return (
                    <div
                      key={account.id}
                      className="glass-morphism p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                              {getAccountTypeLabel(account)}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              Account #{account.accountNumber}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                          Active
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Balance</span>
                          <span className="text-sm font-semibold text-green-400">$10,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Opened</span>
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {new Date(account.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAccount(account)}
                        className="mx-auto px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        View Details
                      </button>
                    </div>
                  );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Bank Accounts Section */}
            {accountSection === 'bank' && (
              <>
                {bankAccounts.length === 0 ? (
                  <div className="text-center py-10">
                    <CreditCard className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      No Bank Accounts Yet
                    </p>
                    <p className="text-lg mb-4" style={{ color: 'var(--text-tertiary)' }}>
                      Add your bank account or card to fund your brokerage accounts
                    </p>
                    <button
                      onClick={() => setShowAddBankAccountModal(true)}
                      className="btn-primary px-6 py-2.5 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Bank Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Bank Accounts Subsection */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          Bank Accounts
                        </h3>
                        <button
                          onClick={() => setShowAddBankAccountModal(true)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Bank Account
                        </button>
                      </div>

                      {bankAccounts.filter(acc => acc.type === 'bank').length === 0 ? (
                        <div className="glass-morphism p-6 rounded-xl text-center">
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            No bank accounts linked yet
                          </p>
                        </div>
                      ) : (
                        <div className="glass-morphism rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  BANK
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  ACCOUNT TYPE
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  ACCOUNT NUMBER
                                </th>
                                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  BALANCE
                                </th>
                                <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {bankAccounts.filter(acc => acc.type === 'bank').map((bankAccount) => (
                                <tr
                                  key={bankAccount.id}
                                  className="transition-all duration-300 hover:bg-white/5"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600">
                                        <Building2 className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                          {bankAccount.bankName}
                                        </p>
                                        {bankAccount.isDefault && (
                                          <span className="text-xs text-blue-400">Default</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      {bankAccount.accountType?.charAt(0).toUpperCase() + bankAccount.accountType?.slice(1)}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                                      {bankAccount.accountNumber}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <p className="text-sm font-bold text-green-400">
                                      ${bankAccount.balance !== undefined ? bankAccount.balance.toFixed(2) : '0.00'}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                      {!bankAccount.isDefault && (
                                        <button
                                          onClick={() => {
                                            const updated = bankAccounts.map(acc => ({
                                              ...acc,
                                              isDefault: acc.id === bankAccount.id && acc.type === 'bank'
                                            }));
                                            setBankAccounts(updated);
                                            localStorage.setItem('bankAccounts', JSON.stringify(updated));
                                          }}
                                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                          title="Set as default"
                                        >
                                          <Star className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          // Edit functionality - placeholder for now
                                          alert('Edit functionality coming soon');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to remove ${bankAccount.bankName}?`)) {
                                            const updated = bankAccounts.filter(acc => acc.id !== bankAccount.id);
                                            setBankAccounts(updated);
                                            localStorage.setItem('bankAccounts', JSON.stringify(updated));
                                          }
                                        }}
                                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Cards Subsection */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          Cards
                        </h3>
                        <button
                          onClick={() => setShowAddBankAccountModal(true)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Card
                        </button>
                      </div>

                      {bankAccounts.filter(acc => acc.type === 'debit-card' || acc.type === 'credit-card').length === 0 ? (
                        <div className="glass-morphism p-6 rounded-xl text-center">
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            No cards linked yet
                          </p>
                        </div>
                      ) : (
                        <div className="glass-morphism rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  CARD
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  TYPE
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  CARD NUMBER
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  EXPIRY
                                </th>
                                <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {bankAccounts.filter(acc => acc.type === 'debit-card' || acc.type === 'credit-card').map((card) => (
                                <tr
                                  key={card.id}
                                  className="transition-all duration-300 hover:bg-white/5"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
                                        <CreditCard className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                          {card.bankName}
                                        </p>
                                        {card.isDefault && (
                                          <span className="text-xs text-blue-400">Default</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      {card.cardNetwork?.toUpperCase()} {card.type === 'debit-card' ? 'Debit' : 'Credit'}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                                      {card.cardNumber}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      {card.expiryDate || 'N/A'}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                      {!card.isDefault && (
                                        <button
                                          onClick={() => {
                                            const updated = bankAccounts.map(acc => ({
                                              ...acc,
                                              isDefault: acc.id === card.id && (acc.type === 'debit-card' || acc.type === 'credit-card')
                                            }));
                                            setBankAccounts(updated);
                                            localStorage.setItem('bankAccounts', JSON.stringify(updated));
                                          }}
                                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                          title="Set as default"
                                        >
                                          <Star className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          // Edit functionality - placeholder for now
                                          alert('Edit functionality coming soon');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to remove this card ending in ${card.cardNumber?.slice(-4)}?`)) {
                                            const updated = bankAccounts.filter(acc => acc.id !== card.id);
                                            setBankAccounts(updated);
                                            localStorage.setItem('bankAccounts', JSON.stringify(updated));
                                          }
                                        }}
                                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add Account Modal */}
        {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-morphism rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gradient">Add New Account</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {!selectedAccountType ? (
              <div className="space-y-3">
                <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Select the type of account you want to create:
                </p>

                <button
                  onClick={() => setSelectedAccountType('individual')}
                  className="w-full glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Individual Account
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        Standard individual account for individuals with no tax advantages
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAccountType('ira')}
                  className="w-full glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        IRA Account
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        Tax-advantaged retirement account (Traditional or Roth)
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAccountType('margin')}
                  className="w-full glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUpIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Margin Account
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        Borrow money to invest with leverage (requires approval)
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Back button */}
                <button
                  onClick={() => {
                    setSelectedAccountType(null);
                    setSelectedIRAType(null);
                    setAccountFormData({});
                  }}
                  className="text-sm hover:underline" style={{ color: 'var(--text-accent)' }}
                >
                  ← Back to account types
                </button>

                {/* IRA Type Selection */}
                {selectedAccountType === 'ira' && !selectedIRAType && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Select IRA Type
                    </h3>

                    <button
                      onClick={() => setSelectedIRAType('traditional')}
                      className="w-full glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-300 text-left"
                    >
                      <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Traditional IRA
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        Tax-deductible contributions, taxed on withdrawal in retirement
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedIRAType('roth')}
                      className="w-full glass-morphism p-4 rounded-xl hover:bg-white/5 transition-all duration-300 text-left"
                    >
                      <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Roth IRA
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        After-tax contributions, tax-free withdrawals in retirement
                      </p>
                    </button>
                  </div>
                )}

                {/* Account Form */}
                {(selectedAccountType !== 'ira' || selectedIRAType) && (
                  <>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {selectedAccountType === 'ira'
                        ? `${selectedIRAType === 'traditional' ? 'Traditional' : 'Roth'} IRA Account Details`
                        : `${selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1)} Account Details`
                      }
                    </h3>

                    <div className="space-y-3">
                      {/* IRA Account - Only DOB and Funding Source */}
                      {selectedAccountType === 'ira' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              className="form-input"
                              value={accountFormData.dateOfBirth || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, dateOfBirth: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Funding Source *
                            </label>
                            <select
                              required
                              className="form-input"
                              value={accountFormData.fundingSource || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, fundingSource: e.target.value })}
                            >
                              <option value="">Select funding source</option>
                              <option value="bank-transfer">Bank Transfer</option>
                              <option value="wire-transfer">Wire Transfer</option>
                              <option value="check">Check</option>
                              <option value="rollover">IRA Rollover</option>
                            </select>
                          </div>

                          {/* Beneficiaries Section */}
                          <div className="glass-morphism p-4 rounded-xl mt-6">
                            <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                              Beneficiaries
                            </h4>
                            <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>
                              Add beneficiaries who will inherit this IRA account
                            </p>

                            {/* Current Beneficiaries List */}
                            {beneficiaries.length > 0 && (
                              <div className="space-y-2 mb-3">
                                {beneficiaries.map((beneficiary) => (
                                  <div key={beneficiary.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                                    <div>
                                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {beneficiary.fullName}
                                      </p>
                                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                        {beneficiary.relationship} • DOB: {new Date(beneficiary.dateOfBirth).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => removeBeneficiary(beneficiary.id)}
                                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4 text-red-400" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Beneficiary Form */}
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={currentBeneficiary.fullName}
                                  onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, fullName: e.target.value })}
                                  placeholder="Beneficiary's full name"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                  Date of Birth
                                </label>
                                <input
                                  type="date"
                                  className="form-input"
                                  value={currentBeneficiary.dateOfBirth}
                                  onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, dateOfBirth: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                  Relationship
                                </label>
                                <select
                                  className="form-input"
                                  value={currentBeneficiary.relationship}
                                  onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, relationship: e.target.value })}
                                >
                                  <option value="">Select relationship</option>
                                  <option value="spouse">Spouse</option>
                                  <option value="child">Child</option>
                                  <option value="parent">Parent</option>
                                  <option value="sibling">Sibling</option>
                                  <option value="other-family">Other Family Member</option>
                                  <option value="trust">Trust</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <button
                                type="button"
                                onClick={handleAddBeneficiary}
                                className="w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                style={{
                                  background: 'var(--gradient-secondary)',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                <Plus className="w-4 h-4" />
                                Add Beneficiary
                              </button>
                            </div>
                          </div>
                        </>
                      ) : selectedAccountType === 'margin' ? (
                        /* Margin Account - Only Agreements */
                        <>
                          <div className="glass-morphism p-4 rounded-xl space-y-6">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              We'll use the information from your onboarding to set up your margin account. Please review and accept the following agreements:
                            </p>

                            <div className="space-y-3">
                              <div className="glass-morphism p-4 rounded-xl">
                                <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                  Margin Trading Agreement
                                </h4>
                                <div className="max-h-48 overflow-y-auto p-4 rounded-lg mb-3" style={{ background: 'var(--glass-bg)' }}>
                                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                                    By opening a margin account, you understand and agree that:
                                  </p>
                                  <ul className="text-sm space-y-2 list-disc list-inside" style={{ color: 'var(--text-tertiary)' }}>
                                    <li>You can lose more money than you deposit in the margin account</li>
                                    <li>The firm can force the sale of securities or other assets in your account</li>
                                    <li>The firm can sell your securities or other assets without contacting you</li>
                                    <li>You are not entitled to choose which securities or other assets are liquidated</li>
                                    <li>The firm can increase its "house" maintenance margin requirements at any time</li>
                                    <li>You are not entitled to an extension of time on a margin call</li>
                                  </ul>
                                </div>
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={marginAgreements.termsAccepted}
                                    onChange={(e) => setMarginAgreements({ ...marginAgreements, termsAccepted: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-2"
                                    style={{ borderColor: 'var(--glass-border)' }}
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                    I have read and agree to the Margin Trading Agreement *
                                  </span>
                                </label>
                              </div>

                              <div className="glass-morphism p-4 rounded-xl">
                                <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                  Risk Disclosure Statement
                                </h4>
                                <div className="max-h-48 overflow-y-auto p-4 rounded-lg mb-3" style={{ background: 'var(--glass-bg)' }}>
                                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                                    Trading on margin involves significant risks, including:
                                  </p>
                                  <ul className="text-sm space-y-2 list-disc list-inside" style={{ color: 'var(--text-tertiary)' }}>
                                    <li>Risk of losing more than your initial investment</li>
                                    <li>Interest charges on borrowed funds</li>
                                    <li>Potential for forced liquidation during market volatility</li>
                                    <li>Amplified gains and losses compared to non-margin trading</li>
                                    <li>Margin calls requiring immediate deposit of additional funds</li>
                                  </ul>
                                  <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                                    Margin trading is not suitable for all investors. You should carefully consider your financial situation and risk tolerance before trading on margin.
                                  </p>
                                </div>
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={marginAgreements.riskDisclosureAccepted}
                                    onChange={(e) => setMarginAgreements({ ...marginAgreements, riskDisclosureAccepted: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-2"
                                    style={{ borderColor: 'var(--glass-border)' }}
                                  />
                                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                    I have read and understand the Risk Disclosure Statement *
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Individual Account Form */
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Full Legal Name *
                            </label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={accountFormData.fullName || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, fullName: e.target.value })}
                              placeholder="Enter your full legal name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Social Security Number *
                            </label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={accountFormData.ssn || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, ssn: e.target.value })}
                              placeholder="XXX-XX-XXXX"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              className="form-input"
                              value={accountFormData.dateOfBirth || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, dateOfBirth: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Employment Information *
                            </label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={accountFormData.employmentInfo || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, employmentInfo: e.target.value })}
                              placeholder="Employer name and position"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Annual Income Range *
                            </label>
                            <select
                              required
                              className="form-input"
                              value={accountFormData.incomeRange || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, incomeRange: e.target.value })}
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
                              Investment Experience *
                            </label>
                            <select
                              required
                              className="form-input"
                              value={accountFormData.investmentExperience || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, investmentExperience: e.target.value })}
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
                              Initial Deposit Amount *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              className="form-input"
                              value={accountFormData.initialDeposit || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, initialDeposit: e.target.value })}
                              placeholder="Minimum $500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Funding Source *
                            </label>
                            <select
                              required
                              className="form-input"
                              value={accountFormData.fundingSource || ''}
                              onChange={(e) => setAccountFormData({ ...accountFormData, fundingSource: e.target.value })}
                            >
                              <option value="">Select funding source</option>
                              <option value="bank-transfer">Bank Transfer</option>
                              <option value="wire-transfer">Wire Transfer</option>
                              <option value="check">Check</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={handleAddAccount}
                        disabled={selectedAccountType === 'margin' && (!marginAgreements.termsAccepted || !marginAgreements.riskDisclosureAccepted)}
                        className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Account
                      </button>
                      <button
                        onClick={closeModal}
                        className="flex-1 glass-morphism py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Appearance Section */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Theme</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Choose your preferred color scheme</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings('theme', 'light')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  settings.theme === 'light'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'glass-morphism'
                }`}
                style={settings.theme !== 'light' ? { color: 'var(--text-secondary)' } : {}}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => updateSettings('theme', 'dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  settings.theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'glass-morphism'
                }`}
                style={settings.theme !== 'dark' ? { color: 'var(--text-secondary)' } : {}}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Lock className="w-5 h-5" />
            Security
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          <div className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => updateSettings('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>
          {settings.twoFactorAuth && (
            <div className="px-6 py-3 bg-green-500/10">
              <p className="text-sm text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Two-factor authentication is enabled
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {/* Notification Channels */}
          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Email Notifications</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => updateSettings('notifications.email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Bell className="w-5 h-5" style={{ color: 'var(--primary-purple)' }} />
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Push Notifications</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive browser push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => updateSettings('notifications.push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Smartphone className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>SMS Notifications</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive text messages for important alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => updateSettings('notifications.sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          {/* Notification Types */}
          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Trade Confirmations</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Get notified when trades execute</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.trades}
                onChange={(e) => updateSettings('notifications.trades', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Price Alerts</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Alerts when stocks hit your target prices</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.priceAlerts}
                onChange={(e) => updateSettings('notifications.priceAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Market News</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Breaking news and market updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.news}
                onChange={(e) => updateSettings('notifications.news', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>

          <div className="px-6 py-4 hover:bg-white/5 transition-all flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Copy Trading Updates</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>When traders you copy make moves</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.copyTrading}
                onChange={(e) => updateSettings('notifications.copyTrading', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Star className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            Subscription
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Current Plan</p>
            <p className="text-2xl font-bold text-gradient mb-2">Free</p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Upgrade to unlock premium features
            </p>
          </div>

          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="glass-morphism rounded-xl overflow-hidden border border-red-500/30">
        <div className="px-6 py-4 border-b border-red-500/30">
          <h3 className="text-base font-bold text-red-400">Account Deletion</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium mb-1 text-red-400">Delete Account</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRefer = () => {
    const totalReferred = referredUsers.length;
    const totalRewarded = referredUsers.filter(u => u.status === 'rewarded').length;
    const totalEarnings = referredUsers.filter(u => u.status === 'rewarded').reduce((sum, u) => sum + (u.rewardAmount || 0), 0);
    const pendingRewards = referredUsers.filter(u => u.status === 'pending' || u.status === 'active').length;

    return (
      <div className="space-y-4">
        {/* Header Card with Referral Code */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold text-gradient">Refer Friends & Earn</h2>
          </div>
          <div className="card-body">
            {/* Referral Code Section */}
            <div className="glass-morphism p-6 rounded-xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
                  Your Referral Code
                </h3>
                <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Share this code with friends and earn rewards together
                </p>

                {/* Referral Code Display */}
                <div className="flex items-center justify-center gap-2.5 max-w-md mx-auto">
                  <div className="flex-1 glass-morphism px-4 py-3 rounded-xl border-2 border-blue-500/30">
                    <p className="text-xl font-bold text-center tracking-wider" style={{ color: 'var(--primary-blue)' }}>
                      {referralCode}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <Users className="w-4 h-4" style={{ color: 'var(--primary-blue)' }} />
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Total Referrals</h4>
                </div>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{totalReferred}</p>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Rewarded</h4>
                </div>
                <p className="text-lg font-bold text-green-400">{totalRewarded}</p>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <DollarSign className="w-4 h-4" style={{ color: 'var(--primary-purple)' }} />
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Total Earned</h4>
                </div>
                <p className="text-lg font-bold" style={{ color: 'var(--primary-purple)' }}>${totalEarnings}</p>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Pending</h4>
                </div>
                <p className="text-lg font-bold text-yellow-400">{pendingRewards}</p>
              </div>
            </div>

            {/* How It Works */}
            <div className="glass-morphism p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Share Your Code
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Share your unique referral code with friends who want to start trading
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Friend Signs Up
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Your friend registers using your referral code and creates their account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Both Get Rewarded
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        After your friend completes their first trade, you both receive $50 reward credit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Details */}
              <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
                <div className="flex items-start gap-2.5">
                  <Gift className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold mb-2 text-green-400">Reward Details</h5>
                    <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>• You earn <strong className="text-green-400">$50</strong> when your friend completes their first trade</li>
                      <li>• Your friend also receives <strong className="text-green-400">$50</strong> credit after their first trade</li>
                      <li>• Rewards are credited to your account within 24-48 hours</li>
                      <li>• No limit on the number of friends you can refer</li>
                      <li>• Friend must be a new user and complete identity verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-bold text-gradient">Your Referrals ({totalReferred})</h3>
          </div>
          <div className="card-body">
            {referredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Email</th>
                      <th className="text-left">Joined Date</th>
                      <th className="text-left">First Trade</th>
                      <th className="text-left">Status</th>
                      <th className="text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referredUsers.map((referral) => (
                      <tr key={referral.id}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {referral.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {referral.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{referral.email}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(referral.joinedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {referral.firstTradeDate ? (
                            new Date(referral.firstTradeDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Not yet</span>
                          )}
                        </td>
                        <td>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            referral.status === 'rewarded' ? 'status-positive' :
                            referral.status === 'active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {referral.status === 'rewarded' ? 'Rewarded' :
                             referral.status === 'active' ? 'Active' : 'Pending Trade'}
                          </span>
                        </td>
                        <td className="text-right">
                          {referral.status === 'rewarded' ? (
                            <span className="text-base font-bold text-green-400">
                              +${referral.rewardAmount}
                            </span>
                          ) : referral.status === 'active' ? (
                            <span className="text-sm font-medium text-blue-400">
                              Processing...
                            </span>
                          ) : (
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No Referrals Yet
                </p>
                <p className="text-lg mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  Start sharing your referral code to earn rewards!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSharedPortfolio = () => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatLastAccessed = (dateString: string) => {
      const now = Date.now();
      const then = new Date(dateString).getTime();
      const diffInHours = Math.floor((now - then) / (1000 * 60 * 60));

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return formatDate(dateString);
    };

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Add Member Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 rounded-xl border" style={{ borderColor: 'var(--glass-border)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)' }}>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Shared Portfolio</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Manage who has access to your portfolio
            </p>
          </div>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {/* Section 1: Portfolio Shared By Me */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--glass-border)' }}>
            <Share2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Shared by Me
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--background-primary)', color: 'var(--text-tertiary)' }}>
              {sharedMembers.length}
            </span>
          </div>
          <div className="p-5">
            {sharedMembers.length > 0 ? (
              <div className="space-y-4">
                {sharedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-lg border hover:border-blue-500/40 transition-all group hover:shadow-lg hover:shadow-blue-500/10"
                    style={{
                      background: 'var(--background-primary)',
                      borderColor: 'var(--glass-border)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                          <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {member.fullName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                            {member.fullName}
                          </h4>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {member.relationship}
                          </p>
                        </div>
                      </div>

                      {member.accessLevel === 'view-only' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 flex items-center gap-1.5">
                          <Eye className="w-3 h-3" />
                          View Only
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 flex items-center gap-1.5">
                          <Unlock className="w-3 h-3" />
                          Full Access
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Mail className="w-3.5 h-3.5" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Phone className="w-3.5 h-3.5" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Last active {formatLastAccessed(member.lastAccessed)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Edit access">
                          <Edit className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Revoke access">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  No Members Added
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Click "Add Member" to share your portfolio
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Portfolios Shared With Me */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--glass-border)', background: 'var(--background-secondary)' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--glass-border)' }}>
            <Users className="w-4 h-4 text-green-400" />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Shared with Me
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--background-primary)', color: 'var(--text-tertiary)' }}>
              {sharedWithMe.length}
            </span>
          </div>
          <div className="p-5">
            {sharedWithMe.length > 0 ? (
              <div className="space-y-4">
                {sharedWithMe.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="p-4 rounded-lg border cursor-pointer hover:border-green-500/40 transition-all group hover:shadow-lg hover:shadow-green-500/10"
                    style={{
                      background: 'var(--background-primary)',
                      borderColor: 'var(--glass-border)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30">
                          <span className="bg-gradient-to-br from-green-400 to-blue-400 bg-clip-text text-transparent">
                            {portfolio.ownerName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                            {portfolio.ownerName}
                          </h4>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {portfolio.relationship}
                          </p>
                        </div>
                      </div>

                      {portfolio.accessLevel === 'view-only' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 flex items-center gap-1.5">
                          <Eye className="w-3 h-3" />
                          View Only
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 flex items-center gap-1.5">
                          <Unlock className="w-3 h-3" />
                          Full Access
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Value</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${portfolio.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Return</p>
                        <p className={`text-sm font-semibold ${portfolio.portfolioReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {portfolio.portfolioReturn >= 0 ? '+' : ''}{portfolio.portfolioReturn.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Shared</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {formatDate(portfolio.sharedDate)}
                        </p>
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-lg btn-primary text-sm group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all">
                      View Portfolio →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Share2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  No Shared Portfolios
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  No one has shared their portfolio with you yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-lg font-bold text-gradient">Add Family Member / Advisor</h3>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setMemberFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      relationship: '',
                      otherRelationship: '',
                      accessLevel: '' as 'view-only' | 'full-access' | ''
                    });
                  }}
                  className="p-1.5 rounded-lg glass-morphism hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="card-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Add the new member
                    const newMember = {
                      id: (sharedMembers.length + 1).toString(),
                      fullName: memberFormData.fullName,
                      email: memberFormData.email,
                      phone: memberFormData.phone,
                      relationship: memberFormData.relationship === 'other' ? memberFormData.otherRelationship : memberFormData.relationship,
                      accessLevel: memberFormData.accessLevel,
                      addedDate: new Date().toISOString(),
                      lastAccessed: new Date().toISOString(),
                      status: 'active'
                    };
                    setSharedMembers([...sharedMembers, newMember]);
                    setShowAddMemberModal(false);
                    setMemberFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      relationship: '',
                      otherRelationship: '',
                      accessLevel: '' as 'view-only' | 'full-access' | ''
                    });
                  }}
                  className="space-y-4"
                >
                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Relationship
                    </label>
                    <select
                      className="form-input"
                      value={memberFormData.relationship}
                      onChange={(e) => setMemberFormData({ ...memberFormData, relationship: e.target.value })}
                      required
                    >
                      <option value="">Select relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Trading Advisor">Trading Advisor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {memberFormData.relationship === 'other' && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Specify Relationship
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={memberFormData.otherRelationship}
                        onChange={(e) => setMemberFormData({ ...memberFormData, otherRelationship: e.target.value })}
                        placeholder="e.g., Brother, Financial Advisor"
                        required
                      />
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={memberFormData.fullName}
                      onChange={(e) => setMemberFormData({ ...memberFormData, fullName: e.target.value })}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={memberFormData.email}
                      onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={memberFormData.phone}
                      onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>

                  {/* Access Level */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Access Level
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMemberFormData({ ...memberFormData, accessLevel: 'view-only' })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          memberFormData.accessLevel === 'view-only'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>View Only</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Can view portfolio</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMemberFormData({ ...memberFormData, accessLevel: 'full-access' })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          memberFormData.accessLevel === 'full-access'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Unlock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Full Access</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Can view & trade</p>
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMemberModal(false);
                        setMemberFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          relationship: '',
                          otherRelationship: '',
                          accessLevel: '' as 'view-only' | 'full-access' | ''
                        });
                      }}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'accounts':
        return renderAccounts();
      case 'settings':
        return renderSettings();
      case 'refer':
        return renderRefer();
      case 'shared-portfolio':
        return renderSharedPortfolio();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="flex min-h-screen trading-background">
      {/* Left Sidebar - Fixed */}
      <div className="w-80 glass-morphism border-r border-white/10 p-5 fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gradient mb-1.5">Profile</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Manage your account and preferences
          </p>
        </div>

        <nav className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 glow-effect'
                    : 'glass-morphism hover:bg-white/5'
                }`}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-tertiary)' }}
                />
                <div className="text-left">
                  <p className={`font-medium text-sm ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={activeTab !== tab.id ? { color: 'var(--text-secondary)' } : {}}>
                    {tab.label}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tab.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Account Summary */}
        <div className="mt-6 space-y-3">
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Account Summary</h3>
          <div className="space-y-2.5">
            <div className="glass-morphism p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Cash Balance</span>
                <span className="font-bold text-base" style={{ color: 'var(--success)' }}>
                  ${user.balance.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="glass-morphism p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Account Type</span>
                <span className="font-bold text-xs" style={{ color: 'var(--text-accent)' }}>
                  {onboardingData?.accountType || 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-80 p-6">
        <div className="max-w-[90%] mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Transfer Funds Modal */}
      <TransferFundsModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddBankAccountModal}
        onClose={() => setShowAddBankAccountModal(false)}
        onAdd={(data) => {
          const newAccount = {
            id: `${data.type}-${Date.now()}`,
            ...data,
            addedDate: new Date().toISOString(),
            ...(data.type === 'bank' && { balance: 0 }),
          };

          const updatedAccounts = [...bankAccounts, newAccount];
          setBankAccounts(updatedAccounts);
          localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));

          alert(`${data.type === 'bank' ? 'Bank account' : 'Card'} added successfully!`);
        }}
      />

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="card max-w-6xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>

            <div className="card-body p-6">
              <SubscriptionStep
                onComplete={(data) => {
                  console.log('Subscription selected:', data);
                  setShowSubscriptionModal(false);
                  alert(`Successfully subscribed to ${data.subscription} plan!`);
                }}
                onSkip={() => setShowSubscriptionModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
