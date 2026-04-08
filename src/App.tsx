/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  LineChart as LineChartIcon, 
  Zap, 
  Bell, 
  Search, 
  RefreshCw, 
  Moon, 
  Sun,
  User,
  Shield,
  ChevronDown,
  ArrowUp,
  MoreVertical,
  Clock,
  Cpu,
  List,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  Settings,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, BarChart, Bar, Rectangle
} from 'recharts';

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const cleanFill = fill.replace('#', '');
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${cleanFill}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={fill} stopOpacity={0.05} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <Rectangle x={x} y={y} width={width} height={height} fill={`url(#grad-${cleanFill})`} radius={[2, 2, 0, 0]} />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={fill} strokeWidth={1} strokeOpacity={0.5} />
    </g>
  );
};

const CustomActiveBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const cleanFill = fill.replace('#', '');
  return (
    <g>
      <defs>
        <linearGradient id={`grad-active-${cleanFill}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={fill} stopOpacity={0.2} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.8} />
        </linearGradient>
        <filter id={`glow-${cleanFill}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <Rectangle x={x} y={y} width={width} height={height} fill={`url(#grad-active-${cleanFill})`} radius={[2, 2, 0, 0]} />
      {/* Glow effect simulation */}
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={fill} strokeWidth={4} filter={`url(#glow-${cleanFill})`} />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.9} />
    </g>
  );
};

type View = 'dashboard' | 'instances' | 'sql' | 'metrics' | 'alerts';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'instances', label: '实例列表', icon: Database },
    { id: 'sql', label: 'SQL 分析', icon: LineChartIcon },
    { id: 'metrics', label: '性能指标', icon: Zap },
    { id: 'alerts', label: '告警管理', icon: Bell },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-low border-r border-outline-variant/15 flex flex-col z-50">
        <div className="px-6 py-8">
          <h1 className="text-xl font-bold text-primary font-headline tracking-tighter">CAMMON</h1>
          <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-1">Database Observatory</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full group flex items-center px-4 py-3 space-x-3 transition-all duration-300 font-medium text-[14px] rounded-lg ${
                currentView === item.id
                  ? 'text-primary border-r-2 border-primary bg-gradient-to-r from-primary/10 to-transparent'
                  : 'text-on-surface-variant hover:bg-surface-low hover:text-primary'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-outline-variant/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center border border-outline-variant/20">
              <Shield size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin Root</p>
              <p className="text-[10px] text-on-surface-variant/60 truncate">系统管理员</p>
            </div>
            <Settings size={14} className="text-on-surface-variant cursor-pointer hover:text-primary" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-10 bg-background/70 backdrop-blur-[20px] sticky top-0 z-40 border-b border-outline-variant/15">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-headline font-bold tracking-tight">
              {navItems.find(i => i.id === currentView)?.label}
            </h2>
            {currentView === 'dashboard' && (
              <span className="px-2 py-0.5 rounded-full bg-primary-container/30 text-primary text-[10px] font-bold uppercase tracking-wider">
                实时监控
              </span>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
              <Clock size={14} />
              <span>最后更新: 14:30:05</span>
            </div>
            <div className="flex items-center space-x-4">
              <Search size={18} className="text-on-surface-variant cursor-pointer hover:text-primary" />
              <RefreshCw size={18} className="text-on-surface-variant cursor-pointer hover:text-primary" />
              <button onClick={toggleTheme} className="text-on-surface-variant cursor-pointer hover:text-primary transition-transform active:scale-90">
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
            <div className="h-4 w-px bg-outline-variant/30"></div>
            <button className="bg-primary text-background px-4 py-1.5 rounded text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-primary/20 active:opacity-80 transition-opacity">
              <Plus size={16} />
              <span>新增实例</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'instances' && <InstancesView />}
              {currentView === 'sql' && <SQLAnalysisView />}
              {currentView === 'metrics' && <MetricsView />}
              {currentView === 'alerts' && <AlertsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-surface-low rounded-xl p-8 relative overflow-hidden flex flex-col justify-between h-48 border border-outline-variant/15 hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-shadow">
          <div className="relative z-10">
            <p className="text-on-surface-variant text-sm font-medium">全局运行健康度</p>
            <h3 className="text-6xl font-headline font-bold text-primary mt-2 tracking-tighter">99.8<span className="text-2xl ml-1 text-on-surface-variant/40">%</span></h3>
          </div>
          <div className="relative z-10 flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center text-green-400"><ArrowUp size={14} className="mr-1" /> 0.2%</span>
            <span className="text-on-surface-variant/60">对比过去 24 小时</span>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Shield size={160} className="text-primary" />
          </div>
        </div>

        <div className="bg-surface-low rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded bg-surface-high text-primary">
              <Database size={20} />
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">实例数</span>
          </div>
          <div>
            <h4 className="text-4xl font-headline font-bold mt-4 tracking-tighter">24</h4>
            <div className="text-xs text-on-surface-variant/60 mt-2">
              <span className="text-green-400 font-bold">22</span> 在线 / <span className="text-error font-bold">2</span> 离线
            </div>
          </div>
        </div>

        <div className="bg-surface-low rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded bg-surface-high text-tertiary">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">总 CPU 负载</span>
          </div>
          <div>
            <h4 className="text-4xl font-headline font-bold mt-4 tracking-tighter">42<span className="text-xl">%</span></h4>
            <div className="w-full bg-surface-high h-1.5 rounded-full overflow-hidden mt-4">
              <div className="bg-tertiary h-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-xl flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
            核心数据库实例
          </h3>
          <div className="flex items-center space-x-2 bg-surface-low p-1 rounded-lg border border-outline-variant/5">
            <button className="px-3 py-1 text-xs font-bold rounded bg-surface-high text-primary">全部</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-on-surface-variant hover:bg-surface-high">Oracle</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-on-surface-variant hover:bg-surface-high">MySQL</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-on-surface-variant hover:bg-surface-high">Postgres</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InstanceCard name="Oracle_Prod_01" ip="192.168.1.100" type="O" cpu={78} ram="12.4 GB / 16 GB" status="ONLINE" />
          <InstanceCard name="MySQL_Analytic_DW" ip="10.0.4.52" type="M" cpu={12} ram="32.1 GB / 64 GB" status="ONLINE" />
          <InstanceCard name="PG_Test_Legacy" ip="192.168.1.105" type="P" cpu={0} ram="0 GB / 8 GB" status="OFFLINE" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-low rounded-xl p-6 border border-outline-variant/15">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline font-bold text-lg tracking-tight">高负载查询排行</h4>
            <button className="text-primary text-xs font-medium hover:underline">查看全部</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-on-surface-variant/60 text-left border-b border-outline-variant/10">
                <tr>
                  <th className="pb-3 font-medium">SQL ID</th>
                  <th className="pb-3 font-medium">SQL 摘要</th>
                  <th className="pb-3 font-medium">执行次数</th>
                  <th className="pb-3 font-medium">平均耗时</th>
                  <th className="pb-3 font-medium text-right">资源占比</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <SQLRow id="5a9s2k1" sql="SELECT * FROM orders WHERE status = 'PENDING' ORDER BY..." count="124,082" time="145ms" pct={32.4} />
                <SQLRow id="2n8v3m4" sql="UPDATE inventory SET stock_count = stock_count - 1 WHERE id..." count="892,110" time="12ms" pct={18.1} />
                <SQLRow id="9p1z6q0" sql="INSERT INTO system_logs (level, message, source, timestamp)..." count="1,402,993" time="5ms" pct={9.8} />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/15">
          <h4 className="font-headline font-bold text-lg mb-6 tracking-tight">系统事件日志</h4>
          <div className="space-y-6">
            <LogItem color="bg-error" title="连接超时告警" desc="PG_Test_Legacy 失去心跳连接，自动重试失败。" time="14:28:45" />
            <LogItem color="bg-tertiary" title="慢查询预警" desc="Oracle_Prod_01 出现 3 条耗时超过 5s 的查询。" time="14:15:22" />
            <LogItem color="bg-primary" title="备份任务完成" desc="MySQL_Analytic_DW 每日增量备份已成功存储。" time="12:00:01" />
            <LogItem color="bg-primary" title="新实例已挂载" desc="检测到新的 Redis 缓存实例在 172.16.0.4 上线。" time="11:45:30" />
          </div>
        </div>
      </section>
    </div>
  );
}

function InstanceCard({ name, ip, type, cpu, ram, status }: any) {
  const isOffline = status === 'OFFLINE';
  return (
    <div className={`bg-surface-low rounded-xl border border-outline-variant/15 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-300 group ${isOffline ? 'opacity-75 grayscale' : ''}`}>
      <div className="p-6 border-b border-outline-variant/5 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center border ${type === 'O' ? 'bg-red-500/10 border-red-500/20 text-red-500' : type === 'M' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'}`}>
            <span className="font-headline font-bold text-lg">{type}</span>
          </div>
          <div>
            <h5 className="font-bold text-on-surface">{name}</h5>
            <p className="text-xs text-on-surface-variant">{ip}</p>
          </div>
        </div>
        <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full border ${isOffline ? 'text-error bg-error/10 border-error/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
          {!isOffline && <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>}
          {status}
        </span>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-on-surface-variant/80">CPU 消耗</span>
            <span className="text-sm font-headline font-bold">{isOffline ? '--' : `${cpu}%`}</span>
          </div>
          <div className="flex items-end h-8 space-x-1 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { value: 20 }, { value: 40 }, { value: 60 }, { value: 100 }, { value: 80 }, { value: 60 }
              ]}>
                <RechartsTooltip 
                  cursor={false} 
                  contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
                  itemStyle={{ color: '#00d1ff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="value" fill={isOffline ? '#3c494e' : '#00d1ff'} shape={<CustomBar />} activeBar={<CustomActiveBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-on-surface-variant/80">内存 (RAM)</span>
            <span className="text-sm font-headline font-bold">{ram}</span>
          </div>
          <div className="w-full bg-surface-high h-1.5 rounded-full overflow-hidden">
            {!isOffline && <div className="bg-secondary h-full" style={{ width: '77%' }}></div>}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-surface-low/50 flex justify-between items-center text-[11px]">
        <div className="flex space-x-4">
          {isOffline ? (
            <span className="text-on-surface-variant">无法连接至主机</span>
          ) : (
            <>
              <span className="text-on-surface-variant"><span className="text-on-surface font-bold">1.2ms</span> 延迟</span>
              <span className="text-on-surface-variant"><span className="text-on-surface font-bold">4.2k</span> QPS</span>
            </>
          )}
        </div>
        {isOffline ? <RefreshCw size={14} className="text-error cursor-pointer" /> : <ExternalLink size={14} className="text-on-surface-variant group-hover:text-primary cursor-pointer" />}
      </div>
    </div>
  );
}

function SQLRow({ id, sql, count, time, pct }: any) {
  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="py-4 font-mono text-[11px] text-primary font-bold">{id}</td>
      <td className="py-4 font-mono text-[12px] text-on-surface max-w-xs truncate">{sql}</td>
      <td className="py-4">{count}</td>
      <td className="py-4">{time}</td>
      <td className="py-4 text-right">
        <div className="inline-flex items-center space-x-2">
          <span className="font-bold text-primary">{pct}%</span>
          <div className="w-12 h-1 bg-surface-high rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function LogItem({ color, title, desc, time }: any) {
  return (
    <div className="flex space-x-4">
      <div className={`flex-none w-1.5 h-1.5 rounded-full ${color} mt-2`}></div>
      <div>
        <p className="text-xs font-bold text-on-surface">{title}</p>
        <p className="text-[11px] text-on-surface-variant/80 mt-1">{desc}</p>
        <p className="text-[10px] text-on-surface-variant/40 mt-1 uppercase font-bold tracking-tighter">{time}</p>
      </div>
    </div>
  );
}

function InstancesView() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">实例详情</h1>
          <p className="text-on-surface-variant font-body">所选数据库实例的详细实时状态与内存分配情况。</p>
        </div>
        <InstanceSelector />
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <MetricCard title="SGA 内存使用" value="78" unit="%" detail="当前分配: 128GB / 164GB" icon={<Cpu size={20} />} color="text-primary" barColor="bg-primary" />
          <MetricCard title="PGA 内存使用" value="42" unit="%" detail="当前分配: 32GB / 76GB" icon={<Cpu size={20} />} color="text-secondary" barColor="bg-secondary" />
          
          <div className="bg-surface-low p-4 rounded-xl border border-outline-variant/5">
            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-3">活跃会话 (Active Sessions)</h3>
            <div className="grid grid-cols-3 gap-2">
              <SessionStat label="Foreground" value="124" color="text-primary" />
              <SessionStat label="Background" value="18" color="text-on-surface-variant" />
              <SessionStat label="等待" value="12" color="text-error" border="border-error/20" />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold headline-font text-on-surface">会话负载趋势 (Sessions Load)</h3>
                <p className="text-xs text-on-surface-variant mt-1">数据库活动会话实时监控</p>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-[10px] bg-primary/10 text-primary rounded">1H</button>
                <button className="px-2 py-1 text-[10px] text-on-surface-variant hover:bg-surface-high transition-colors rounded border border-outline-variant/10">6H</button>
                <button className="px-2 py-1 text-[10px] text-on-surface-variant hover:bg-surface-high transition-colors rounded border border-outline-variant/10">24H</button>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { time: '14:00', value: 30 }, { time: '14:05', value: 35 }, { time: '14:10', value: 45 }, { time: '14:15', value: 40 },
                  { time: '14:20', value: 55 }, { time: '14:25', value: 65 }, { time: '14:30', value: 60 }, { time: '14:35', value: 50 },
                  { time: '14:40', value: 55 }, { time: '14:45', value: 70 }, { time: '14:50', value: 80 }, { time: '14:55', value: 75 },
                  { time: '15:00', value: 65 }, { time: '15:05', value: 60 }, { time: '15:10', value: 40 }, { time: '15:15', value: 30 }
                ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3c494e" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={false} 
                    contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#00d1ff' }}
                  />
                  <Bar dataKey="value" fill="#00d1ff" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold headline-font">当前长时间会话摘要 (Long Running Sessions)</h3>
            <p className="text-xs text-on-surface-variant mt-1">运行时间 (last_call_et) 超过 600 秒的活跃会话</p>
          </div>
          <span className="px-3 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full border border-error/20 uppercase tracking-wider">
            高风险监控
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">SQL_ID</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4 text-right">Last_Call_ET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              <LongSessionRow user="APPS_USER" machine="app-svr-prod-01" program="JDBC Thin Client" sqlId="ax7d8f9g1h2j" event="db file sequential read" time="12,450s" />
              <LongSessionRow user="REPORT_DW" machine="dw-batch-node-4" program="sqlplus@dw-batch" sqlId="6h7k8l9m0n1p" event="direct path read" time="8,920s" />
              <LongSessionRow user="SYS" machine="db-core-prod-01" program="oracle@db-core-prod-01" sqlId="2q3w4e5r6t7y" event="log file sync" time="4,100s" isWarning />
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold headline-font">表空间详细状态 (Tablespace Status)</h3>
          <div className="relative w-full md:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input className="bg-surface border-none text-sm pl-9 pr-4 py-2 w-full md:w-64 rounded-md focus:ring-1 focus:ring-primary/40" placeholder="搜索表空间..." type="text" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">名称</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4">总容量 (GB)</th>
                <th className="px-6 py-4">已使用 (GB)</th>
                <th className="px-6 py-4">使用率</th>
                <th className="px-6 py-4">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              <TablespaceRow name="SYSTEM" type="PERMANENT" total="10.00" used="8.42" pct={84} />
              <TablespaceRow name="TBS_DATA_01" type="PERMANENT" total="2048.00" used="1820.00" pct={89} isWarning />
              <TablespaceRow name="SYSAUX" type="PERMANENT" total="20.00" used="12.10" pct={60} />
              <TablespaceRow name="UNDOTBS1" type="UNDO" total="128.00" used="32.00" pct={25} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TablespaceRow({ name, type, total, used, pct, isWarning }: any) {
  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="px-6 py-4 font-medium text-on-surface">{name}</td>
      <td className="px-6 py-4 text-on-surface-variant">{type}</td>
      <td className="px-6 py-4 font-mono">{total}</td>
      <td className="px-6 py-4 font-mono">{used}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 h-1.5 bg-surface-high rounded-full overflow-hidden">
            <div className={`h-full ${isWarning ? 'bg-tertiary' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className={`text-xs font-mono ${isWarning ? 'text-tertiary' : ''}`}>{pct}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
        </span>
      </td>
    </tr>
  );
}

function MetricCard({ title, value, unit, detail, icon, color, barColor }: any) {
  return (
    <div className="bg-surface-low p-4 rounded-xl relative overflow-hidden group border border-outline-variant/5">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        {icon}
      </div>
      <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end gap-1">
        <span className={`text-3xl font-bold headline-font ${color}`}>{value}</span>
        <span className="text-base font-medium text-on-surface-variant mb-0.5">{unit}</span>
      </div>
      <div className="mt-3 w-full h-1 bg-surface-high rounded-full overflow-hidden">
        <div className={`h-full ${barColor} shadow-[0_0_10px_rgba(0,209,255,0.3)]`} style={{ width: `${value}%` }}></div>
      </div>
      <p className="mt-3 text-[10px] text-on-surface-variant">{detail}</p>
    </div>
  );
}

function SessionStat({ label, value, color, border }: any) {
  return (
    <div className={`bg-surface/50 p-2 rounded border border-outline-variant/5 ${border || ''}`}>
      <span className="block text-[10px] text-on-surface-variant mb-1">{label}</span>
      <span className={`text-lg font-bold ${color} leading-none`}>{value}</span>
    </div>
  );
}

function LongSessionRow({ user, machine, program, sqlId, event, time, isWarning }: any) {
  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="px-6 py-4 text-primary font-medium">{user}</td>
      <td className="px-6 py-4 text-on-surface-variant">{machine}</td>
      <td className="px-6 py-4 font-mono text-[11px]">{program}</td>
      <td className="px-6 py-4 font-mono text-secondary">{sqlId}</td>
      <td className="px-6 py-4 text-xs">{event}</td>
      <td className={`px-6 py-4 text-right font-mono font-bold ${isWarning ? 'text-tertiary' : 'text-error'}`}>{time}</td>
    </tr>
  );
}

function SQLAnalysisView() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">SQL 分析</h1>
          <p className="text-on-surface-variant font-body">Detailed breakdown and performance analysis of database queries.</p>
        </div>
        <InstanceSelector />
      </header>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-surface-low p-8 rounded-xl relative overflow-hidden border border-outline-variant/10">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">SQL 执行负载趋势</span>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="font-headline text-5xl font-bold text-primary tracking-tighter">84.2<span className="text-2xl ml-1">%</span></h3>
                <div className="flex items-center text-error text-xs font-medium bg-error/10 px-2 py-0.5 rounded-full">
                  <ArrowUp size={12} className="mr-1" />
                  <span>12% 较昨日</span>
                </div>
              </div>
            </div>
            <div className="mt-8 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { time: '14:00', value: 40 }, { time: '14:05', value: 55 }, { time: '14:10', value: 35 }, { time: '14:15', value: 70 },
                  { time: '14:20', value: 90 }, { time: '14:25', value: 65 }, { time: '14:30', value: 45 }, { time: '14:35', value: 80 },
                  { time: '14:40', value: 60 }, { time: '14:45', value: 75 }
                ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3c494e" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={false} 
                    contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#00d1ff' }}
                  />
                  <Bar dataKey="value" fill="#00d1ff" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <MiniChartCard title="TPS" value="3,241" unit="/s" color="text-primary" />
          <MiniChartCard title="QPS" value="12,850" unit="/s" color="text-primary" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold font-headline">TOP SQL 资源消耗排行榜</h3>
            <p className="text-sm text-on-surface-variant">基于 CPU 时间、执行次数和资源占比的综合分析</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-high text-[11px] font-bold border border-outline-variant/10 hover:bg-surface-variant transition-colors">导出报告</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-high text-[11px] font-bold border border-outline-variant/10 hover:bg-surface-variant transition-colors">过滤条件</button>
          </div>
        </div>
        <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
          <div className="grid grid-cols-12 px-6 py-4 bg-surface/50 border-b border-outline-variant/5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <div className="col-span-1">SQL ID</div>
            <div className="col-span-5">SQL 语句预览</div>
            <div className="col-span-2">平均执行时间</div>
            <div className="col-span-2">执行次数 (24h)</div>
            <div className="col-span-2 text-right">资源占比</div>
          </div>
          <SQLAnalysisRow id="5a9s2k1" sql="SELECT * FROM orders WHERE status = 'PENDING' AND created_at > NOW()..." time="1,240 ms" count="1.2M" pct={78} tags={['FULL SCAN', 'JOIN MISMATCH']} />
          <SQLAnalysisRow id="2n8v3m4" sql="UPDATE user_profiles SET last_login = NOW() WHERE user_id IN..." time="45 ms" count="48.2M" pct={42} tags={['LOCK WAIT']} />
          <SQLAnalysisRow id="9p1z6q0" sql="INSERT INTO analytics_events (event_type, payload, ts) VALUES..." time="8 ms" count="156.4M" pct={15} tags={['HIGH FREQUENCY']} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-headline font-bold text-sm mb-6 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            平均执行时间 (Avg Execution Time)
          </h4>
          <div className="space-y-4">
            <StatBar label="5a9s2k1" value="845k" pct={85} />
            <StatBar label="2n8v3m4" value="122k" pct={30} />
            <StatBar label="9p1z6q0" value="15.4k" pct={10} />
          </div>
        </div>
        <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-headline font-bold text-sm mb-6 flex items-center gap-2">
            <List size={18} className="text-primary" />
            扫描行数统计 (Scan Rows Stats)
          </h4>
          <div className="space-y-4">
            <StatBar label="5a9s2k1" value="845k" pct={85} />
            <StatBar label="2n8v3m4" value="122k" pct={30} />
            <StatBar label="9p1z6q0" value="15.4k" pct={10} />
          </div>
        </div>
        <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-headline font-bold text-sm mb-6 flex items-center gap-2">
            <Cpu size={18} className="text-primary" />
            逻辑读/物理读 (Logic/Physical Reads)
          </h4>
          <div className="space-y-4">
            <StatBar label="5a9s2k1" value="845k" pct={85} />
            <StatBar label="2n8v3m4" value="122k" pct={30} />
            <StatBar label="9p1z6q0" value="15.4k" pct={10} />
          </div>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-container to-primary text-background shadow-[0_10px_30px_rgba(0,209,255,0.3)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

function StatBar({ label, value, pct }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[11px] font-medium">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="h-1.5 bg-surface-high rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function MiniChartCard({ title, value, unit, color }: any) {
  return (
    <div className="flex-1 bg-surface-low p-6 rounded-xl flex flex-col justify-between border border-outline-variant/15 hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-shadow">
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">{title}</span>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl font-headline font-bold text-on-surface tracking-tighter">{value}</h3>
          <span className="text-xs text-on-surface-variant">{unit}</span>
        </div>
      </div>
      <div className="flex items-end h-12 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { value: 30 }, { value: 45 }, { value: 40 }, { value: 60 }, { value: 80 }, 
            { value: 75 }, { value: 90 }, { value: 85 }, { value: 100 }
          ]}>
            <RechartsTooltip 
              cursor={false} 
              contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
              itemStyle={{ color: '#00d1ff' }}
              labelStyle={{ display: 'none' }}
            />
            <Bar dataKey="value" fill="#00d1ff" shape={<CustomBar />} activeBar={<CustomActiveBar />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SQLAnalysisRow({ id, sql, time, count, pct, tags }: any) {
  return (
    <div className="grid grid-cols-12 px-6 py-5 hover:bg-surface-high transition-colors cursor-pointer items-center border-b border-outline-variant/5">
      <div className="col-span-1 font-mono text-xs text-primary font-bold">{id}</div>
      <div className="col-span-5 pr-8">
        <code className="text-xs text-on-surface font-mono truncate block">{sql}</code>
        <div className="flex gap-2 mt-1">
          {tags.map((tag: string) => (
            <span key={tag} className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${tag === 'FULL SCAN' ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="col-span-2 text-sm font-headline font-medium">{time}</div>
      <div className="col-span-2 text-sm font-headline font-medium">{count}</div>
      <div className="col-span-2">
        <div className="flex items-center gap-3 justify-end">
          <div className="w-24 h-1.5 bg-surface-high rounded-full overflow-hidden">
            <div className={`h-full ${pct > 70 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className="text-xs font-bold font-mono">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function MetricsView() {
  const waitData = [
    { time: '14:00', 'User I/O': 40, 'System I/O': 24, 'Concurrency': 24, 'Commit': 10, 'Configuration': 5, 'Administrative': 2, 'Network': 15, 'Application': 8, 'Idle': 100 },
    { time: '14:05', 'User I/O': 30, 'System I/O': 13, 'Concurrency': 22, 'Commit': 15, 'Configuration': 4, 'Administrative': 1, 'Network': 12, 'Application': 6, 'Idle': 110 },
    { time: '14:10', 'User I/O': 45, 'System I/O': 28, 'Concurrency': 30, 'Commit': 12, 'Configuration': 6, 'Administrative': 3, 'Network': 18, 'Application': 10, 'Idle': 90 },
    { time: '14:15', 'User I/O': 50, 'System I/O': 35, 'Concurrency': 40, 'Commit': 20, 'Configuration': 8, 'Administrative': 4, 'Network': 25, 'Application': 15, 'Idle': 70 },
    { time: '14:20', 'User I/O': 35, 'System I/O': 20, 'Concurrency': 25, 'Commit': 18, 'Configuration': 5, 'Administrative': 2, 'Network': 14, 'Application': 9, 'Idle': 105 },
    { time: '14:25', 'User I/O': 25, 'System I/O': 15, 'Concurrency': 18, 'Commit': 8, 'Configuration': 3, 'Administrative': 1, 'Network': 10, 'Application': 5, 'Idle': 120 },
    { time: '14:30', 'User I/O': 38, 'System I/O': 22, 'Concurrency': 26, 'Commit': 14, 'Configuration': 6, 'Administrative': 2, 'Network': 16, 'Application': 7, 'Idle': 95 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">性能指标</h1>
          <p className="text-on-surface-variant font-body">Real-time telemetry and cache efficiency metrics.</p>
        </div>
        <InstanceSelector />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GaugeCard title="Buffer Cache Hit" value={96.2} color="text-primary" glow="shadow-[0_0_15px_rgba(0,209,255,0.3)]" />
        <GaugeCard title="Cursor Cache Hit" value={82.1} color="text-error" glow="shadow-[0_0_15px_rgba(255,180,171,0.3)]" />
        <GaugeCard title="Library Cache Hit" value={98.0} color="text-primary" glow="shadow-[0_0_15px_rgba(0,209,255,0.3)]" />
        <GaugeCard title="Row Cache Hit" value={90.0} color="text-tertiary" glow="shadow-[0_0_15px_rgba(255,213,156,0.3)]" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 bg-surface-low p-8 rounded-xl border border-outline-variant/10 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-1">数据库等待时间</h2>
              <p className="text-sm text-on-surface-variant">Database Wait Times by Class (ms)</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-high rounded-full text-[10px] font-bold uppercase tracking-tighter text-primary cursor-pointer hover:bg-primary/20 transition-colors">实时</span>
              <span className="px-3 py-1 bg-surface rounded-full text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant cursor-pointer hover:bg-surface-high transition-colors">24 小时</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdministrative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorApplication" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorCommit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorConcurrency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorConfiguration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorUserIO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorSystemIO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c494e" vertical={true} horizontal={true} opacity={0.3} />
                <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} ms`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#dde3e7' }}
                />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Area type="linear" dataKey="Administrative" stackId="1" stroke="#4ade80" fill="url(#colorAdministrative)" />
                <Area type="linear" dataKey="Application" stackId="1" stroke="#facc15" fill="url(#colorApplication)" />
                <Area type="linear" dataKey="Commit" stackId="1" stroke="#38bdf8" fill="url(#colorCommit)" />
                <Area type="linear" dataKey="Concurrency" stackId="1" stroke="#fb923c" fill="url(#colorConcurrency)" />
                <Area type="linear" dataKey="Configuration" stackId="1" stroke="#f87171" fill="url(#colorConfiguration)" />
                <Area type="linear" dataKey="Network" stackId="1" stroke="#60a5fa" fill="url(#colorNetwork)" />
                <Area type="linear" dataKey="Other" stackId="1" stroke="#c084fc" fill="url(#colorOther)" />
                <Area type="linear" dataKey="User I/O" stackId="1" stroke="#a855f7" fill="url(#colorUserIO)" />
                <Area type="linear" dataKey="System I/O" stackId="1" stroke="#22c55e" fill="url(#colorSystemIO)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-3 flex flex-col gap-6">
          <MetricTrendCard title="User Commits" value="364" trend="+12%" color="text-primary" icon={<CheckCircle2 size={18} />} data={[0.3, 0.5, 0.4, 0.6, 0.5, 0.8, 0.7]} />
          <MetricTrendCard title="锁等待 (Lock)" value="12" trend="-2%" color="text-tertiary" icon={<Shield size={18} />} data={[0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]} />
          <MetricTrendCard title="Execute Count" value="172k" trend="+5.4k" color="text-error" icon={<Zap size={18} />} data={[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.8]} />
        </div>
      </section>

      <section className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10">
          <h3 className="text-lg font-bold headline-font">等待事件详情 (Wait Events Detail)</h3>
          <p className="text-xs text-on-surface-variant mt-1">当前实例中排名前五的等待事件分析</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Wait Class</th>
                <th className="px-6 py-4">Total Waits</th>
                <th className="px-6 py-4">Time Waited (s)</th>
                <th className="px-6 py-4 text-right">Avg Wait (ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              <WaitEventRow name="db file sequential read" class="User I/O" waits="1,245,082" time="45,210" avg="36.3" />
              <WaitEventRow name="log file sync" class="Commit" waits="892,110" time="12,450" avg="13.9" />
              <WaitEventRow name="direct path read" class="User I/O" waits="402,993" time="8,920" avg="22.1" />
              <WaitEventRow name="SQL*Net message from client" class="Network" waits="14,201,993" time="156,400" avg="11.0" />
              <WaitEventRow name="latch: shared pool" class="Concurrency" waits="12,450" time="4,100" avg="329.3" isWarning />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function WaitEventRow({ name, class: waitClass, waits, time, avg, isWarning }: any) {
  return (
    <tr className="hover:bg-surface-high/50 transition-colors">
      <td className="px-6 py-4 font-medium text-on-surface">{name}</td>
      <td className="px-6 py-4 text-on-surface-variant">{waitClass}</td>
      <td className="px-6 py-4 font-mono">{waits}</td>
      <td className="px-6 py-4 font-mono">{time}</td>
      <td className={`px-6 py-4 text-right font-mono font-bold ${isWarning ? 'text-error' : 'text-primary'}`}>{avg}</td>
    </tr>
  );
}

function GaugeCard({ title, value, color, glow }: any) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/15 flex flex-col items-center shadow-[0_0_40px_rgba(0,209,255,0.05)]">
      <h3 className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-6 w-full">{title}</h3>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="transparent" stroke="currentColor" strokeWidth="2" className="text-surface-high" />
          <circle 
            cx="64" cy="64" r={radius} fill="transparent" stroke="currentColor" strokeWidth="2" 
            className={`${color}`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-headline font-bold text-on-surface">{value}<span className="text-sm font-normal text-on-surface-variant">%</span></span>
        </div>
      </div>
    </div>
  );
}

function MetricTrendCard({ title, value, trend, color, icon, data }: any) {
  const chartData = (data || [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.6]).map((v: number) => ({ value: v * 100 }));
  const fillColor = color.includes('primary') ? '#00d1ff' : color.includes('tertiary') ? '#ffd59c' : color.includes('error') ? '#ffb4ab' : '#00d1ff';

  return (
    <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between h-full group hover:border-primary/30 hover:shadow-[0_0_40px_rgba(0,209,255,0.1)] transition-all duration-300">
      <div className="flex justify-between items-start">
        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</h4>
        <div className="text-primary/40 group-hover:text-primary transition-colors">{icon}</div>
      </div>
      <div className="mt-4">
        <div className={`text-4xl font-headline font-bold ${color} leading-none mb-2 tracking-tighter`}>{value}</div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 bg-error/10 text-error rounded font-bold`}>{trend}</span>
          <span className="text-[10px] text-on-surface-variant">vs last interval</span>
        </div>
      </div>
      <div className="mt-6 h-12 px-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <RechartsTooltip 
              cursor={false} 
              contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
              itemStyle={{ color: fillColor }}
              labelStyle={{ display: 'none' }}
            />
            <Bar dataKey="value" fill={fillColor} shape={<CustomBar />} activeBar={<CustomActiveBar />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AlertsView() {
  const alertTrendData = [
    { time: '00:00', Critical: 2, Warning: 5, Info: 12 },
    { time: '04:00', Critical: 1, Warning: 3, Info: 15 },
    { time: '08:00', Critical: 5, Warning: 12, Info: 30 },
    { time: '12:00', Critical: 3, Warning: 8, Info: 25 },
    { time: '16:00', Critical: 8, Warning: 15, Info: 40 },
    { time: '20:00', Critical: 2, Warning: 6, Info: 20 },
    { time: '24:00', Critical: 1, Warning: 4, Info: 10 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface">告警管理中心</h1>
        <button className="bg-primary text-background px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">新建策略</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AlertStatCard title="严重告警" value="12" trend="+2 自昨日" color="border-error" icon={<AlertCircle size={24} className="text-error" />} />
        <AlertStatCard title="警告提醒" value="28" trend="-5 自昨日" color="border-tertiary" icon={<AlertTriangle size={24} className="text-tertiary" />} />
        <AlertStatCard title="常规通知" value="145" trend="+12 持续增加" color="border-primary" icon={<Info size={24} className="text-primary" />} />
        <AlertStatCard title="恢复率 (MTTR)" value="94.2%" trend="平均响应时间已降至 8 分钟以下" color="border-primary" icon={<CheckCircle2 size={24} className="text-primary" />} isMTTR />
      </section>

      <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="px-8 py-4 bg-surface/50 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-surface rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-primary text-background">全部告警</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface">未处理</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface">已屏蔽</button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-on-surface-variant">排序方式:</span>
            <select className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer">
              <option>最近发生</option>
              <option>级别最高</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/30 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              <tr>
                <th className="px-8 py-4">严重程度</th>
                <th className="px-8 py-4">告警内容</th>
                <th className="px-8 py-4">相关实例</th>
                <th className="px-8 py-4">首次发生时间</th>
                <th className="px-8 py-4">状态</th>
                <th className="px-8 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <AlertRow level="CRITICAL" title="CPU 使用率超过阈值 (98%)" desc="检测到持续高负载，可能影响服务稳定性。" instance="db-cluster-prod-01" time="2023-11-24 14:22:15" status="正在发生" />
              <AlertRow level="WARNING" title="慢查询堆积异常" desc="过去 5 分钟内慢查询数量 > 50 条。" instance="read-replica-04" time="2023-11-24 14:18:02" status="待处理" />
              <AlertRow level="INFO" title="自动备份任务开始" desc="系统已启动例行全量备份流程。" instance="global-index-master" time="2023-11-24 14:00:00" status="进行中" />
            </tbody>
          </table>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline font-bold text-lg">告警频率趋势 (Alert Frequency)</h4>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c494e" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a2123', borderColor: '#3c494e', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Critical" stroke="#ffb4ab" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Warning" stroke="#ffd59c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/10 flex flex-col">
          <h4 className="font-headline font-bold text-lg mb-8">告警级别分布 (Distribution)</h4>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c494e" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Info" stroke="#00d1ff" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Warning" stroke="#ffd59c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Critical" stroke="#ffb4ab" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function AlertStatCard({ title, value, trend, color, icon, isMTTR }: any) {
  return (
    <div className={`bg-surface-low p-6 rounded-xl border-l-4 ${color} relative overflow-hidden group border border-outline-variant/15 hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-shadow`}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        {icon}
      </div>
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline space-x-2">
        <span className={`text-4xl font-headline font-bold tracking-tighter ${isMTTR ? 'text-primary' : ''}`}>{value}</span>
        {!isMTTR && <span className="text-xs text-on-surface-variant/60 font-medium">{trend}</span>}
      </div>
      {isMTTR ? (
        <p className="mt-4 text-xs text-on-surface-variant leading-relaxed">{trend}</p>
      ) : (
        <div className="mt-4 h-1 w-full bg-surface-high rounded-full overflow-hidden">
          <div className={`h-full ${color.replace('border-', 'bg-')} w-2/3`}></div>
        </div>
      )}
    </div>
  );
}

function AlertRow({ level, title, desc, instance, time, status }: any) {
  const isCritical = level === 'CRITICAL';
  const isWarning = level === 'WARNING';
  return (
    <tr className="hover:bg-surface-high/40 transition-colors group">
      <td className="px-8 py-5">
        <span className={`flex items-center space-x-2 font-bold text-xs uppercase ${isCritical ? 'text-error' : isWarning ? 'text-tertiary' : 'text-primary'}`}>
          <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-error animate-pulse' : isWarning ? 'bg-tertiary' : 'bg-primary'}`}></span>
          <span>{level}</span>
        </span>
      </td>
      <td className="px-8 py-5">
        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[11px] text-on-surface-variant mt-1">{desc}</p>
      </td>
      <td className="px-8 py-5 text-sm font-mono text-secondary">{instance}</td>
      <td className="px-8 py-5 text-sm text-on-surface-variant font-headline">{time}</td>
      <td className="px-8 py-5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${isCritical ? 'bg-error/10 text-error border-error/20' : isWarning ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <MoreVertical size={18} className="text-on-surface-variant hover:text-on-surface cursor-pointer ml-auto" />
      </td>
    </tr>
  );
}

function InstanceSelector() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-headline">SELECTED INSTANCE</label>
      <div className="relative min-w-[240px]">
        <select className="appearance-none w-full bg-surface-high border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded-md font-headline font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer">
          <option selected>DB-CORE-PROD-01</option>
          <option>DB-CORE-PROD-02</option>
          <option>DB-ANALYTICS-STAGING</option>
          <option>DB-AUTH-GLOBAL</option>
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
      </div>
    </div>
  );
}
