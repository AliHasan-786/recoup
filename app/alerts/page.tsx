'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Filter, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import DemoBanner from '@/components/DemoBanner';
import StatsPanel from '@/components/StatsPanel';
import AlertCard from '@/components/AlertCard';
import RevenueChart from '@/components/RevenueChart';
import { getAlerts, getStats, addNewAlert, subscribe } from '@/lib/alertStore';
import { Alert } from '@/lib/mockData';

type FilterType = 'all' | 'active' | 'approved' | 'dismissed';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(getAlerts());
  const [stats, setStats] = useState(getStats());
  const [filter, setFilter] = useState<FilterType>('active');
  const [scanning, setScanning] = useState(false);
  const [newAlertId, setNewAlertId] = useState<string | null>(null);
  const [scanPulse, setScanPulse] = useState(false);

  const refresh = useCallback(() => {
    setAlerts(getAlerts());
    setStats(getStats());
  }, []);

  useEffect(() => {
    const unsub = subscribe(refresh);
    return unsub;
  }, [refresh]);

  const handleScan = async () => {
    setScanning(true);
    setScanPulse(true);

    // 1. Add a new alert optimistically with fallback steps
    const created = addNewAlert();

    // 2. Fetch real AI reasoning steps from OpenRouter
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: created.type,
          context: created.metadata,
        }),
      });
      if (res.ok) {
        const { steps } = await res.json();
        if (steps && steps.length > 0) {
          // Update the alert in store with real AI steps
          // For now, the fallback steps play — a real integration would hydrate the store
          // The agent reasoning panel in AlertCard re-runs on open
          created.agentSteps = steps;
        }
      }
    } catch {
      // Silently use fallback steps already set in the store
    }

    setNewAlertId(created.id);
    setFilter('active');
    refresh();

    await new Promise(r => setTimeout(r, 1200));
    setScanning(false);
    setScanPulse(false);
    setTimeout(() => setNewAlertId(null), 6000);
  };

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const filterCounts = {
    all: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    approved: alerts.filter(a => a.status === 'approved').length,
    dismissed: alerts.filter(a => a.status === 'dismissed').length,
  };

  const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'active', label: 'Active', icon: <AlertCircle size={12} /> },
    { key: 'approved', label: 'Approved', icon: <CheckCircle2 size={12} /> },
    { key: 'dismissed', label: 'Dismissed', icon: <XCircle size={12} /> },
    { key: 'all', label: 'All', icon: <Filter size={12} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar activeCount={filterCounts.active} />

      <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px', maxWidth: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '20px' }}>
          <DemoBanner />
        </div>

        {/* Title Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Revenue Alerts
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              AI-detected opportunities across Lakewood Suites properties
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={scanning}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: scanning ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.15)',
              border: `1px solid ${scanning ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.4)'}`,
              borderRadius: '8px',
              color: '#3b82f6', fontSize: '13px', fontWeight: 600,
              cursor: scanning ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: scanPulse ? '0 0 24px rgba(59,130,246,0.2)' : 'none',
            }}
            onMouseEnter={e => {
              if (!scanning) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.22)';
            }}
            onMouseLeave={e => {
              if (!scanning) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.15)';
            }}
          >
            {scanning ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <ScanLine size={14} />
            )}
            {scanning ? 'Scanning reservations...' : 'Scan Now'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: '24px' }}>
          <StatsPanel {...stats} />
        </div>

        {/* Chart */}
        <div style={{ marginBottom: '24px' }}>
          <RevenueChart />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '6px' }}>Show:</span>
          {FILTERS.map(({ key, label, icon }) => {
            const active = filter === key;
            const count = filterCounts[key];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 11px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: active ? 600 : 400,
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-light)' : 'transparent'}`,
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {icon}
                {label}
                <span style={{
                  fontSize: '10px', background: 'var(--bg-highlight)',
                  padding: '1px 5px', borderRadius: '4px',
                  color: active ? 'var(--text-secondary)' : 'var(--text-muted)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alert Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: 'var(--text-muted)', fontSize: '14px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '10px',
                }}
              >
                {filter === 'active' ? (
                  <>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>All clear</div>
                    <div style={{ fontSize: '12px' }}>No active alerts — click "Scan Now" to run a new investigation</div>
                  </>
                ) : (
                  <>No {filter} alerts found</>
                )}
              </motion.div>
            ) : (
              filtered.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  isNew={alert.id === newAlertId}
                  onStatusChange={refresh}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
