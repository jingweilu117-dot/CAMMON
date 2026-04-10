import React from 'react';
import { Shield, Database, Server, Cpu, Search, RefreshCw, Zap, Plus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip as RechartsTooltip } from 'recharts';
import { InstanceCard } from '../components/dashboard/InstanceCard';
import { TablespaceRow, LongSessionRow } from '../components/dashboard/DashboardComponents';
import { ChartLoadingOverlay, CustomBar, CustomActiveBar, UnifiedTooltip } from '../components/ui/ChartUtils';
import { PremiumCard } from '../components/ui/PremiumCard';
import { useMockData } from '../hooks/useMockData';

export function DashboardView() {
  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <SummaryCard 
          title="全局运行健康度" 
          value="99.8" 
          unit="%" 
          trend="+0.2%" 
          isPositive={true} 
          icon={<Shield size={18} />} 
          color="status-low"
        />
        <SummaryCard 
          title="纳管数据总量" 
          value="1.24" 
          unit="PB" 
          trend="2.4 TB" 
          isPositive={true} 
          icon={<Database size={18} />} 
          color="primary"
          subText="今日新增"
        />
        <SummaryCard 
          title="实例状态" 
          value="24" 
          unit="" 
          trend="2 离线" 
          isPositive={false} 
          icon={<Server size={18} />} 
          color="status-high"
          customTrend={
            <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-2">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-status-low mr-1"></span>22 在线</span>
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-status-high mr-1"></span>2 离线</span>
            </div>
          }
        />
        <SummaryCard 
          title="总 CPU 负载" 
          value="42" 
          unit="%" 
          trend="-5%" 
          isPositive={true} 
          icon={<Cpu size={18} />} 
          color="status-mid"
          chart={
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 30}, {v: 45}, {v: 35}, {v: 50}, {v: 42}]}>
                  <defs>
                    <linearGradient id="cpuMini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-mid)" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="var(--status-mid)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip content={<UnifiedTooltip title="CPU" />} />
                  <Area type="monotone" dataKey="v" stroke="var(--status-mid)" strokeWidth={1.5} fill="url(#cpuMini)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        />
        <SummaryCard 
          title="活跃会话数" 
          value="842" 
          unit="" 
          trend="+12" 
          isPositive={false} 
          icon={<RefreshCw size={18} />} 
          color="status-mid"
          subText="较上小时"
          chart={
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 20}, {v: 35}, {v: 25}, {v: 45}, {v: 30}]}>
                  <defs>
                    <linearGradient id="sessionMini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-mid)" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="var(--status-mid)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip content={<UnifiedTooltip title="会话" />} />
                  <Area type="monotone" dataKey="v" stroke="var(--status-mid)" strokeWidth={1.5} fill="url(#sessionMini)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        />
        <SummaryCard 
          title="平均 IOPS" 
          value="12.4" 
          unit="k" 
          trend="+1.2k" 
          isPositive={true} 
          icon={<Zap size={18} />} 
          color="status-low"
          subText="峰值 18k"
          chart={
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 10}, {v: 15}, {v: 12}, {v: 18}, {v: 14}]}>
                  <defs>
                    <linearGradient id="iopsMini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-low)" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="var(--status-low)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip content={<UnifiedTooltip title="IOPS" />} />
                  <Area type="monotone" dataKey="v" stroke="var(--status-low)" strokeWidth={1.5} fill="url(#iopsMini)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black flex items-center gap-3">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            核心数据库实例
          </h3>
          <div className="flex items-center gap-1 bg-surface-low p-1 rounded border border-border">
            {['全部', 'Oracle', 'MySQL', 'Postgres'].map((t, i) => (
              <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InstanceCard name="Oracle_Prod_01" ip="192.168.1.100" type="O" cpu={78} ramPct={82} ramText="13.1 GB / 16 GB" diskPct={65} diskText="/u01: 325G / 500G" tps={4200} qps={9100} sessions={124} status="ONLINE" />
          <InstanceCard name="MySQL_Analytic_DW" ip="10.0.4.52" type="M" cpu={96} ramPct={98} ramText="62.7 GB / 64 GB" diskPct={88} diskText="/data: 1.8T / 2.0T" tps={6500} qps={12000} sessions={452} status="ONLINE" />
          <InstanceCard name="PG_Test_Legacy" ip="192.168.1.105" type="P" cpu={0} ramPct={0} ramText="0 GB / 8 GB" diskPct={0} diskText="/var/lib/pg: 0G / 100G" tps={0} qps={0} sessions={0} status="OFFLINE" />
        </div>
      </section>

      <section>
        <PremiumCard className="overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-surface-high/20">
            <div>
              <h3 className="text-lg font-black tracking-tight">实例监控列表</h3>
              <p className="text-xs text-muted-foreground mt-1">实时监控纳管数据库实例的运行状态与核心指标</p>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-xs font-black transition-all shadow-glow active:scale-95">
              <Plus size={14} />
              新增实例
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-high/30 text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border">
                <tr>
                  <th className="px-6 py-4">实例名称</th>
                  <th className="px-6 py-4">IP 地址</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4 text-right">数据大小</th>
                  <th className="px-6 py-4 text-right">操作系统</th>
                  <th className="px-6 py-4 text-right">数据库类型及版本</th>
                  <th className="px-6 py-4 text-right">运行时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <InstanceTableRow name="Oracle_Prod_01" deployType="集群" status="ONLINE" dataSize="4.2 TB" os="RedHat 8.6" ip="192.168.1.100" dbVersion="Oracle 19c" uptime="124d" color="tertiary" />
                <InstanceTableRow name="MySQL_Analytic_DW" deployType="单机" status="ONLINE" dataSize="850 GB" os="Ubuntu 22.04" ip="10.0.4.52" dbVersion="MySQL 8.0" uptime="45d" color="error" />
                <InstanceTableRow name="PG_Test_Legacy" deployType="备库" status="OFFLINE" dataSize="1.2 TB" os="CentOS 7.9" ip="192.168.1.105" dbVersion="PostgreSQL 14" uptime="--" color="muted" />
                <InstanceTableRow name="Redis_Cache_Cluster" deployType="集群" status="ONLINE" dataSize="128 GB" os="Debian 11" ip="172.16.0.42" dbVersion="Redis 7.0" uptime="12d" color="primary" />
              </tbody>
            </table>
          </div>
        </PremiumCard>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, unit, trend, isPositive, icon, color, subText, customTrend, chart }: any) {
  const colorClass = color === 'status-low' ? 'text-status-low' : 
                     color === 'status-mid' ? 'text-status-mid' : 
                     color === 'status-high' ? 'text-status-high' : 'text-primary';
  
  const bgColorClass = color === 'status-low' ? 'bg-status-low/5' : 
                       color === 'status-mid' ? 'bg-status-mid/5' : 
                       color === 'status-high' ? 'bg-status-high/5' : 'bg-primary/5';

  return (
    <PremiumCard className="p-6 flex flex-col justify-between h-44 group">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg ${bgColorClass} ${colorClass} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-80">{title}</span>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <h4 className="text-4xl font-headline font-black tracking-tighter text-foreground leading-none mb-1">
            {value}<span className="text-lg ml-1 text-muted-foreground font-normal">{unit}</span>
          </h4>
          {customTrend ? customTrend : (
            <div className="text-[10px] text-muted-foreground mt-2 flex items-center font-bold uppercase tracking-wider">
              <span className={`${isPositive ? 'text-status-low' : 'text-status-high'} flex items-center mr-1.5`}>
                {isPositive ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                )}
                {trend}
              </span>
              <span className="opacity-60">{subText || 'vs 昨天'}</span>
            </div>
          )}
        </div>
        <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          {chart}
        </div>
      </div>
    </PremiumCard>
  );
}

function InstanceTableRow({ name, deployType, status, dataSize, os, ip, dbVersion, uptime, color }: any) {
  const isOffline = status === 'OFFLINE';
  return (
    <tr className="hover:bg-muted/50 transition-all duration-300 group cursor-pointer border-b border-border/50 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="font-black text-sm text-foreground group-hover:text-primary transition-colors">{name}</span>
          <span className="px-2 py-0.5 bg-surface-high/50 border border-border rounded-full text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
            {deployType}
          </span>
        </div>
      </td>
      <td className={`px-6 py-5 font-mono font-black text-sm ${isOffline ? 'text-muted-foreground' : 'text-foreground'}`}>{ip}</td>
      <td className="px-6 py-5">
        <span className={`px-2.5 py-1 rounded-sm text-[9px] font-black uppercase border tracking-widest ${
          isOffline ? 'bg-status-high/10 text-status-high border-status-high/20' : 'bg-status-low/10 text-status-low border-status-low/20'
        }`}>
          {status}
        </span>
      </td>
      <td className={`px-6 py-5 text-right font-mono font-black text-sm ${isOffline ? 'text-muted-foreground' : 'text-foreground'}`}>{dataSize}</td>
      <td className={`px-6 py-5 text-right font-mono font-black text-sm ${isOffline ? 'text-muted-foreground' : 'text-foreground'}`}>{os}</td>
      <td className={`px-6 py-5 text-right font-mono font-black text-sm ${isOffline ? 'text-muted-foreground' : 'text-foreground'}`}>{dbVersion}</td>
      <td className="px-6 py-5 text-right text-muted-foreground text-[10px] font-black uppercase tracking-widest">{uptime}</td>
    </tr>
  );
}
