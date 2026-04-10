import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, MoreVertical } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Line, BarChart, Bar } from 'recharts';
import { TimeSelector, ChartLoadingOverlay, CustomBar, CustomActiveBar, UnifiedTooltip } from '../components/ui/ChartUtils';
import { PremiumCard } from '../components/ui/PremiumCard';
import { useMockData } from '../hooks/useMockData';

export function AlertsView() {
  const { timeRange, setTimeRange, isLoading, data: alertTrendData } = useMockData([
    { time: '00:00', Critical: 2, Warning: 5, Info: 12 },
    { time: '04:00', Critical: 1, Warning: 3, Info: 15 },
    { time: '08:00', Critical: 5, Warning: 12, Info: 30 },
    { time: '12:00', Critical: 3, Warning: 8, Info: 25 },
    { time: '16:00', Critical: 8, Warning: 15, Info: 40 },
    { time: '20:00', Critical: 2, Warning: 6, Info: 20 },
    { time: '24:00', Critical: 1, Warning: 4, Info: 10 },
  ]);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-foreground mb-2">告警管理中心</h1>
          <p className="text-muted-foreground text-sm">集中管理数据库告警事件，实时监控系统健康度与响应效率。</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded font-black text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-glow">新建策略</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AlertStatCard title="严重告警" value="12" trend="+2 自昨日" color="bg-error" icon={<AlertCircle size={20} className="text-error" />} />
        <AlertStatCard title="警告提醒" value="28" trend="-5 自昨日" color="bg-tertiary" icon={<AlertTriangle size={20} className="text-tertiary" />} />
        <AlertStatCard title="常规通知" value="145" trend="+12 持续增加" color="bg-primary" icon={<Info size={20} className="text-primary" />} />
        <AlertStatCard title="恢复率 (MTTR)" value="94.2%" trend="平均响应时间 < 8min" color="bg-primary" icon={<CheckCircle2 size={20} className="text-primary" />} isMTTR />
      </section>

      <PremiumCard className="overflow-hidden">
        <div className="px-8 py-4 bg-surface-high/20 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-surface border border-border rounded p-1">
              <button className="px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground">全部告警</button>
              <button className="px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">未处理</button>
              <button className="px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">已屏蔽</button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">排序方式:</span>
            <select className="bg-transparent border-none text-foreground font-black focus:ring-0 cursor-pointer outline-none">
              <option>最近发生</option>
              <option>级别最高</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-high/10 text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-border">
              <tr>
                <th className="px-8 py-4">严重程度</th>
                <th className="px-8 py-4">告警内容</th>
                <th className="px-8 py-4">相关实例</th>
                <th className="px-8 py-4">首次发生时间</th>
                <th className="px-8 py-4">状态</th>
                <th className="px-8 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AlertRow level="CRITICAL" title="CPU 使用率超过阈值 (98%)" desc="检测到持续高负载，可能影响服务稳定性。" instance="db-cluster-prod-01" time="2023-11-24 14:22:15" status="正在发生" />
              <AlertRow level="WARNING" title="慢查询堆积异常" desc="过去 5 分钟内慢查询数量 > 50 条。" instance="read-replica-04" time="2023-11-24 14:18:02" status="待处理" />
              <AlertRow level="INFO" title="自动备份任务开始" desc="系统已启动例行全量备份流程。" instance="global-index-master" time="2023-11-24 14:00:00" status="进行中" />
            </tbody>
          </table>
        </div>
      </PremiumCard>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <PremiumCard className="p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-lg tracking-tight">告警频率趋势 (Alert Frequency)</h4>
            <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
          </div>
          <div className="h-[300px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 40 }} barCategoryGap="0%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  tick={(props: any) => {
                    const { x, y, payload, index } = props;
                    const total = alertTrendData.length;
                    const numTicks = timeRange === '1H' ? 3 : timeRange === '2H' ? 4 : timeRange === '7H' ? 6 : 10;
                    const targetIndices = Array.from({ length: numTicks }).map((_, i) => Math.floor(i * (total - 1) / (numTicks - 1)));
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
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  content={<UnifiedTooltip />}
                />
                <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="Critical" name="严重" fill="var(--error)" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
                <Bar dataKey="Warning" name="警告" fill="var(--tertiary)" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        <PremiumCard className="p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-lg tracking-tight">告警级别分布 (Distribution)</h4>
            <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
          </div>
          <div className="h-[300px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 40 }} barCategoryGap="0%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  tick={(props: any) => {
                    const { x, y, payload, index } = props;
                    const total = alertTrendData.length;
                    const numTicks = timeRange === '1H' ? 3 : timeRange === '2H' ? 4 : timeRange === '7H' ? 6 : 10;
                    const targetIndices = Array.from({ length: numTicks }).map((_, i) => Math.floor(i * (total - 1) / (numTicks - 1)));
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
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  content={<UnifiedTooltip />}
                />
                <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="Info" name="通知" fill="var(--primary)" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
                <Bar dataKey="Warning" name="警告" fill="var(--tertiary)" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
                <Bar dataKey="Critical" name="严重" fill="var(--error)" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      </section>
    </div>
  );
}

function AlertStatCard({ title, value, trend, color, icon, isMTTR }: any) {
  return (
    <PremiumCard className="p-6 relative group">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
      <div className="absolute top-4 right-4 p-2.5 bg-muted/30 rounded-lg group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{title}</p>
      <div className="flex items-baseline space-x-2">
        <span className={`text-4xl font-black font-headline tracking-tighter ${isMTTR ? 'text-primary' : 'text-foreground'}`}>{value}</span>
        {!isMTTR && <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{trend}</span>}
      </div>
      {isMTTR ? (
        <p className="mt-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">{trend}</p>
      ) : (
        <div className="mt-5 h-1 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color} w-2/3 shadow-glow`}></div>
        </div>
      )}
    </PremiumCard>
  );
}

function AlertRow({ level, title, desc, instance, time, status }: any) {
  const isCritical = level === 'CRITICAL';
  const isWarning = level === 'WARNING';
  return (
    <tr className="hover:bg-muted/50 transition-all duration-300 group border-b border-border/50 last:border-0">
      <td className="px-8 py-6">
        <span className={`flex items-center space-x-2 font-black text-[10px] uppercase tracking-widest ${isCritical ? 'text-error' : isWarning ? 'text-tertiary' : 'text-primary'}`}>
          <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-error animate-pulse shadow-glow' : isWarning ? 'bg-tertiary' : 'bg-primary'}`}></span>
          <span>{level}</span>
        </span>
      </td>
      <td className="px-8 py-6">
        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors mb-1">{title}</p>
        <p className="text-[11px] text-muted-foreground font-bold leading-relaxed max-w-md">{desc}</p>
      </td>
      <td className="px-8 py-6 text-[11px] font-mono font-black text-blue-600 dark:text-secondary tracking-tighter uppercase">{instance}</td>
      <td className="px-8 py-6 text-[11px] text-muted-foreground font-mono font-bold">{time}</td>
      <td className="px-8 py-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[9px] font-black border tracking-widest uppercase ${isCritical ? 'bg-error/10 text-error border-error/20' : isWarning ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-6 text-right">
        <MoreVertical size={16} className="text-muted-foreground hover:text-foreground cursor-pointer ml-auto transition-colors" />
      </td>
    </tr>
  );
}
