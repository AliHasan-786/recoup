'use client';

import { Database, Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div style={{
      background: 'rgba(59, 130, 246, 0.07)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '12.5px',
      color: '#93b4fb',
    }}>
      <Database size={13} style={{ flexShrink: 0, color: '#3b82f6' }} />
      <span>
        <strong style={{ color: '#3b82f6', fontWeight: 600 }}>Demo Mode</strong>
        {' '}· Pre-loaded with 90 days of simulated data for Lakewood Suites (Boston area).
        Agent reasoning is powered by Claude AI — no setup required.
      </span>
      <Info size={12} style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.5 }} />
    </div>
  );
}
