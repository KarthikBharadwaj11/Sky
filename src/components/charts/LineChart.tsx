'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  date?: string;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  minimalistic?: boolean;
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
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Market Value</span>
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

export default function CustomLineChart({
  data,
  title,
  color = '#3B82F6',
  height = 300,
  showGrid = true,
  showXAxis = true,
  minimalistic = false,
  enableZoom = false
}: LineChartProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {hoveredValue !== null && !minimalistic && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg glass-morphism border border-white/10">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current:</span>
              <span className="text-sm font-bold" style={{ color: color }}>
                ${Number(hoveredValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: minimalistic ? 5 : enableZoom ? 60 : 20 }}
          onMouseMove={(e: any) => {
            if (e.activePayload && e.activePayload[0]) {
              setHoveredValue(e.activePayload[0].value);
            }
          }}
          onMouseLeave={() => setHoveredValue(null)}
        >
          {showGrid && !minimalistic && <CartesianGrid strokeDasharray="2 2" stroke="var(--chart-grid)" strokeOpacity={0.3} />}
          {showXAxis && !minimalistic && (
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'var(--chart-axis)' }}
              interval="preserveStartEnd"
              axisLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
              tickLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            />
          )}
          {minimalistic && (
            <XAxis
              dataKey="name"
              hide={true}
            />
          )}
          <YAxis
            tick={minimalistic ? false : { fontSize: 12, fill: 'var(--chart-axis)' }}
            axisLine={minimalistic ? false : { stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            tickLine={minimalistic ? false : { stroke: 'var(--chart-grid)', strokeWidth: 1 }}
            tickFormatter={minimalistic ? () => '' : (value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={<CustomTooltip color={color} />}
            cursor={!minimalistic ? <CustomCursor color={color} /> : false}
          />
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="100%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="dotGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={minimalistic ? 2 : 3}
            fill={minimalistic ? 'none' : `url(#gradient-${color.replace('#', '')})`}
            dot={false}
            activeDot={{
              r: minimalistic ? 4 : 6,
              stroke: color,
              strokeWidth: 3,
              fill: '#ffffff',
              filter: 'url(#dotGlow)',
              style: {
                boxShadow: `0 0 12px ${color}`,
                cursor: 'pointer'
              }
            }}
            filter={minimalistic ? 'none' : 'url(#lineGlow)'}
            strokeDasharray="0"
            animationDuration={800}
          />
          {enableZoom && !minimalistic && (
            <Brush
              dataKey="name"
              height={30}
              stroke={color}
              fill="var(--chart-brush-bg)"
              travellerWidth={10}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}