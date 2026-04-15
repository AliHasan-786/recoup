'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, UserX, CheckCircle2, XCircle, ChevronDown, ChevronUp, Users, Building2 } from 'lucide-react';
import { Alert, AlertType } from '@/lib/mockData';
import { updateAlertStatus } from '@/lib/alertStore';
import AgentThinking from './AgentThinking';
import { formatDistanceToNow } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  isNew?: boolean;
  onStatusChange?: () => void;
}

const TYPE_CONFIG: Record<AlertType, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
  label: string;
  badgeStyle: string;
}> = {
  late_fee: {
    icon: <AlertTriangle size={14} />,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    glowClass: 'glow-red',
    label: 'Late Fee Recovery',
    badgeStyle: 'background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3);',
  },
  pricing_gap: {
    icon: <TrendingUp size={14} />,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    glowClass: 'glow-amber',
    label: 'Pricing Gap',
    badgeStyle: 'background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3);',
  },
  churn_risk: {
    icon: <UserX size={14} />,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    glowClass: 'glow-blue',
    label: 'Churn Risk',
    badgeStyle: 'background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3);',
  },
};

export default function AlertCard({ alert, isNew = false, onStatusChange }: AlertCardProps) {
  const config = TYPE_CONFIG[alert.type];
  const [expanded, setExpanded] = useState(isNew || alert.status === 'active');
  const [agentDone, setAgentDone] = useState(!isNew && alert.status !== 'active');
  const [localStatus, setLocalStatus] = useState(alert.status);
  const [actionFeedback, setActionFeedback] = useState<'approved' | 'dismissed' | null>(null);

  useEffect(() => {
    setLocalStatus(alert.status);
    if (alert.status !== 'active') setAgentDone(true);
  }, [alert.status]);

  const handleApprove = () => {
    setActionFeedback('approved');
    setTimeout(() => {
      updateAlertStatus(alert.id, 'approved');
      setLocalStatus('approved');
      setExpanded(false);
      onStatusChange?.();
    }, 800);
  };

  const handleDismiss = () => {
    setActionFeedback('dismissed');
    setTimeout(() => {
      updateAlertStatus(alert.id, 'dismissed');
      setLocalStatus('dismissed');
      setExpanded(false);
      onStatusChange?.();
    }, 500);
  };

  const priorityDot = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  }[alert.priority];

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -20, scale: 0.98 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: localStatus === 'active' ? config.bgColor : 'var(--bg-surface)',
        border: `1px solid ${localStatus === 'active' ? config.borderColor : 'var(--border)'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: localStatus !== 'active' ? 0.72 : 1,
      }}
    >
      {/* Card Header */}
      <div
        className="card-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}
      >
        {/* Type Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: '7px', flexShrink: 0,
          background: `${config.color}1a`,
          border: `1px solid ${config.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: config.color,
        }}>
          {config.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', padding: '2px 7px', borderRadius: '4px',
              ...parseStyle(config.badgeStyle),
            }}>
              {config.label}
            </span>
            {localStatus !== 'active' && (
              <span style={{
                fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', padding: '2px 7px', borderRadius: '4px',
                background: localStatus === 'approved' ? 'rgba(16,185,129,0.15)' : 'rgba(75,85,99,0.2)',
                color: localStatus === 'approved' ? '#10b981' : '#6b7280',
                border: `1px solid ${localStatus === 'approved' ? 'rgba(16,185,129,0.3)' : 'rgba(75,85,99,0.3)'}`,
              }}>
                {localStatus}
              </span>
            )}
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: priorityDot, marginLeft: 2 }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {alert.title}
          </div>
        </div>

        {/* Impact + Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '17px', fontWeight: 700, color: config.color, letterSpacing: '-0.02em' }}>
              {alert.impactLabel}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
              {formatDistanceToNow(alert.detectedAt)}
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Description */}
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>
                {alert.description}
              </p>

              {/* Details Row */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {alert.guestCount && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Users size={11} />
                    <span>{alert.guestCount} {alert.guestCount === 1 ? 'guest' : 'guests'}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Building2 size={11} />
                  <span>{alert.property}</span>
                </div>
              </div>

              {/* Guest Names */}
              {alert.guestNames && alert.guestNames.length > 0 && (
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px'
                }}>
                  {alert.guestNames.map((name, i) => (
                    <span key={i} style={{
                      fontSize: '11px', padding: '3px 8px', borderRadius: '4px',
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}>
                      {name}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px',
              }}>
                {Object.entries(alert.metadata).map(([key, val]) => (
                  <div key={key} style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: '6px', padding: '9px 11px',
                  }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px', letterSpacing: '0.03em' }}>{key}</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{String(val)}</div>
                  </div>
                ))}
              </div>

              {/* Agent Reasoning */}
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Agent Reasoning Chain
                </div>
                <AgentThinking
                  steps={alert.agentSteps}
                  onComplete={() => setAgentDone(true)}
                  autoStart={isNew || localStatus === 'active'}
                />
              </div>

              {/* Actions */}
              <AnimatePresence>
                {localStatus === 'active' && agentDone && !actionFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', gap: '10px' }}
                  >
                    <button onClick={handleApprove} className="btn-approve">
                      <CheckCircle2 size={14} />
                      Approve & Apply
                    </button>
                    <button onClick={handleDismiss} className="btn-dismiss">
                      <XCircle size={14} />
                      Dismiss
                    </button>
                  </motion.div>
                )}
                {actionFeedback === 'approved' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '13px', fontWeight: 500, color: '#10b981',
                      padding: '10px 14px', background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.25)', borderRadius: '7px',
                    }}
                  >
                    <CheckCircle2 size={15} />
                    Action applied — {alert.impactLabel} queued for recovery
                  </motion.div>
                )}
              </AnimatePresence>

              {localStatus === 'approved' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: 500, color: '#10b981',
                }}>
                  <CheckCircle2 size={14} />
                  Approved — action applied
                </div>
              )}
              {localStatus === 'dismissed' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', color: 'var(--text-muted)',
                }}>
                  <XCircle size={14} />
                  Dismissed
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .btn-approve {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 7px;
          color: #10b981;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.15s ease;
        }
        .btn-approve:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.55);
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
        }
        .btn-dismiss {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid var(--border-light);
          border-radius: 7px;
          color: var(--text-muted);
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s ease;
        }
        .btn-dismiss:hover {
          background: var(--bg-elevated);
          color: var(--text-secondary);
        }
      `}</style>
    </motion.div>
  );
}

// Helper to parse inline style string into object
function parseStyle(styleStr: string): React.CSSProperties {
  const result: Record<string, string> = {};
  styleStr.split(';').forEach(part => {
    const [key, val] = part.split(':').map(s => s.trim());
    if (key && val) {
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[camel] = val;
    }
  });
  return result as React.CSSProperties;
}
