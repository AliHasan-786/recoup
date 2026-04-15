'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, ScrollText, LayoutDashboard, Zap } from 'lucide-react';

const NAV = [
  { href: '/alerts', icon: Bell, label: 'Alerts', badge: true },
  { href: '/logs', icon: ScrollText, label: 'Agent Logs' },
];

interface SidebarProps {
  activeCount: number;
}

export default function Sidebar({ activeCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Recoup
          </span>
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '4px', paddingLeft: '39px' }}>
          Revenue Recovery Agent
        </div>
      </div>

      {/* Property badge */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          padding: '8px 11px', borderRadius: '7px',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Property Group
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Lakewood Suites
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
            3 properties · Boston area
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href === '/alerts' && pathname === '/');
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '7px', marginBottom: '2px',
                background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                border: `1px solid ${active ? 'rgba(59,130,246,0.25)' : 'transparent'}`,
                color: active ? '#3b82f6' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
                  (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)';
                }
              }}
              >
                <Icon size={15} />
                <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, flex: 1 }}>{label}</span>
                {badge && activeCount > 0 && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    background: '#ef4444', color: 'white',
                    borderRadius: '10px', padding: '1px 6px', minWidth: '18px', textAlign: 'center',
                  }}>
                    {activeCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '10px', color: 'var(--text-muted)',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} className="pulse-glow" />
          Agent online · scanning
        </div>
      </div>
    </aside>
  );
}
