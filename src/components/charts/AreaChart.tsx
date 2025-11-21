'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  date?: string;
}

interface AreaChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  enableZoom?: boolean;
}

const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const dataPoint = payload[0].payload;

    return (
      <div className="glass-morphism p-4 rounded-lg border border-white/10 backdrop-blur-xl shadow-xl">
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          {dataPoint.date || label}
        </p>
        <p className="text-lg font-bold mb-1" style={{ color: color }}>
          ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Portfolio Value</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomCursor = ({ points, width, height, color }: any) => {
  const { x, y } = points[0];
  return (
    <g>
      {/* Vertical crosshair */}
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.5}
        strokeDasharray="4 4"
      />
      {/* Horizontal crosshair */}
      <line
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.5}
        strokeDasharray="4 4"
      />
      {/* Intersection circle */}
      <circle
        cx={x}
        cy={y}
        r={6}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};

export default function CustomAreaChart({
  data,
  title,
  color = '#3B82F6',
  height = 300,
  showGrid = true,
  enableZoom = false
}: AreaChartProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredChange, setHoveredChange] = useState<{ value: number; percent: number } | null>(null);

  const calculateChange = (currentValue: number) => {
    if (data.length === 0) return { value: 0, percent: 0 };
    const firstValue = data[0].value;
    const change = currentValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    return { value: change, percent: percentChange };
  };

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {hoveredValue !== null && hoveredChange && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg glass-morphism border border-white/10">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Value:</span>
                <span className="text-sm font-bold" style={{ color: color }}>
                  ${Number(hoveredValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg glass-morphism border ${hoveredChange.value >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Change:</span>
                <span className={`text-sm font-bold ${hoveredChange.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {hoveredChange.value >= 0 ? '+' : ''}${Number(hoveredChange.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {' '}({hoveredChange.value >= 0 ? '+' : ''}{hoveredChange.percent.toFixed(2)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: enableZoom ? 60 : 20 }}
          onMouseMove={(e: any) => {
            if (e.activePayload && e.activePayload[0]) {
              const value = e.activePayload[0].value;
              setHoveredValue(value);
              setHoveredChange(calculateChange(value));
            }
          }}
          onMouseLeave={() => {
            setHoveredValue(null);
            setHoveredChange(null);
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
              <stop offset="50%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={<CustomTooltip color={color} />}
            cursor={<CustomCursor color={color} />}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            filter="url(#glow)"
            dot={false}
            activeDot={{
              r: 6,
              stroke: color,
              strokeWidth: 3,
              fill: '#ffffff',
              style: {
                boxShadow: `0 0 12px ${color}`,
                cursor: 'pointer'
              }
            }}
            animationDuration={800}
          />
          {enableZoom && (
            <Brush
              dataKey="name"
              height={30}
              stroke={color}
              fill="var(--chart-brush-bg)"
              travellerWidth={10}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}