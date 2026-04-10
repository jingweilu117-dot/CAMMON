import React, { useState } from 'react';
import { Cpu, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, AreaChart, Area } from 'recharts';
import { InstanceSelector, TablespaceRow, LongSessionRow } from '../components/dashboard/DashboardComponents';
import { TimeSelector, ChartLoadingOverlay, CustomBar, CustomActiveBar, UnifiedTooltip } from '../components/ui/ChartUtils';
import { PremiumCard } from '../components/ui/PremiumCard';
import { useMockData } from '../hooks/useMockData';

export function InstancesView() {
  const [sessionPage, setSessionPage] = useState(1);
  
  const { timeRange, setTimeRange, isLoading, data: sessionData } = useMockData(
    Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setMinutes(date.setMinutes(0) - (29 - i) * 2);
      return {
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
        value: 40 + Math.random() * 10
      };
    })
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-foreground mb-2">实例监控详情</h1>
          <p className="text-muted-foreground text-sm">实时监控数据库实例的核心指标、内存分配与活跃会话状态。</p>
        </div>
        <InstanceSelector />
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-2 space-y-4">
          <MetricCard title="SGA 内存" value="78" unit="%" detail="128G/164G" icon={<Cpu size={14} />} compact />
          <MetricCard title="PGA 内存" value="42" unit="%" detail="32G/76G" icon={<Cpu size={14} />} compact />
          
          <PremiumCard className="p-5 flex flex-col h-[420px]">
            <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">活跃会话 (Active Sessions)</h3>
            <div className="flex-1 flex flex-col justify-between">
              <SessionStatWithSparkline 
                label="前台" 
                value={124} 
                thresholds={{ mid: 30, high: 60 }}
              />
              <SessionStatWithSparkline 
                label="后台" 
                value={18} 
                thresholds={{ mid: 10, high: 40 }}
              />
              <SessionStatWithSparkline 
                label="等待" 
                value={12} 
                thresholds={{ mid: 5, high: 35 }}
              />
            </div>
          </PremiumCard>
        </div>

        <div className="col-span-12 lg:col-span-10">
          <PremiumCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black tracking-tight">会话负载趋势 (Sessions Load)</h3>
                <p className="text-xs text-muted-foreground mt-1">数据库活动会话实时监控</p>
              </div>
              <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
            </div>
            <div className="flex-1 flex flex-col justify-end h-full relative" style={{ minHeight: '350px' }}>
              {isLoading && <ChartLoadingOverlay />}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }} barCategoryGap="0%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--muted-foreground)" 
                    fontSize={10} 
                    tickLine={true} 
                    axisLine={true}
                    interval={0}
                    tick={(props: any) => {
                      const { x, y, payload, index } = props;
                      const total = sessionData.length;
                      
                      const numTicks = timeRange === '1H' ? 3 : 
                                       timeRange === '2H' ? 4 : 
                                       timeRange === '7H' ? 6 : 10;
                      
                      const targetIndices = Array.from({ length: numTicks }).map((_, i) => 
                        Math.floor(i * (total - 1) / (numTicks - 1))
                      );
                      
                      if (targetIndices.includes(index)) {
                        let textAnchor = "middle";
                        if (index === 0) textAnchor = "start";
                        if (index === total - 1) textAnchor = "end";

                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text 
                              x={0} 
                              y={0} 
                              dy={20} 
                              textAnchor={textAnchor} 
                              fill="currentColor" 
                              className="text-muted-foreground font-bold" 
                              fontSize={10}
                            >
                              {payload.value}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    }}
                    height={60}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    content={<UnifiedTooltip getStatusColor={(val: number) => val >= 80 ? 'var(--status-high)' : val >= 40 ? 'var(--status-mid)' : 'var(--status-low)'} />}
                  />
                  <Bar 
                    dataKey="value" 
                    name="会话负载"
                    shape={(props: any) => {
                      const { value } = props;
                      const color = value >= 80 ? 'var(--status-high)' : value >= 40 ? 'var(--status-mid)' : 'var(--status-low)';
                      return <CustomBar {...props} fill={color} height={Math.max(props.height, 2)} />;
                    }}
                    activeBar={(props: any) => {
                      const { value } = props;
                      const color = value >= 80 ? 'var(--status-high)' : value >= 40 ? 'var(--status-mid)' : 'var(--status-low)';
                      return <CustomActiveBar {...props} fill={color} height={Math.max(props.height, 2)} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </div>
      </div>

      <PremiumCard className="overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-high/20">
          <div>
            <h3 className="text-lg font-black tracking-tight">长时间会话摘要 (Long Running Sessions)</h3>
            <p className="text-xs text-muted-foreground mt-1">运行时间超过 600 秒的活跃会话监控</p>
          </div>
          <span className="px-3 py-1 bg-error/10 text-error text-[9px] font-black border border-error/20 uppercase tracking-widest">
            高风险监控
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-high/30 text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">SQL_ID</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4 text-right">Last_Call_ET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              <LongSessionRow user="APPS_USER" machine="app-svr-prod-01" program="JDBC Thin Client" sqlId="ax7d8f9g1h2j" event="db file sequential read" time="12,450s" />
              <LongSessionRow user="REPORT_DW" machine="dw-batch-node-4" program="sqlplus@dw-batch" sqlId="6h7k8l9m0n1p" event="direct path read" time="8,920s" />
              <LongSessionRow user="SYS" machine="db-core-prod-01" program="oracle@db-core-prod-01" sqlId="2q3w4e5r6t7y" event="log file sync" time="4,100s" />
              <LongSessionRow user="WEB_APP" machine="web-node-02" program="node@web-node" sqlId="9z8x7c6v5b4n" event="SQL*Net message from client" time="2,100s" />
              <LongSessionRow user="ETL_JOB" machine="etl-srv-05" program="python@etl-srv" sqlId="1a2b3c4d5e6f" event="enq: TX - row lock contention" time="1,850s" />
            </tbody>
          </table>
        </div>
        <Pagination currentPage={sessionPage} totalPages={3} onPageChange={setSessionPage} />
      </PremiumCard>
    </div>
  );
}

function MetricCard({ title, value, unit, detail, icon, compact }: any) {
  const getStatusClass = (val: number) => val >= 90 ? 'bg-status-high' : val >= 20 ? 'bg-status-mid' : 'bg-status-low';
  const getTextColorClass = (val: number) => val >= 90 ? 'text-status-high' : val >= 20 ? 'text-status-mid' : 'text-status-low';
  
  const barColor = getStatusClass(value);
  const color = getTextColorClass(value);

  return (
    <PremiumCard className={`${compact ? 'p-4' : 'p-5'} relative group`}>
      <div className="absolute top-2 right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <h3 className="text-muted-foreground text-[9px] font-black uppercase tracking-widest mb-2">{title}</h3>
      <div className="flex items-end gap-1">
        <span className={`${compact ? 'text-3xl' : 'text-4xl'} font-black font-headline tracking-tighter ${color}`}>{value}</span>
        <span className="text-xs font-medium text-muted-foreground mb-1">{unit}</span>
      </div>
      <div className="mt-3 w-full h-1 bg-surface-high rounded-full overflow-hidden">
        <div className={`h-full ${barColor} shadow-glow`} style={{ width: `${value}%` }}></div>
      </div>
      <p className="mt-3 text-[9px] text-muted-foreground font-mono">{detail}</p>
    </PremiumCard>
  );
}

function SessionStatWithSparkline({ label, value, thresholds }: { label: string, value: number, thresholds: { mid: number, high: number } }) {
  const data = Array.from({ length: 10 }).map((_, i) => ({ v: 20 + Math.random() * 30 + (i * 2) }));
  
  const colorClass = value >= thresholds.high ? 'text-status-high' : 
                     value >= thresholds.mid ? 'text-status-mid' : 'text-status-low';
  
  const colorVar = value >= thresholds.high ? 'var(--status-high)' : 
                   value >= thresholds.mid ? 'var(--status-mid)' : 'var(--status-low)';
                   
  const gradientId = `grad-session-${label}`;

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-border/20 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>
        <span className={`text-2xl font-black font-mono ${colorClass} leading-none tracking-tighter`}>{value}</span>
      </div>
      <div className="w-full h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorVar} stopOpacity={0.3}/>
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
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
  return (
    <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface-high/10">
      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <div className="flex gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded border border-border hover:bg-surface-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded border border-border hover:bg-surface-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
