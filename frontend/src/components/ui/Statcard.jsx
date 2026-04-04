// src/components/ui/StatCard.jsx
import React from 'react';

export default function StatCard({ label, value, sub, icon: Icon, color = 'var(--amber)', trend }) {
  return (
    <div style={{ ...S.card, borderColor: color + '33' }}>
      <div style={S.top}>
        <div style={S.labelRow}>
          <div style={{ ...S.iconBox, background: color + '18' }}>
            {Icon && <Icon size={16} color={color} />}
          </div>
          <span style={S.label}>{label}</span>
        </div>
        {trend !== undefined && (
          <span style={{ ...S.trend, color: trend >= 0 ? '#f85149' : '#3fb950' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ ...S.value, color }}>{value}</div>
      {sub && <div style={S.sub}>{sub}</div>}
    </div>
  );
}

const S = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    animation: 'fade-up 0.4s ease',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    lineHeight: 1,
  },
  sub: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  trend: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
  },
};