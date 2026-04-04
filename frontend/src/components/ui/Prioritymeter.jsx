// src/components/ui/PriorityMeter.jsx
import React from 'react';
import { getPriorityColor, getPriorityLabel } from '../../utils/priorityEngine';

export default function PriorityMeter({ score = 0, showLabel = true, height = 6 }) {
  const color = getPriorityColor(score);
  const label = getPriorityLabel(score);

  return (
    <div style={S.wrapper}>
      {showLabel && (
        <div style={S.header}>
          <span style={S.labelText}>Priority</span>
          <span style={{ ...S.scoreText, color }}>{score}/100</span>
        </div>
      )}
      <div style={{ ...S.track, height }}>
        <div style={{
          ...S.fill,
          width: `${score}%`,
          background: color,
          boxShadow: `0 0 8px ${color}60`,
          height: '100%',
        }} />
      </div>
      {showLabel && (
        <span style={{ ...S.badge, background: color + '22', color, border: `1px solid ${color}44` }}>
          {label.toUpperCase()}
        </span>
      )}
    </div>
  );
}

const S = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 5 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  labelText: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 },
  scoreText: { fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' },
  track: {
    background: 'var(--bg-hover)',
    borderRadius: 99,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 99,
    transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
  },
  badge: {
    display: 'inline-block',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 4,
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
};