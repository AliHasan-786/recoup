'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import DemoBanner from '@/components/DemoBanner';
import { getScanLogs, getAlerts, subscribe } from '@/lib/alertStore';
import { ScanLog } from '@/lib/mockData';
import { formatDateTime, formatCurrency } from '@/lib/utils';

export default function LogsPage() {
  const [logs, setLogs] = useState<ScanLog[]>(getScanLogs());
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setLogs(getScanLogs());
      setActiveCount(getAlerts().filter(a => a.status === 'active').length);
    };
    refresh();
    return subscribe(refresh);
  }, []);

  const totalRecovered = logs.reduce((sum, l) => sum + l.totalRecovery, 0);
  const totalScanned = logs.reduce((sum, l) => sum + l.recordsScanned, 0);
  const totalAlerts = logs.reduce((sum, l) => sum + l.alertsFound, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar activeCount={activeCount} />

      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <DemoBanner />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Agent Logs
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Full history of Recoup investigation runs
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total Runs', value: String(logs.length), icon: <Activity size={14} />, accent: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
            { label: 'Records Scanned', value: totalScanned.toLocaleString(), icon: <Clock size={14} />, accent: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Revenue Identified', value: formatCurrency(totalRecovered), icon: <CheckCircle2 size={14} />, accent: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          ].map(({ label, value, icon, accent, bg }) => (
            <div key={label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
                <div style={{ width: 26, height: 26, borderRadius: '6px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                  {icon}
                </div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Log Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logs.map((log, i) => {
            const duration = Math.round((log.completedAt.getTime() - log.startedAt.getTime()) / 1000);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Run indicator */}
                <div style={{
                  width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#8b5cf6', fontSize: '12px', fontWeight: 700,
                }}>
                  #{logs.length - i}
                </div>

                {/* Timestamp */}
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {formatDateTime(log.startedAt)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Completed in {duration}s
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Records Scanned</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{log.recordsScanned.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Alerts Found</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: log.alertsFound > 0 ? '#f59e0b' : 'var(--text-secondary)' }}>
                      {log.alertsFound}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Revenue Identified</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>{formatCurrency(log.totalRecovery)}</div>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '11px', fontWeight: 600,
                  background: 'rgba(16,185,129,0.1)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '5px', padding: '3px 9px',
                }}>
                  <CheckCircle2 size={11} />
                  Complete
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Agent Architecture Note */}
        <div style={{
          marginTop: '28px',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '20px 24px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <AlertCircle size={14} style={{ color: '#3b82f6' }} />
            How Recoup Works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {[
              { step: '1', label: 'Data Ingestion', desc: 'Queries PMS reservation and billing records via read-only database connector' },
              { step: '2', label: 'Anomaly Detection', desc: 'Rule-based and ML patterns identify billing gaps, pricing deltas, and churn signals' },
              { step: '3', label: 'AI Reasoning', desc: 'Claude AI generates investigation chain — verifying findings before surfacing alerts' },
              { step: '4', label: 'Human Approval', desc: 'Every action requires one-click human approval before writing back to the PMS' },
            ].map(({ step, label, desc }) => (
              <div key={step} style={{
                padding: '12px', borderRadius: '7px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                    fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.55' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
