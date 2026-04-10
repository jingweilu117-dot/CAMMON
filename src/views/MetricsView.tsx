import React from 'react';
import { ArrowUp, LineChart as LineChartIcon, Zap, Shield } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, BarChart, Bar } from 'recharts';
import { InstanceSelector } from '../components/dashboard/DashboardComponents';
import { TimeSelector, ChartLoadingOverlay, CustomBar, CustomActiveBar, UnifiedTooltip } from '../components/ui/ChartUtils';
import { PremiumCard } from '../components/ui/PremiumCard';
import { useMockData } from '../hooks/useMockData';

export function MetricsView() {
  const { timeRange, setTimeRange, isLoading, data: waitData } = useMockData([
    { time: '14:00', 'User I/O': 40, 'System I/O': 24, 'Concurrency': 24, 'Commit': 10, 'Configuration': 5, 'Administrative': 2, 'Network': 15, 'Application': 8, 'Other': 5 },
    { time: '14:05', 'User I/O': 30, 'System I/O': 13, 'Concurrency': 22, 'Commit': 15, 'Configuration': 4, 'Administrative': 1, 'Network': 12, 'Application': 6, 'Other': 3 },
    { time: '14:10', 'User I/O': 45, 'System I/O': 28, 'Concurrency': 30, 'Commit': 12, 'Configuration': 6, 'Administrative': 3, 'Network': 18, 'Application': 10, 'Other': 7 },
  ], 10);

  const waitClasses = [
    { key: 'Other', color: '#ec4899' },
    { key: 'Configuration', color: '#ef4444' },
    { key: 'Network', color: '#a855f7' },
    { key: 'Administrative', color: '#22c55e' },
    { key: 'Application', color: '#eab308' },
    { key: 'Commit', color: '#3b82f6' },
    { key: 'Concurrency', color: '#f97316' },
    { key: 'System I/O', color: '#14b8a6' },
    { key: 'User I/O', color: '#0ea5e9' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-foreground mb-2">核心性能指标</h1>
          <p className="text-muted-foreground text-sm">数据库实时遥测数据，包括缓存命中率、等待类分布及吞吐量趋势。</p>
        </div>
        <InstanceSelector />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <SemicircleGauge title="Buffer Cache Hit" value={98.2} trend="+0.1%" />
        <SemicircleGauge title="Cursor Cache Hit" value={92.4} trend="-0.5%" />
        <SemicircleGauge title="Library Cache Hit" value={99.9} trend="0.0%" />
        <SemicircleGauge title="Row Cache Hit" value={84.1} trend="+2.4%" />
        <SemicircleGauge title="Parse CPU to Total" value={76.5} trend="-1.2%" />
        <SemicircleGauge title="Execute to Parse" value={88.7} trend="+0.8%" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <PremiumCard className="lg:col-span-4 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">数据库等待时间分布</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Wait Class Distribution (ms)</p>
            </div>
            <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
          </div>
          <div className="h-[400px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waitData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  tick={(props: any) => {
                    const { x, y, payload, index } = props;
                    const total = waitData.length;
                    let numTicks = 3;
                    if (timeRange === '2H') numTicks = 4;
                    if (timeRange === '7H') numTicks = 6;
                    if (timeRange === '24H') numTicks = 10;
                    
                    const targetIndices = Array.from({ length: numTicks }).map((_, i) => 
                      Math.floor(i * (total - 1) / (numTicks - 1))
                    );

                    if (targetIndices.includes(index)) {
                      let textAnchor = "middle";
                      if (index === 0) textAnchor = "start";
                      if (index === total - 1) textAnchor = "end";
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={0} dy={20} textAnchor={textAnchor} fill="currentColor" className="text-muted-foreground font-bold" fontSize={10}>{payload.value}</text>
                        </g>
                      );
                    }
                    return null;
                  }}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}ms`} />
                <RechartsTooltip 
                  content={<UnifiedTooltip unit="ms" reverse />}
                />
                <Legend 
                  content={(props: any) => {
                    const { payload } = props;
                    if (!payload) return null;
                    return (
                      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center pt-10">
                        {payload.reverse().map((entry: any, index: number) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                  verticalAlign="bottom" 
                />
                {waitClasses.map((wc) => (
                  <Area
                    key={wc.key}
                    type="linear"
                    dataKey={wc.key}
                    stackId="1"
                    stroke={wc.color}
                    strokeWidth={1}
                    fill={wc.color}
                    fillOpacity={0.4}
                    dot={{ r: 1.5, fill: wc.color, strokeWidth: 0, fillOpacity: 1 }}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                    animationDuration={1000}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <MetricTrendCard title="User Commits" value="12.8k" trend="+14.2% vs prev hour" isPositive={true} color="text-status-low" trendColor="text-status-low" icon={<LineChartIcon size={18} />} data={[0.3, 0.5, 0.4, 0.6, 0.5, 0.8, 0.7]} />
          <MetricTrendCard title="Execute Count" value="4.1M" trend="-2.1% spike detected" isPositive={false} color="text-status-high" trendColor="text-status-high" icon={<Zap size={18} />} data={[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.8]} />
          <MetricTrendCard title="Lock Waits" value="248" trend="+5.4% active locks" isPositive={true} color="text-status-mid" trendColor="text-status-mid" icon={<Shield size={18} />} data={[0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <PremiumCard className="lg:col-span-4">
          <div className="p-6 border-b border-border bg-surface-high/20">
            <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-primary pl-3">等待事件统计详情 (Wait Events Detail)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border bg-surface-high/10">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Wait Class</th>
                  <th className="px-6 py-4 text-right">Total Waits</th>
                  <th className="px-6 py-4 text-right">Time Waited (s)</th>
                  <th className="px-6 py-4 text-right">Avg Wait (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <WaitEventRow name="db file sequential read" class="User I/O" waits="1,245,820" time="4,285.4" avg="3.44" />
                <WaitEventRow name="log file sync" class="Commit" waits="142,503" time="948.2" avg="6.65" />
                <WaitEventRow name="direct path read" class="User I/O" waits="856,122" time="1,210.1" avg="1.41" />
                <WaitEventRow name="resmgr:cpu quantum" class="Administrative" waits="12,401" time="325.6" avg="26.25" isWarning />
                <WaitEventRow name="enq: TX - row lock contention" class="Application" waits="452" time="154.2" avg="341.15" isWarning />
              </tbody>
            </table>
          </div>
        </PremiumCard>

        <div className="lg:col-span-1 bg-primary p-6 text-primary-foreground flex flex-col justify-between relative overflow-hidden group shadow-glow rounded-xl">
          <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/20 blur-[60px] rounded-full transition-all duration-500 group-hover:scale-150"></div>
          <div className="relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <h3 className="text-xl font-black leading-tight">识别性能瓶颈</h3>
            <p className="text-[10px] opacity-80 mt-3 font-bold uppercase tracking-wider">运行过去 60 分钟的全面 AWR 报告，深度分析主要等待事件。</p>
          </div>
          <button className="relative z-10 mt-8 w-full py-3 bg-background text-primary font-black uppercase tracking-widest text-[10px] rounded hover:bg-foreground hover:text-background transition-all">生成 AWR 报告</button>
        </div>
      </section>
    </div>
  );
}

function WaitEventRow({ name, class: waitClass, waits, time, avg, isWarning }: any) {
  const getClassStyle = (c: string) => {
    switch(c) {
      case 'User I/O': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'Commit': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Administrative': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Application': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Network': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Concurrency': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <tr className="hover:bg-surface-high/50 transition-colors border-b border-border last:border-0 group">
      <td className="px-6 py-4 font-bold text-foreground group-hover:text-primary transition-colors">{name}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-black tracking-widest border ${getClassStyle(waitClass)}`}>
          {waitClass}
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-right text-muted-foreground">{waits}</td>
      <td className="px-6 py-4 font-mono text-right text-muted-foreground">{time}</td>
      <td className={`px-6 py-4 text-right font-mono font-black ${isWarning ? 'text-error' : 'text-primary'}`}>{avg}</td>
    </tr>
  );
}

function GaugeCard({ title, value, trend }: any) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let colorClass = 'text-status-high';
  let bgColorClass = 'bg-status-high/5';
  if (value >= 95) {
    colorClass = 'text-status-low';
    bgColorClass = 'bg-status-low/5';
  } else if (value >= 90) {
    colorClass = 'text-status-mid';
    bgColorClass = 'bg-status-mid/5';
  }

  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');

  return (
    <PremiumCard className="p-5 flex flex-col group relative overflow-hidden min-h-[180px]">
      {/* Background Decorative Element */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150 ${bgColorClass.replace('/5', '/40')}`}></div>
      
      <div className="relative z-10 mb-2">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-wider truncate w-full">
          {title}
        </h4>
        <div className={`text-[10px] font-mono font-bold mt-0.5 ${isPositive ? 'text-status-low' : isNegative ? 'text-status-high' : 'text-muted-foreground'}`}>
          {trend} <span className="text-[8px] opacity-60 ml-0.5 uppercase tracking-tighter">vs prev</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle cx="48" cy="48" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="3" strokeDasharray="2 4" opacity={0.5} />
            {/* Progress Track */}
            <circle 
              cx="48" cy="48" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              style={{ 
                filter: `drop-shadow(0 0 6px currentColor)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black font-mono text-foreground tracking-tighter">
              {value}
              <span className="text-[10px] font-bold opacity-50 ml-0.5">%</span>
            </span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

function SemicircleGauge({ value, title, trend }: any) {
  const radius = 60;
  const strokeWidth = 16;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Semicircle: 180 degrees (PI radians)
  const circumference = Math.PI * radius;
  const offset = circumference - (normalizedValue / 100) * circumference;

  let color = '#ef4444'; // Red (status-high)
  if (value >= 95) color = '#22c55e'; // Green (status-low)
  else if (value >= 90) color = '#eab308'; // Yellow (status-mid)

  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');

  return (
    <PremiumCard className="p-5 flex flex-col group relative overflow-hidden min-h-[200px]">
      <div className="relative z-10 mb-4">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-wider truncate w-full">
          {title}
        </h4>
        <div className={`text-[10px] font-mono font-bold mt-0.5 ${isPositive ? 'text-status-low' : isNegative ? 'text-status-high' : 'text-muted-foreground'}`}>
          {trend} <span className="text-[8px] opacity-60 ml-0.5 uppercase tracking-tighter">vs prev</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 mt-2">
        <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
          <svg className="w-40 h-40 absolute top-0" viewBox="0 0 160 160">
            {/* Outer Decorative Arc (Yellow) */}
            <path
              d="M 12,80 A 68,68 0 0 1 148,80"
              fill="none"
              stroke="#eab308"
              strokeWidth="1.5"
              opacity={0.6}
            />
            {/* Background Track */}
            <path
              d="M 20,80 A 60,60 0 0 1 140,80"
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={0.3}
            />
            {/* Progress Track */}
            <path
              d="M 20,80 A 60,60 0 0 1 140,80"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              className="transition-all duration-1000 ease-out"
            />
            {/* Inner Accent Line */}
            <path
              d="M 28,80 A 52,52 0 0 1 132,80"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={0.2}
            />
          </svg>
          <div className="relative z-20 pb-1 flex flex-col items-center">
            <span className="text-4xl font-black font-mono tracking-tighter leading-none" style={{ color }}>
              {value}
            </span>
            <span className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] mt-1">Ratio</span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
function MetricTrendCard({ title, value, trend, isPositive, color, trendColor, icon, data }: any) {
  const chartData = (data || [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.6]).map((v: number, i: number) => {
    const date = new Date();
    date.setMinutes(date.setMinutes(0) - (6 - i) * 2);
    return { 
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      value: v * 100 
    };
  });

  const getMetricColor = (val: number, type: string) => {
    if (type.includes('Commits')) return val >= 80 ? 'var(--status-low)' : val >= 40 ? 'var(--status-mid)' : 'var(--status-high)';
    if (type.includes('Execute')) return val >= 80 ? 'var(--status-low)' : val >= 50 ? 'var(--status-mid)' : 'var(--status-high)';
    if (type.includes('Lock')) return val >= 70 ? 'var(--status-high)' : val >= 30 ? 'var(--status-mid)' : 'var(--status-low)';
    return 'var(--primary)';
  };

  return (
    <PremiumCard className="p-6 flex flex-col justify-between h-full group">
      <div className="flex justify-between items-start">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</h4>
        <div className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      </div>
      <div className="mt-4">
        <div className={`text-4xl font-black ${trendColor} leading-none mb-2 tracking-tighter`}>{value}</div>
        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${trendColor}`}>
          <ArrowUp size={10} className={isPositive ? '' : 'rotate-180'} />
          <span>{trend}</span>
        </div>
      </div>
      <div className="mt-6 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="0%">
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <RechartsTooltip 
              content={<UnifiedTooltip getStatusColor={getMetricColor} />}
            />
            <Bar 
              dataKey="value" 
              shape={(props: any) => {
                const { value } = props;
                const barColor = getMetricColor(value, title);
                return <CustomBar {...props} fill={barColor} height={Math.max(props.height, 2)} />;
              }} 
              activeBar={(props: any) => {
                const { value } = props;
                const barColor = getMetricColor(value, title);
                return <CustomActiveBar {...props} fill={barColor} height={Math.max(props.height, 2)} />;
              }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PremiumCard>
  );
}
