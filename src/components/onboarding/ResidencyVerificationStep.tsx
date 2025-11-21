'use client';

import { useState } from 'react';
import { Check, Upload } from 'lucide-react';

interface ResidencyVerificationStepProps {
  data: any;
  onComplete: (stepData: any) => void;
  previewMode?: boolean;
}

export default function ResidencyVerificationStep({ data, onComplete, previewMode = false }: ResidencyVerificationStepProps) {
  const [formData, setFormData] = useState({
    residencyStatus: data.residencyStatus || '',
    ssn: data.ssn || '',
    idType: data.idType || '',
    idDocument: data.idDocument || null
  });
  const [errors, setErrors] = useState<any>({});
  const [dragActive, setDragActive] = useState(false);

  const residencyOptions = [
    { value: 'citizen', label: 'US Citizen', description: 'Born in the US or naturalized citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident', description: 'Lawful permanent resident with green card' },
    { value: 'non_us_citizen', label: 'Non US-Citizen', description: 'Authorized resident' }
  ];

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'state_id', label: 'State ID Card' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete(formData);
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

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    }
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    handleInputChange('ssn', formatted);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        idDocument: 'Please upload a JPEG, PNG, or PDF file'
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        idDocument: 'File size must be less than 5MB'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      idDocument: file
    }));

    if (errors.idDocument) {
      setErrors(prev => ({
        ...prev,
        idDocument: undefined
      }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            US Residency Status
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Please select your residency status and provide identity verification
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Residency Status */}
          <div>
            <label className="block text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
              US Residency Status *
            </label>
            <div className="space-y-2">
              {residencyOptions.map((option) => (
                <div key={option.value} className="relative">
                  <input
                    type="radio"
                    id={option.value}
                    name="residencyStatus"
                    value={option.value}
                    checked={formData.residencyStatus === option.value}
                    onChange={(e) => handleInputChange('residencyStatus', e.target.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={option.value}
                    className={`block p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      formData.residencyStatus === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    } ${errors.residencyStatus ? 'border-red-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {option.label}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {option.description}
                        </div>
                      </div>
                      {formData.residencyStatus === option.value && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {errors.residencyStatus && (
              <p className="text-red-400 text-sm mt-1">{errors.residencyStatus}</p>
            )}
          </div>

          {/* SSN */}
          <div>
            <label htmlFor="ssn" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Social Security Number (SSN) *
            </label>
            <input
              id="ssn"
              type="text"
              className={`form-input ${errors.ssn ? 'border-red-500' : ''}`}
              placeholder="XXX-XX-XXXX"
              value={formData.ssn}
              onChange={handleSSNChange}
              maxLength={11}
            />
            {errors.ssn && (
              <p className="text-red-400 text-sm mt-1">{errors.ssn}</p>
            )}
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              Your SSN is encrypted and used only for identity verification and tax reporting
            </p>
          </div>

          {/* ID Document Type */}
          <div>
            <label className="block text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
              ID Document Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {idTypes.map((type) => (
                <div key={type.value} className="relative">
                  <input
                    type="radio"
                    id={type.value}
                    name="idType"
                    value={type.value}
                    checked={formData.idType === type.value}
                    onChange={(e) => handleInputChange('idType', e.target.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={type.value}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                      formData.idType === type.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    } ${errors.idType ? 'border-red-500' : ''}`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {type.label}
                      </div>
                      {formData.idType === type.value && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {errors.idType && (
              <p className="text-red-400 text-sm mt-1">{errors.idType}</p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Upload ID Document *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-400/10'
                  : formData.idDocument
                  ? 'border-green-400 bg-green-400/10'
                  : errors.idDocument
                  ? 'border-red-400 bg-red-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="idDocument"
                className="sr-only"
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
              />

              {formData.idDocument ? (
                <div className="space-y-3">
                  <Check className="w-10 h-10 text-green-400 mx-auto" />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Document Uploaded
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formData.idDocument.name}
                    </div>
                  </div>
                  <label
                    htmlFor="idDocument"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors"
                    style={{ background: 'var(--glass-bg)', color: 'var(--text-accent)' }}
                  >
                    <Upload className="w-4 h-4" />
                    Change Document
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 mx-auto" style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <div className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Upload Your ID Document
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Drag and drop your document here, or click to browse
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                      Supports: JPEG, PNG, PDF • Max size: 5MB
                    </p>
                  </div>
                  <label
                    htmlFor="idDocument"
                    className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-md cursor-pointer transition-colors btn-secondary"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                </div>
              )}
            </div>
            {errors.idDocument && (
              <p className="text-red-400 text-sm mt-1">{errors.idDocument}</p>
            )}
          </div>

          {/* Security Notice */}
          <div className="glass-morphism p-4 rounded-lg">
            <div>
              <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Your Information is Secure
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                All personal information is encrypted using bank-level security. We comply with federal regulations and will never share your information without consent.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
