import React from 'react';
import { Search } from 'lucide-react';

export function TablespaceRow({ name, type, total, used, pct }: any) {
  const getStatusColor = (val: number) => val >= 90 ? 'var(--status-high)' : val >= 20 ? 'var(--status-mid)' : 'var(--status-low)';
  const getStatusClass = (val: number) => val >= 90 ? 'bg-status-high' : val >= 20 ? 'bg-status-mid' : 'bg-status-low';
  const getTextColorClass = (val: number) => val >= 90 ? 'text-status-high' : val >= 20 ? 'text-status-mid' : 'text-status-low';
  
  const statusColor = getStatusColor(pct);
  const statusClass = getStatusClass(pct);
  const textColorClass = getTextColorClass(pct);

  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="px-6 py-4 font-medium text-foreground">{name}</td>
      <td className="px-6 py-4 text-muted-foreground">{type}</td>
      <td className="px-6 py-4 font-mono">{total}</td>
      <td className="px-6 py-4 font-mono">{used}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 h-1.5 bg-surface-high rounded-full overflow-hidden">
            <div className={`h-full ${statusClass}`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className={`text-xs font-mono font-bold ${textColorClass}`}>{pct}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-status-low font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-status-low"></span> Online
        </span>
      </td>
    </tr>
  );
}

export function LongSessionRow({ user, machine, program, sqlId, event, time }: any) {
  // Parse time (e.g., "12,450s") to number for status coloring
  const timeVal = parseInt(time.replace(/,/g, ''));
  const getStatusClass = (val: number) => val >= 10000 ? 'text-status-high' : val >= 2000 ? 'text-status-mid' : 'text-status-low';
  
  const statusClass = getStatusClass(timeVal);

  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="px-6 py-4 text-primary font-medium">{user}</td>
      <td className="px-6 py-4 text-muted-foreground">{machine}</td>
      <td className="px-6 py-4 font-mono text-[11px]">{program}</td>
      <td className="px-6 py-4 font-mono text-foreground/70 font-bold">{sqlId}</td>
      <td className="px-6 py-4 text-xs">{event}</td>
      <td className={`px-6 py-4 text-right font-mono font-black ${statusClass}`}>{time}</td>
    </tr>
  );
}

export function InstanceSelector() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">SELECTED INSTANCE</label>
      <div className="relative min-w-[240px]">
        <select className="appearance-none w-full bg-surface-high border border-outline-variant/30 text-foreground px-4 py-2.5 rounded-md font-sans font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer">
          <option value="DB-CORE-PROD-01">DB-CORE-PROD-01</option>
          <option value="DB-CORE-PROD-02">DB-CORE-PROD-02</option>
          <option value="DB-ANALYTICS-STAGING">DB-ANALYTICS-STAGING</option>
          <option value="DB-AUTH-GLOBAL">DB-AUTH-GLOBAL</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}
