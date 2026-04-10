import React, { useState } from 'react';
import { HardDrive, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { InstanceSelector, TablespaceRow } from '../components/dashboard/DashboardComponents';
import { PremiumCard } from '../components/ui/PremiumCard';

export function CapacityView() {
  const [tablespacePage, setTablespacePage] = useState(1);
  const [fsPage, setFsPage] = useState(1);
  const [asmPage, setAsmPage] = useState(1);

  const asmData = [
    { name: 'DATA', total: 5120, used: 3840, pct: 75, status: 'NORMAL' },
    { name: 'RECO', total: 1024, used: 256, pct: 25, status: 'NORMAL' },
    { name: 'ARCH', total: 2048, used: 1843, pct: 90, status: 'WARNING' },
  ];

  const fsData = [
    { mount: '/', total: 100, used: 45, pct: 45 },
    { mount: '/u01', total: 500, used: 320, pct: 64 },
    { mount: '/u02', total: 1000, used: 850, pct: 85 },
    { mount: '/backup', total: 2000, used: 1200, pct: 60 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-foreground mb-2">容量管理</h1>
          <p className="text-muted-foreground text-sm">全面监控数据库表空间、操作系统文件系统及 ASM 共享磁盘容量状态。</p>
        </div>
        <InstanceSelector />
      </header>

      {/* 1. 表空间容量管理 */}
      <PremiumCard className="overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-high/20">
          <div>
            <h3 className="text-lg font-black tracking-tight">表空间容量管理 (Tablespace Capacity)</h3>
            <p className="text-xs text-muted-foreground mt-1">数据库逻辑存储结构使用情况</p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="bg-surface border border-border text-xs pl-9 pr-4 py-2 w-full md:w-64 rounded focus:ring-1 focus:ring-primary/40 outline-none" placeholder="搜索表空间..." type="text" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-high/30 text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border">
              <tr>
                <th className="px-6 py-4">名称</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4 text-right">总容量 (GB)</th>
                <th className="px-6 py-4 text-right">已使用 (GB)</th>
                <th className="px-6 py-4">使用率</th>
                <th className="px-6 py-4">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              <TablespaceRow name="SYSTEM" type="PERMANENT" total="10.00" used="8.42" pct={84} />
              <TablespaceRow name="TBS_DATA_01" type="PERMANENT" total="2048.00" used="1820.00" pct={89} />
              <TablespaceRow name="SYSAUX" type="PERMANENT" total="20.00" used="12.10" pct={60} />
              <TablespaceRow name="UNDOTBS1" type="UNDO" total="128.00" used="32.00" pct={25} />
              <TablespaceRow name="TEMP" type="TEMPORARY" total="64.00" used="4.50" pct={7} />
              <TablespaceRow name="USERS" type="PERMANENT" total="512.00" used="410.00" pct={80} />
              <TablespaceRow name="TBS_INDEX_01" type="PERMANENT" total="1024.00" used="950.00" pct={92} />
            </tbody>
          </table>
        </div>
        <Pagination currentPage={tablespacePage} totalPages={5} onPageChange={setTablespacePage} />
      </PremiumCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. 操作系统本地文件系统管理 */}
        <PremiumCard className="overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border bg-surface-high/20">
            <h3 className="text-lg font-black tracking-tight">操作系统本地文件系统 (OS File Systems)</h3>
            <p className="text-xs text-muted-foreground mt-1">主机本地磁盘挂载点监控</p>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-high/30 text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border">
                <tr>
                  <th className="px-6 py-4">挂载点</th>
                  <th className="px-6 py-4 text-right">容量 (GB)</th>
                  <th className="px-6 py-4">使用率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {fsData.map((fs) => (
                  <tr key={fs.mount} className="hover:bg-surface-high/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{fs.mount}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{fs.used}G / {fs.total}G</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-surface-high rounded-full overflow-hidden min-w-[100px]">
                          <div 
                            className={`h-full ${fs.pct >= 90 ? 'bg-status-high' : fs.pct >= 70 ? 'bg-status-mid' : 'bg-status-low'}`} 
                            style={{ width: `${fs.pct}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-mono font-black ${fs.pct >= 90 ? 'text-status-high' : fs.pct >= 70 ? 'text-status-mid' : 'text-status-low'}`}>{fs.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={fsPage} totalPages={2} onPageChange={setFsPage} />
        </PremiumCard>

        {/* 3. 集群 ASM 共享磁盘管理 */}
        <PremiumCard className="overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border bg-surface-high/20 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black tracking-tight">ASM 共享磁盘组 (ASM Disk Groups)</h3>
              <p className="text-xs text-muted-foreground mt-1">集群共享存储容量监控</p>
            </div>
            <HardDrive size={20} className="text-primary opacity-50" />
          </div>
          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {asmData.map((group) => (
                <div key={group.name} className="p-4 rounded-lg bg-surface-high/10 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Disk Group</span>
                      <h4 className="text-sm font-black text-foreground">{group.name}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                      group.status === 'NORMAL' ? 'bg-status-low/10 text-status-low border border-status-low/20' : 'bg-status-high/10 text-status-high border border-status-high/20'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <div className="text-xs font-mono text-muted-foreground">
                      <span className="text-foreground font-black">{group.used}</span> / {group.total} GB
                    </div>
                    <div className={`text-lg font-black font-mono tracking-tighter ${
                      group.pct >= 90 ? 'text-status-high' : group.pct >= 70 ? 'text-status-mid' : 'text-status-low'
                    }`}>
                      {group.pct}%
                    </div>
                  </div>
                  <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${group.pct >= 90 ? 'bg-status-high' : group.pct >= 70 ? 'bg-status-mid' : 'bg-status-low'}`} 
                      style={{ width: `${group.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart data={asmData} />
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <Pagination currentPage={asmPage} totalPages={1} onPageChange={setAsmPage} />
        </PremiumCard>
      </div>
    </div>
  );
}

function RechartsPieChart({ data }: { data: any[] }) {
  const chartData = data.map(d => ({ name: d.name, value: d.used }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <RePieChart width={200} height={200}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
        ))}
      </Pie>
      <RechartsTooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '12px'
        }}
        itemStyle={{ color: '#fff' }}
      />
    </RePieChart>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
  return (
    <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface-high/10 mt-auto">
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
