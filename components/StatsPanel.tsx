'use client';

import { DollarSign, AlertCircle, UserX, ScanLine } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatsPanelProps {
  recoveredToday: number;
  pendingValue: number;
  activeAlerts: number;
  churnRisks: number;
  lastScanRecords: number;
}

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
}

function StatCard({ label, value, subtext, icon, accent, accentBg }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '16px 18px',
      transition: 'border-color 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          {label}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: '7px',
          background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
        {subtext}
      </div>
    </div>
  );
}

export default function StatsPanel({ recoveredToday, pendingValue, activeAlerts, churnRisks, lastScanRecords }: StatsPanelProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
    }}>
      <StatCard
        label="Recovered Today"
        value={formatCurrency(recoveredToday)}
        subtext="from approved alerts"
        icon={<DollarSign size={14} />}
        accent="#10b981"
        accentBg="rgba(16,185,129,0.12)"
      />
      <StatCard
        label="Pending Review"
        value={formatCurrency(pendingValue)}
        subtext={`across ${activeAlerts} active alert${activeAlerts !== 1 ? 's' : ''}`}
        icon={<AlertCircle size={14} />}
        accent="#f59e0b"
        accentBg="rgba(245,158,11,0.12)"
      />
      <StatCard
        label="Churn Risks"
        value={String(churnRisks)}
        subtext="loyalty members flagged"
        icon={<UserX size={14} />}
        accent="#3b82f6"
        accentBg="rgba(59,130,246,0.12)"
      />
      <StatCard
        label="Last Scan"
        value={lastScanRecords.toLocaleString()}
        subtext="reservation records checked"
        icon={<ScanLine size={14} />}
        accent="#8b5cf6"
        accentBg="rgba(139,92,246,0.12)"
      />
    </div>
  );
}
