import React from 'react';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const Sparkline = ({ values = [], height = 64, stroke = '#4f46e5', fill = 'rgba(79,70,229,0.12)' }) => {
  const safe = Array.isArray(values) ? values.filter(v => Number.isFinite(v)) : [];
  const w = 240;
  const h = height;

  if (safe.length < 2) {
    return (
      <div className="h-16 flex items-center justify-center text-sm text-gray-400">
        Not enough data
      </div>
    );
  }

  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const range = max - min || 1;

  const pts = safe.map((v, i) => {
    const x = (i / (safe.length - 1)) * (w - 2) + 1;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return [x, y];
  });

  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const area = `${d} L ${w - 1} ${h - 1} L 1 ${h - 1} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const MiniBarChart = ({ values = [], labels = [] }) => {
  const safe = Array.isArray(values) ? values.map(v => (Number.isFinite(v) ? v : 0)) : [];
  const max = Math.max(1, ...safe);

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-24">
        {safe.map((v, i) => {
          const pct = clamp((v / max) * 100, 0, 100);
          return (
            <div key={i} className="flex-1 min-w-0 flex flex-col items-center gap-2">
              <div className="w-full rounded-xl bg-indigo-50 overflow-hidden border border-indigo-100">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-violet-600 rounded-xl"
                  style={{ height: `${pct}%`, minHeight: '6px' }}
                  title={`${labels?.[i] ?? ''}: ${v}`}
                />
              </div>
              <div className="w-full text-[10px] text-gray-500 font-semibold truncate text-center">
                {labels?.[i] ?? `#${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

