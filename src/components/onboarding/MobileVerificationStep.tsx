'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Shield } from 'lucide-react';

interface MobileVerificationStepProps {
  data: any;
  onComplete: (stepData: any) => void;
  previewMode?: boolean;
}

export default function MobileVerificationStep({ data, onComplete, previewMode = false }: MobileVerificationStepProps) {
  const [currentView, setCurrentView] = useState<'mobile' | 'otp'>('mobile');
  const [formData, setFormData] = useState({
    mobile: data.mobile || '',
    otp: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = () => {
    setCurrentView('otp');
  };

  const handleVerifyOtp = () => {
    onComplete({
      mobile: formData.mobile
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  return (
    <div className="card">
      <div className="card-body">
        {currentView === 'mobile' && (
          <>
            <div className="text-center mb-8">
              <Smartphone className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Verify Your Mobile Number
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                We'll send you a verification code to confirm your number
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Mobile Number *
                </label>
                <input
                  id="mobile"
                  type="tel"
                  className={`form-input ${errors.mobile ? 'border-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                />
                {errors.mobile && (
                  <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>
                )}
                <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Make sure you can receive SMS messages at this number
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full btn-primary py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
              >
                Send Verification Code
              </button>
            </div>
          </>
        )}

        {currentView === 'otp' && (
          <>
            <div className="text-center mb-8">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Enter Verification Code
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                We sent a 6-digit code to <strong>{formData.mobile}</strong>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Verification Code *
                </label>
                <input
                  id="otp"
                  type="text"
                  className={`form-input text-center text-2xl tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
                  placeholder="000000"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
                />
                {errors.otp && (
                  <p className="text-red-400 text-sm mt-1">{errors.otp}</p>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="text-sm hover:underline transition-colors disabled:opacity-50"
                  style={{ color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--text-accent)' }}
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full btn-primary py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
