'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  shortName: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop View - All steps in one line */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isUpcoming = step.id > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center relative">
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : isCurrent
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110'
                        : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Name */}
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'text-blue-400'
                          : isCompleted
                          ? 'text-green-400'
                          : 'text-gray-500'
                      }`}
                      style={{ maxWidth: '100px' }}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-6 relative">
                    <div className="absolute inset-0 bg-gray-700"></div>
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        step.id < currentStep ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                      style={{
                        width: step.id < currentStep ? '100%' : '0%',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile View - Current step with progress bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/50">
                {currentStep}
              </div>
              <div>
                <p className="text-xs text-gray-400">Step {currentStep} of {steps.length}</p>
                <p className="text-sm font-semibold text-blue-400">
                  {steps.find(s => s.id === currentStep)?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
