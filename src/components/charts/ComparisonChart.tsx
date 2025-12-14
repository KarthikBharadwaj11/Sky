'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  name: string;
  userPerformance: number;
  marketPerformance: number;
}

interface ComparisonChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showGrid?: boolean;
}

export default function ComparisonChart({ 
  data, 
  title, 
  height = 320,
  showGrid = true 
}: ComparisonChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="2 2" stroke="var(--chart-grid)" strokeOpacity={0.3} />}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: 'var(--chart-axis)' }}
            interval="preserveStartEnd"
            axisLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            tickLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'var(--chart-axis)' }}
            axisLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            tickLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: `1px solid var(--chart-tooltip-border)`,
              borderRadius: '0.5rem',
              color: 'var(--chart-tooltip-text)',
              boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
            formatter={(value, name) => [
              `${Number(value) >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`, 
              name === 'userPerformance' ? 'Your Performance' : 'Market Performance'
            ]}
          />
          <Legend 
            wrapperStyle={{ color: 'var(--text-secondary)' }}
            formatter={(value) => value === 'userPerformance' ? 'Your Performance' : 'Market Performance'}
          />
          <Line
            type="monotone"
            dataKey="userPerformance"
            stroke="#10B981"
            strokeWidth={3}
            fill="url(#userGradient)"
            dot={false}
            activeDot={{
              r: 5,
              stroke: '#10B981',
              strokeWidth: 2,
              fill: '#ffffff',
              filter: 'url(#lineGlow)',
              style: {
                boxShadow: '0 0 12px #10B981',
                cursor: 'pointer'
              }
            }}
            filter="url(#lineGlow)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="marketPerformance"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#marketGradient)"
            dot={false}
            activeDot={{
              r: 5,
              stroke: '#3B82F6',
              strokeWidth: 2,
              fill: '#ffffff',
              filter: 'url(#lineGlow)',
              style: {
                boxShadow: '0 0 12px #3B82F6',
                cursor: 'pointer'
              }
            }}
            filter="url(#lineGlow)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}