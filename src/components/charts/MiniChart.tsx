'use client';

import { useEffect, useState } from 'react';

interface MiniChartProps {
  symbol: string;
  trend: 'up' | 'down';
  className?: string;
}

export default function MiniChart({ symbol, trend, className = '' }: MiniChartProps) {
  const [points, setPoints] = useState<string>('');

  useEffect(() => {
    // Generate a simple trend line
    const dataPoints = 20;
    const baseDirection = trend === 'up' ? -0.5 : 0.5;
    
    let currentY = 50 + (Math.random() - 0.5) * 20;
    const pathPoints: string[] = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const x = (i / (dataPoints - 1)) * 100;
      currentY += (Math.random() - 0.5) * 10 + baseDirection;
      currentY = Math.max(10, Math.min(90, currentY)); // Keep within bounds
      pathPoints.push(`${x},${currentY}`);
    }
    
    setPoints(pathPoints.join(' '));
  }, [symbol, trend]);

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Area under the curve */}
        <polygon 
          points={`0,100 ${points} 100,100`}
          fill={trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
        />
        
        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke={trend === 'up' ? '#10b981' : '#ef4444'}
          strokeWidth="1"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}