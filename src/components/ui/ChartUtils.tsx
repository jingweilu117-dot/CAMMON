import React from 'react';
import { Rectangle } from 'recharts';

export function TimeSelector({ selected, onSelect, isLoading }: { selected: string; onSelect: (val: string) => void; isLoading: boolean }) {
  const options = ['1H', '2H', '7H', '24H'];
  return (
    <div className="flex gap-1 bg-muted p-0.5 rounded-sm border border-border">
      {options.map(opt => (
        <button
          key={opt}
          disabled={isLoading}
          onClick={() => onSelect(opt)}
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm transition-all ${
            selected === opt
              ? 'bg-primary text-primary-foreground shadow-glow'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-high'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ChartLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-low/40 backdrop-blur-[2px] rounded-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin shadow-glow"></div>
        <span className="text-[9px] font-black text-primary tracking-[0.3em] uppercase">Loading Data</span>
      </div>
    </div>
  );
}

export const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const safeId = fill.includes('var(') ? fill.replace(/[^a-zA-Z0-9]/g, '') : fill.replace('#', '');
  
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${safeId}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={fill} stopOpacity={0.2} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <Rectangle 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill={isDark ? `url(#grad-${safeId})` : fill} 
        radius={[0, 0, 0, 0]} 
      />
      {isDark && <line x1={x} y1={y} x2={x + width} y2={y} stroke={fill} strokeWidth={1} strokeOpacity={0.8} />}
    </g>
  );
};

export const CustomActiveBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const safeId = fill.includes('var(') ? fill.replace(/[^a-zA-Z0-9]/g, '') : fill.replace('#', '');
  
  return (
    <g>
      <defs>
        <linearGradient id={`grad-active-${safeId}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={fill} stopOpacity={0.4} />
          <stop offset="100%" stopColor={fill} stopOpacity={1} />
        </linearGradient>
        <filter id={`glow-${safeId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <Rectangle 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill={isDark ? `url(#grad-active-${safeId})` : fill} 
        fillOpacity={isDark ? 1 : 0.9}
        radius={[0, 0, 0, 0]} 
      />
      {/* Top Highlight Effect - Now enabled for both modes */}
      <line 
        x1={x} 
        y1={y} 
        x2={x + width} 
        y2={y} 
        stroke={fill} 
        strokeWidth={4} 
        filter={`url(#glow-${safeId})`} 
        strokeOpacity={isDark ? 1 : 0.6}
      />
      <line 
        x1={x} 
        y1={y} 
        x2={x + width} 
        y2={y} 
        stroke="#ffffff" 
        strokeWidth={1.5} 
        strokeOpacity={0.9} 
      />
    </g>
  );
};

export const UnifiedTooltip = ({ active, payload, label, getStatusColor, title, unit, reverse }: any) => {
  if (active && payload && payload.length) {
    const isMulti = payload.length > 1;
    const displayPayload = reverse ? [...payload].reverse() : payload;
    
    return (
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl rounded-lg p-3 min-w-[160px] animate-in fade-in zoom-in duration-200">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block border-b border-border/50 pb-1">
          {label}
        </span>
        <div className="space-y-1.5">
          {displayPayload.map((entry: any, index: number) => {
            const value = entry.value;
            const name = entry.name || entry.dataKey;
            const color = getStatusColor ? getStatusColor(value, name) : (entry.fill || entry.color || 'var(--primary)');
            
            return (
              <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {isMulti && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>}
                  <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-tight">
                    {name}
                  </span>
                </div>
                <span className="text-sm font-black font-mono" style={{ color }}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  {unit && <span className="text-[10px] ml-0.5 opacity-70">{unit}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};
