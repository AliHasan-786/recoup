// lib/alertStore.ts
// Simple in-memory store using React context + localStorage for demo persistence

import { Alert, SEED_ALERTS, NEW_ALERT_TEMPLATES, ScanLog, SCAN_LOGS } from './mockData';

let _alerts: Alert[] = [...SEED_ALERTS];
let _scanLogs: ScanLog[] = [...SCAN_LOGS];
let _listeners: (() => void)[] = [];
let _scanCount = 0;

export function getAlerts(): Alert[] {
  return _alerts;
}

export function getScanLogs(): ScanLog[] {
  return _scanLogs;
}

export function updateAlertStatus(id: string, status: 'approved' | 'dismissed') {
  _alerts = _alerts.map(a => a.id === id ? { ...a, status } : a);
  notify();
}

export function addNewAlert(): Alert {
  const template = NEW_ALERT_TEMPLATES[_scanCount % NEW_ALERT_TEMPLATES.length];
  _scanCount++;
  const newAlert: Alert = {
    ...template,
    id: `alert-new-${Date.now()}`,
    detectedAt: new Date(),
    status: 'active',
  };
  _alerts = [newAlert, ..._alerts];
  
  const newLog: ScanLog = {
    id: `scan-new-${Date.now()}`,
    startedAt: new Date(Date.now() - 1000 * 55),
    completedAt: new Date(),
    recordsScanned: Math.floor(Math.random() * 600) + 400,
    alertsFound: 1,
    totalRecovery: newAlert.impact,
  };
  _scanLogs = [newLog, ..._scanLogs];
  
  notify();
  return newAlert;
}

export function subscribe(listener: () => void) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter(l => l !== listener);
  };
}

function notify() {
  _listeners.forEach(l => l());
}

export function getStats() {
  const active = _alerts.filter(a => a.status === 'active');
  const approved = _alerts.filter(a => a.status === 'approved');
  const recoveredToday = approved.reduce((sum, a) => sum + (a.impact < 5000 ? a.impact : 0), 0);
  const pendingValue = active.reduce((sum, a) => sum + a.impact, 0);
  const churnRisks = active.filter(a => a.type === 'churn_risk').length;
  
  return {
    recoveredToday,
    pendingValue,
    activeAlerts: active.length,
    churnRisks,
    totalScans: _scanLogs.length,
    lastScanRecords: _scanLogs[0]?.recordsScanned ?? 0,
  };
}
