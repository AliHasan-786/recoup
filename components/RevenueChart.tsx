'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { REVENUE_TREND } from '@/lib/mockData';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{label}</div>
        {payload.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{p.name}:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '20px 24px',
    }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Recovery Trend</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>Last 8 days · Lakewood Suites</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {[{ color: '#10b981', label: 'Recovered' }, { color: '#ef4444', label: 'Missed' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '2px', background: color, opacity: 0.8 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="missedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2435" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#4a5168' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#4a5168' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="recovered"
            name="Recovered"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#recoveredGrad)"
          />
          <Area
            type="monotone"
            dataKey="missed"
            name="Missed"
            stroke="#ef4444"
            strokeWidth={1.5}
            fill="url(#missedGrad)"
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
