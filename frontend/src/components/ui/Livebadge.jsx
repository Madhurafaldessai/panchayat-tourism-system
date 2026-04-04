// src/components/ui/LiveBadge.jsx
import React from 'react';

export default function LiveBadge({ active = true, label }) {
  const color = active ? '#3fb950' : '#f85149';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        display: 'inline-block',
        width: 8, height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: active ? 'pulse-amber 1.5s infinite' : 'none',
      }} />
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>
        {label || (active ? 'LIVE' : 'OFFLINE')}
      </span>
    </div>
  );
}