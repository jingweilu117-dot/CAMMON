import React, { useState } from 'react';
import { ArrowUp, Clock, List, Cpu, Plus, Zap, Shield, LineChart as LineChartIcon, X, Copy, ExternalLink, Database } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar } from 'recharts';
import { InstanceSelector } from '../components/dashboard/DashboardComponents';
import { TimeSelector, ChartLoadingOverlay, CustomBar, CustomActiveBar, UnifiedTooltip } from '../components/ui/ChartUtils';
import { PremiumCard } from '../components/ui/PremiumCard';
import { useMockData } from '../hooks/useMockData';

export function SQLAnalysisView() {
  const [selectedSql, setSelectedSql] = useState<any>(null);
  const { timeRange, setTimeRange, isLoading, data: sqlData } = useMockData(
    Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setMinutes(date.setMinutes(0) - (29 - i) * 2);
      return {
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
        value: 40 + Math.random() * 20
      };
    })
  );

  const generateMiniData = () => Array.from({ length: 10 }).map((_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (9 - i) * 2);
    return {
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 90) + 10
    };
  });

  const tpsData = React.useMemo(generateMiniData, []);
  const qpsData = React.useMemo(generateMiniData, []);
  const slowSqlData = React.useMemo(generateMiniData, []);
  const maxTimeData = React.useMemo(generateMiniData, []);
  const softParseData = React.useMemo(generateMiniData, []);
  const hardParseData = React.useMemo(generateMiniData, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-foreground mb-2">SQL 性能分析</h1>
          <p className="text-muted-foreground text-sm">深度分析数据库查询性能，识别高负载 SQL 与资源消耗瓶颈。</p>
        </div>
        <InstanceSelector />
      </header>

      <section className="grid grid-cols-12 gap-6">
        <PremiumCard className="col-span-12 lg:col-span-8 p-8 flex flex-col">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">SQL 执行负载趋势</span>
                <div className="flex items-baseline gap-4 mt-2">
                  <h3 className="font-headline text-5xl font-black text-primary tracking-tighter">84.2<span className="text-2xl ml-1">%</span></h3>
                  <div className="flex items-center text-error text-[10px] font-black bg-error/10 px-2 py-0.5 border border-error/20 rounded-sm">
                    <ArrowUp size={10} className="mr-1" />
                    <span>12% 较昨日</span>
                  </div>
                </div>
              </div>
              <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
            </div>
            <div className="mt-8 h-64 w-full relative">
              {isLoading && <ChartLoadingOverlay />}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sqlData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }} barCategoryGap="0%">
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
                      const total = sqlData.length;
                      
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
                    content={<UnifiedTooltip getStatusColor={(val: number) => val >= 80 ? 'var(--status-high)' : val >= 40 ? 'var(--status-mid)' : 'var(--status-low)'} unit="%" />}
                  />
                  <Bar 
                    dataKey="value" 
                    name="SQL负载"
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
          </div>
        </PremiumCard>

        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
          <MiniChartCard title="TPS" value="3,241" unit="/s" trend="+12.4%" isPositive={true} icon={<Zap size={14} />} data={tpsData} />
          <MiniChartCard title="QPS" value="12,850" unit="/s" trend="+8.2%" isPositive={true} icon={<Zap size={14} />} data={qpsData} />
          <MiniChartCard title="SLOW SQL" value="12" unit="cnt" trend="-2" isPositive={true} icon={<Clock size={14} />} data={slowSqlData} />
          <MiniChartCard title="MAX TIME" value="4.2" unit="s" trend="+0.5s" isPositive={false} icon={<Clock size={14} />} data={maxTimeData} />
          <MiniChartCard title="SOFT PARSE" value="842" unit="/s" trend="+15" isPositive={true} icon={<List size={14} />} data={softParseData} />
          <MiniChartCard title="HARD PARSE" value="12" unit="/s" trend="+1" isPositive={false} icon={<List size={14} />} data={hardParseData} />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-black tracking-tight">TOP SQL 资源消耗排行榜</h3>
            <p className="text-xs text-muted-foreground mt-1">基于 CPU 时间、执行次数和资源占比的综合性能分析</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-muted text-[10px] font-black border border-border hover:bg-foreground hover:text-background transition-all uppercase tracking-widest">导出报告</button>
            <button className="px-4 py-2 rounded bg-muted text-[10px] font-black border border-border hover:bg-foreground hover:text-background transition-all uppercase tracking-widest">过滤条件</button>
          </div>
        </div>
        <PremiumCard className="overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="col-span-1">SQL ID</div>
            <div className="col-span-2">PLAN HASH</div>
            <div className="col-span-3">SQL 预览</div>
            <div className="col-span-1 text-right">平均耗时</div>
            <div className="col-span-1 text-right">总耗时</div>
            <div className="col-span-2 text-right">执行次数</div>
            <div className="col-span-2 text-right">资源占比</div>
          </div>
          <SQLAnalysisRow 
            id="5a9s2k1" 
            planHash="382910472"
            sql="SELECT * FROM orders WHERE status = 'PENDING' AND created_at > NOW() - INTERVAL '1 day' ORDER BY created_at DESC LIMIT 100" 
            time="1,240 ms" 
            totalTime="42.5h"
            count="1.2M" 
            pct={78} 
            tags={['FULL SCAN', 'JOIN MISMATCH']} 
            onSelect={() => setSelectedSql({
              id: "5a9s2k1",
              planHash: "382910472",
              sql: "SELECT * FROM orders WHERE status = 'PENDING' AND created_at > NOW() - INTERVAL '1 day' ORDER BY created_at DESC LIMIT 100",
              time: "1,240 ms",
              totalTime: "42.5h",
              count: "1.2M",
              pct: 78,
              tags: ['FULL SCAN', 'JOIN MISMATCH']
            })}
          />
          <SQLAnalysisRow 
            id="2n8v3m4" 
            planHash="129485720"
            sql="UPDATE user_profiles SET last_login = NOW(), login_count = login_count + 1 WHERE user_id IN (SELECT id FROM users WHERE active = true)" 
            time="45 ms" 
            totalTime="18.2h"
            count="48.2M" 
            pct={42} 
            tags={['LOCK WAIT']} 
            onSelect={() => setSelectedSql({
              id: "2n8v3m4",
              planHash: "129485720",
              sql: "UPDATE user_profiles SET last_login = NOW(), login_count = login_count + 1 WHERE user_id IN (SELECT id FROM users WHERE active = true)",
              time: "45 ms",
              totalTime: "18.2h",
              count: "48.2M",
              pct: 42,
              tags: ['LOCK WAIT']
            })}
          />
          <SQLAnalysisRow 
            id="9p1z6q0" 
            planHash="992837415"
            sql="INSERT INTO analytics_events (event_type, payload, ts, session_id) VALUES ($1, $2, $3, $4) RETURNING id" 
            time="8 ms" 
            totalTime="5.4h"
            count="156.4M" 
            pct={15} 
            tags={['HIGH FREQUENCY']} 
            onSelect={() => setSelectedSql({
              id: "9p1z6q0",
              planHash: "992837415",
              sql: "INSERT INTO analytics_events (event_type, payload, ts, session_id) VALUES ($1, $2, $3, $4) RETURNING id",
              time: "8 ms",
              totalTime: "5.4h",
              count: "156.4M",
              pct: 15,
              tags: ['HIGH FREQUENCY']
            })}
          />
        </PremiumCard>
      </section>

      {/* SQL Detail Modal */}
      {selectedSql && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedSql(null)}></div>
          <PremiumCard className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-primary/20 animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-high/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter">SQL 详细分析 (SQL Detail)</h3>
                  <p className="text-xs text-muted-foreground font-mono">ID: {selectedSql.id} | Plan Hash: {selectedSql.planHash}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSql(null)}
                className="p-2 hover:bg-surface-high rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-l-2 border-primary pl-3">完整 SQL 文本</h4>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    <Copy size={12} />
                    复制文本
                  </button>
                </div>
                <div className="bg-surface-high/50 rounded-xl p-6 border border-border/50 font-mono text-sm leading-relaxed text-foreground shadow-inner">
                  {selectedSql.sql}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DetailStat label="平均耗时" value={selectedSql.time} />
                <DetailStat label="总耗时" value={selectedSql.totalTime} />
                <DetailStat label="执行次数" value={selectedSql.count} />
                <DetailStat label="资源占比" value={`${selectedSql.pct}%`} isHighlight />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">性能标签 (Tags)</h4>
                <div className="flex gap-3">
                  {selectedSql.tags.map((tag: string) => (
                    <span key={tag} className={`px-3 py-1 rounded text-[10px] font-black border tracking-widest uppercase ${tag === 'FULL SCAN' ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface-high/10 flex justify-end gap-4">
              <button className="px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-widest border border-border hover:bg-surface-high transition-all">查看执行计划</button>
              <button className="px-6 py-2.5 rounded bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all">优化建议</button>
            </div>
          </PremiumCard>
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <StatGroupCard title="平均执行时间" icon={<Clock size={16} />} />
        <StatGroupCard title="扫描行数统计" icon={<List size={16} />} />
        <StatGroupCard title="逻辑读/物理读" icon={<Cpu size={16} />} />
      </section>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow-strong flex items-center justify-center hover:scale-110 transition-all active:scale-95 group">
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}

function MiniChartCard({ title, value, unit, trend, isPositive, icon, data }: any) {
  const getStatusColor = (val: number, type: string) => {
    switch (type) {
      case 'TPS':
        return val >= 3000 ? 'var(--status-high)' : val >= 500 ? 'var(--status-mid)' : 'var(--status-low)';
      case 'QPS':
        return val >= 5000 ? 'var(--status-high)' : val >= 2500 ? 'var(--status-mid)' : 'var(--status-low)';
      case 'SLOW SQL':
        return val >= 40 ? 'var(--status-high)' : val >= 10 ? 'var(--status-mid)' : 'var(--status-low)';
      case 'MAX TIME':
        return val >= 600 ? 'var(--status-high)' : val >= 60 ? 'var(--status-mid)' : 'var(--status-low)';
      case 'SOFT PARSE':
        return val >= 95 ? 'var(--status-low)' : val >= 80 ? 'var(--status-mid)' : 'var(--status-high)';
      case 'HARD PARSE':
        return val >= 20 ? 'var(--status-high)' : val >= 5 ? 'var(--status-mid)' : 'var(--status-low)';
      default:
        return 'var(--primary)';
    }
  };

  const trendColor = isPositive ? 'text-status-low' : 'text-status-high';

  return (
    <PremiumCard className="p-4 flex flex-col justify-between group h-40">
      <div className="flex justify-between items-start">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black">{title}</span>
        <div className="text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mt-2">
        <h3 className="text-2xl font-headline font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
        <div className={`flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider ${trendColor}`}>
          <ArrowUp size={8} className={isPositive ? '' : 'rotate-180'} />
          <span>{trend}</span>
        </div>
      </div>

      <div className="flex items-end h-12 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="0%">
            <XAxis dataKey="time" hide />
            <RechartsTooltip 
              content={<UnifiedTooltip getStatusColor={getStatusColor} unit={unit} />}
            />
            <Bar 
              dataKey="value" 
              name={title}
              shape={(props: any) => {
                const { x, y, width, height, value } = props;
                const color = getStatusColor(value, title);
                return <CustomBar {...props} fill={color} height={Math.max(height, 2)} />;
              }}
              activeBar={(props: any) => {
                const { x, y, width, height, value } = props;
                const color = getStatusColor(value, title);
                return <CustomActiveBar {...props} fill={color} height={Math.max(height, 2)} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PremiumCard>
  );
}

function SQLAnalysisRow({ id, planHash, sql, time, totalTime, count, pct, tags, onSelect }: any) {
  return (
    <div 
      onClick={onSelect}
      className="grid grid-cols-12 px-6 py-5 hover:bg-muted/50 transition-all duration-300 cursor-pointer items-center border-b border-border last:border-0 group"
    >
      <div className="col-span-1 font-mono text-sm text-primary font-black group-hover:underline tracking-tighter">{id}</div>
      <div className="col-span-2 font-mono text-xs text-muted-foreground font-bold">{planHash}</div>
      <div className="col-span-3 pr-8">
        <code className="text-[11px] text-foreground font-mono truncate block bg-muted/50 px-2.5 py-1.5 rounded-sm border border-border/50 group-hover:border-primary/30 transition-colors">
          {sql}
        </code>
      </div>
      <div className="col-span-1 text-right text-sm font-mono font-black text-foreground tracking-tight">{time}</div>
      <div className="col-span-1 text-right text-sm font-mono font-black text-foreground tracking-tight">{totalTime}</div>
      <div className="col-span-2 text-right text-sm font-mono font-black text-foreground tracking-tight">{count}</div>
      <div className="col-span-2">
        <div className="flex items-center gap-3 justify-end">
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${pct > 70 ? 'bg-error' : 'bg-primary'} shadow-glow transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className="text-xs font-black font-mono w-8 text-right text-foreground">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value, isHighlight }: any) {
  return (
    <div className="p-4 rounded-xl bg-surface-high/30 border border-border/50">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
      <p className={`text-2xl font-black font-mono tracking-tighter ${isHighlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function StatGroupCard({ title, icon }: any) {
  return (
    <PremiumCard className="p-6">
      <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-2.5 text-muted-foreground">
        <span className="text-primary p-1.5 bg-primary/5 rounded-md">{icon}</span>
        {title}
      </h4>
      <div className="space-y-6">
        <StatBar label="5a9s2k1" value="845k" pct={85} />
        <StatBar label="2n8v3m4" value="122k" pct={30} />
        <StatBar label="9p1z6q0" value="15.4k" pct={10} />
      </div>
    </PremiumCard>
  );
}

function StatBar({ label, value, pct }: any) {
  return (
    <div className="flex flex-col gap-2.5 group cursor-pointer">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <span className="text-primary font-mono group-hover:scale-110 transition-transform">{value}</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary shadow-glow transition-all duration-1000" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
