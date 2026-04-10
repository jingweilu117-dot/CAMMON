import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip as RechartsTooltip, LineChart, Line, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { CustomBar, CustomActiveBar, UnifiedTooltip } from '../ui/ChartUtils';
import { PremiumCard } from '../ui/PremiumCard';
import { Instance } from '../../types';

export function InstanceCard({ name, ip, type, cpu, ramPct, ramText, diskPct, diskText, tps, qps, sessions, status }: Instance) {
  const isOffline = status === 'OFFLINE';
  
  const getCpuColor = (val: number) => val >= 90 ? 'var(--status-high)' : val >= 50 ? 'var(--status-mid)' : 'var(--status-low)';
  const getProgressColorClass = (val: number) => val >= 90 ? 'bg-status-high' : val >= 70 ? 'bg-status-mid' : 'bg-status-low';
  const getStatColorClass = (val: number, type: 'tps' | 'qps' | 'sessions') => {
    if (type === 'tps') return val >= 5000 ? 'text-status-high' : val >= 2000 ? 'text-status-mid' : 'text-status-low';
    if (type === 'qps') return val >= 10000 ? 'text-status-high' : val >= 5000 ? 'text-status-mid' : 'text-status-low';
    return val >= 300 ? 'text-status-high' : val >= 100 ? 'text-status-mid' : 'text-status-low';
  };

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (5 - i) * 2);
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const baseVal = i === 3 ? cpu : i === 5 ? cpu : Math.max(0, cpu - (5 - i) * 10);
    return { time: timeStr, value: baseVal };
  });

  return (
    <PremiumCard className={`group ${isOffline ? 'opacity-70' : ''}`}>
      <div className="p-5 border-b border-border flex justify-between items-start bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-transform duration-500 group-hover:scale-110 ${
            type === 'O' ? 'bg-error/10 border-error/20 text-error' : 
            type === 'M' ? 'bg-primary/10 border-primary/20 text-primary' : 
            'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-secondary'
          }`}>
            <span className="font-headline font-black text-base">{type}</span>
          </div>
          <div>
            <h5 className="font-black text-sm text-foreground leading-tight group-hover:text-primary transition-colors">{name}</h5>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">{ip}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 border rounded-sm uppercase tracking-widest ${
          isOffline ? 'text-error bg-error/10 border-error/20' : 'text-primary bg-primary/10 border-primary/20'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">CPU Load</span>
            <span className="text-sm font-mono font-black text-foreground">{isOffline ? '--' : `${cpu}%`}</span>
          </div>
          <div className="h-8 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="0%">
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <RechartsTooltip 
                  content={<UnifiedTooltip getStatusColor={getCpuColor} unit="%" />}
                />
                <Bar 
                  dataKey="value" 
                  shape={(props: any) => {
                    const { value } = props;
                    const color = isOffline ? 'var(--muted)' : getCpuColor(value);
                    return <CustomBar {...props} fill={color} height={Math.max(props.height, 2)} />;
                  }} 
                  activeBar={(props: any) => {
                    const { value } = props;
                    const color = isOffline ? 'var(--muted)' : getCpuColor(value);
                    return <CustomActiveBar {...props} fill={color} height={Math.max(props.height, 2)} />;
                  }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Memory</span>
            <span className="text-[10px] font-mono text-foreground font-bold">{ramText}</span>
          </div>
          <div className="w-full bg-muted h-1 rounded-full relative overflow-hidden">
            {!isOffline && (
              <div 
                className={`${getProgressColorClass(ramPct)} h-full transition-all duration-1000 absolute left-0 top-0 shadow-glow`} 
                style={{ width: `${ramPct}%` }}
              ></div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Disk (Mount)</span>
            <span className="text-[10px] font-mono text-foreground font-bold">{diskText}</span>
          </div>
          <div className="w-full bg-muted h-1 rounded-full relative overflow-hidden">
            {!isOffline && (
              <div 
                className={`${getProgressColorClass(diskPct)} h-full transition-all duration-1000 absolute left-0 top-0 shadow-glow`} 
                style={{ width: `${diskPct}%` }}
              ></div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-muted/20 border-t border-border">
        {isOffline ? (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-50">Connection Lost</span>
            <RefreshCw size={14} className="text-error cursor-pointer hover:rotate-180 transition-transform duration-500" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <StatWithSparkline label="TPS" value={tps} colorClass={getStatColorClass(tps, 'tps')} />
            <StatWithSparkline label="QPS" value={qps} colorClass={getStatColorClass(qps, 'qps')} />
            <StatWithSparkline label="SESS" value={sessions} colorClass={getStatColorClass(sessions, 'sessions')} />
          </div>
        )}
      </div>

      {!isOffline && (
        <div className="px-5 py-2 flex justify-end border-t border-border/30">
          <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary cursor-pointer transition-all duration-300 group-hover:scale-110" />
        </div>
      )}
    </PremiumCard>
  );
}

function StatWithSparkline({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
  const data = Array.from({ length: 10 }).map((_, i) => ({ v: 30 + Math.random() * 40 + (i * 2) }));
  const colorVar = colorClass.includes('low') ? 'var(--status-low)' : colorClass.includes('mid') ? 'var(--status-mid)' : 'var(--status-high)';
  const gradientId = `grad-${label}-${value}`;

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">{label}</span>
      <div className="w-full h-7 mb-1.5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorVar} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={colorVar} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <RechartsTooltip content={<UnifiedTooltip title={label} />} />
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={colorVar} 
              strokeWidth={2} 
              fill={`url(#${gradientId})`}
              dot={false} 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <span className={`text-sm font-mono font-black ${colorClass} tracking-tight`}>{value.toLocaleString()}</span>
    </div>
  );
}
