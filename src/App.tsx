/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  ExternalLink,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, BarChart, Bar, Rectangle
} from 'recharts';

function TimeSelector({ selected, onSelect, isLoading }: any) {
  const options = ['1H', '2H', '7H', '24H'];
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt}
          disabled={isLoading}
          onClick={() => onSelect(opt)}
          className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
            selected === opt
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-on-surface-variant hover:bg-surface-high border border-outline-variant/15'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ChartLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-low/60 backdrop-blur-sm rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Loading Data</span>
      </div>
    </div>
  );
}

const useMockData = (initialData: any[]) => {
  const [timeRange, setTimeRange] = useState('1H');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      const points = timeRange === '1H' ? 12 : timeRange === '2H' ? 24 : timeRange === '7H' ? 14 : 24;
      const newData = Array.from({ length: points }).map((_, i) => {
        const item: any = { time: `${Math.floor(i/2)}:${i%2===0?'00':'30'}` };
        Object.keys(initialData[0]).forEach(key => {
          if (key !== 'time') {
            item[key] = Math.floor(Math.random() * 80) + 10;
          }
        });
        return item;
      });
      setData(newData);
      setIsLoading(false);
    }, 800 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return { timeRange, setTimeRange, isLoading, data };
};

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
    <div className="flex min-h-screen bg-[#0E1417] text-on-surface font-sans">
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
        <div className="bg-[#161D1F] rounded-xl p-6 flex flex-col justify-between border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div className="p-2 rounded bg-white/5 text-[#00D1FF]">
              <Shield size={20} />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">全局运行健康度</span>
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="text-4xl font-headline font-bold tracking-tighter text-white">99.8<span className="text-lg ml-1 text-slate-500 font-normal">%</span></h4>
            <div className="text-xs text-slate-400 mt-2 flex items-center">
              <span className="text-green-400 flex items-center mr-2"><ArrowUp size={12} className="mr-1" /> 0.2%</span> vs 昨天
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={100} className="text-[#00D1FF]" />
          </div>
        </div>

        <div className="bg-[#161D1F] rounded-xl p-6 flex flex-col justify-between border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div className="p-2 rounded bg-white/5 text-[#00D1FF]">
              <Database size={20} />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">纳管数据总量</span>
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="text-4xl font-headline font-bold tracking-tighter text-white">1.24<span className="text-lg ml-1 text-slate-500 font-normal">PB</span></h4>
            <div className="text-xs text-slate-400 mt-2 flex items-center">
              <span className="text-[#00D1FF] flex items-center mr-2"><ArrowUp size={12} className="mr-1" /> 2.4 TB</span> 今日新增
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database size={100} className="text-[#00D1FF]" />
          </div>
        </div>

        <div className="bg-[#161D1F] rounded-xl p-6 flex flex-col justify-between border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded bg-white/5 text-[#00D1FF]">
              <Server size={20} />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">实例数</span>
          </div>
          <div className="mt-4">
            <h4 className="text-4xl font-headline font-bold tracking-tighter text-white">24</h4>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>22 在线</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#FF4D4D] mr-1"></span>2 离线</span>
            </div>
          </div>
        </div>

        <div className="bg-[#161D1F] rounded-xl p-6 flex flex-col justify-between border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded bg-white/5 text-[#FFB800]">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">总 CPU 负载</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-4xl font-headline font-bold tracking-tighter text-white">42<span className="text-lg ml-1 text-slate-500 font-normal">%</span></h4>
              <div className="text-xs text-slate-400 mt-2">
                <span className="text-green-400">-5%</span> vs 昨天
              </div>
            </div>
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 30}, {v: 45}, {v: 35}, {v: 50}, {v: 42}]}>
                  <defs>
                    <linearGradient id="cpuMini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFB800" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#FFB800" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#FFB800" strokeWidth={2} fill="url(#cpuMini)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-xl flex items-center text-white">
            <span className="w-2 h-2 bg-[#00D1FF] rounded-full mr-3 shadow-[0_0_8px_#00D1FF]"></span>
            核心数据库实例
          </h3>
          <div className="flex items-center space-x-2 bg-[#161D1F] p-1 rounded-lg border border-[#3C494E]/15">
            <button className="px-3 py-1 text-xs font-bold rounded bg-white/5 text-[#00D1FF]">全部</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:bg-white/5">Oracle</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:bg-white/5">MySQL</button>
            <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:bg-white/5">Postgres</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InstanceCard name="Oracle_Prod_01" ip="192.168.1.100" type="O" cpu={78} ramPct={82} ramText="13.1 GB / 16 GB" tps={4200} qps={9100} status="ONLINE" />
          <InstanceCard name="MySQL_Analytic_DW" ip="10.0.4.52" type="M" cpu={96} ramPct={98} ramText="62.7 GB / 64 GB" tps={6500} qps={12000} status="ONLINE" />
          <InstanceCard name="PG_Test_Legacy" ip="192.168.1.105" type="P" cpu={0} ramPct={0} ramText="0 GB / 8 GB" tps={0} qps={0} status="OFFLINE" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-xl flex items-center text-white">
            <span className="w-2 h-2 bg-[#00D1FF] rounded-full mr-3 shadow-[0_0_8px_#00D1FF]"></span>
            数据库实例列表
          </h3>
        </div>
        <div className="bg-[#161D1F] rounded-xl border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-headline border-b border-[#3C494E]/15">
              <tr>
                <th className="px-6 py-4 font-medium">实例名称</th>
                <th className="px-6 py-4 font-medium">类型</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">CPU</th>
                <th className="px-6 py-4 font-medium text-right">内存</th>
                <th className="px-6 py-4 font-medium text-right">TPS</th>
                <th className="px-6 py-4 font-medium text-right">QPS</th>
                <th className="px-6 py-4 font-medium text-right">运行时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3C494E]/15 text-sm">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Oracle_Prod_01</td>
                <td className="px-6 py-4 text-slate-400">Oracle 19c</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-400/10 text-green-400 border border-green-400/20">ONLINE</span></td>
                <td className="px-6 py-4 text-right text-[#FFB800]">78%</td>
                <td className="px-6 py-4 text-right text-[#FFB800]">82%</td>
                <td className="px-6 py-4 text-right text-[#FFB800]">4,200</td>
                <td className="px-6 py-4 text-right text-[#FFB800]">9,100</td>
                <td className="px-6 py-4 text-right text-slate-400">124d</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">MySQL_Analytic_DW</td>
                <td className="px-6 py-4 text-slate-400">MySQL 8.0</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-400/10 text-green-400 border border-green-400/20">ONLINE</span></td>
                <td className="px-6 py-4 text-right text-[#FF4D4D]">96%</td>
                <td className="px-6 py-4 text-right text-[#FF4D4D]">98%</td>
                <td className="px-6 py-4 text-right text-[#FF4D4D]">6,500</td>
                <td className="px-6 py-4 text-right text-[#FF4D4D]">12,000</td>
                <td className="px-6 py-4 text-right text-slate-400">45d</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">PG_Test_Legacy</td>
                <td className="px-6 py-4 text-slate-400">PostgreSQL 14</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20">OFFLINE</span></td>
                <td className="px-6 py-4 text-right text-slate-500">--</td>
                <td className="px-6 py-4 text-right text-slate-500">--</td>
                <td className="px-6 py-4 text-right text-slate-500">--</td>
                <td className="px-6 py-4 text-right text-slate-500">--</td>
                <td className="px-6 py-4 text-right text-slate-500">--</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Redis_Cache_Cluster</td>
                <td className="px-6 py-4 text-slate-400">Redis 7.0</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-400/10 text-green-400 border border-green-400/20">ONLINE</span></td>
                <td className="px-6 py-4 text-right text-[#00D1FF]">32%</td>
                <td className="px-6 py-4 text-right text-[#00D1FF]">45%</td>
                <td className="px-6 py-4 text-right text-[#00D1FF]">1,200</td>
                <td className="px-6 py-4 text-right text-[#00D1FF]">4,500</td>
                <td className="px-6 py-4 text-right text-slate-400">12d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InstanceCard({ name, ip, type, cpu, ramPct, ramText, tps, qps, status }: any) {
  const isOffline = status === 'OFFLINE';
  
  const getCpuColor = (val: number) => val >= 95 ? '#FF4D4D' : val >= 80 ? '#FFB800' : '#00D1FF';
  const getRamColorClass = (val: number) => val >= 95 ? 'bg-[#FF4D4D]' : val >= 80 ? 'bg-[#FFB800]' : 'bg-[#00D1FF]';
  const getTpsColorClass = (val: number) => val >= 6000 ? 'text-[#FF4D4D]' : val >= 3000 ? 'text-[#FFB800]' : 'text-[#00D1FF]';
  const getQpsColorClass = (val: number) => val >= 11000 ? 'text-[#FF4D4D]' : val >= 8000 ? 'text-[#FFB800]' : 'text-[#00D1FF]';

  const cpuColor = getCpuColor(cpu);

  return (
    <div className={`bg-[#161D1F] rounded-xl border border-[#3C494E]/15 hover:border-[#00D1FF]/30 hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-300 group ${isOffline ? 'opacity-75 grayscale' : ''}`}>
      <div className="p-6 border-b border-[#3C494E]/15 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center border ${type === 'O' ? 'bg-red-500/10 border-red-500/20 text-red-500' : type === 'M' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'}`}>
            <span className="font-headline font-bold text-lg">{type}</span>
          </div>
          <div>
            <h5 className="font-bold text-white">{name}</h5>
            <p className="text-xs text-slate-400">{ip}</p>
          </div>
        </div>
        <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full border ${isOffline ? 'text-[#FF4D4D] bg-[#FF4D4D]/10 border-[#FF4D4D]/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
          {!isOffline && <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>}
          {status}
        </span>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-400">CPU 消耗</span>
            <span className="text-sm font-headline font-bold text-white">{isOffline ? '--' : `${cpu}%`}</span>
          </div>
          <div className="flex items-end h-8 space-x-1 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { value: Math.max(0, cpu - 40) }, { value: Math.max(0, cpu - 20) }, { value: Math.max(0, cpu - 10) }, { value: cpu }, { value: Math.max(0, cpu - 5) }, { value: cpu }
              ]}>
                <RechartsTooltip 
                  cursor={false} 
                  contentStyle={{ backgroundColor: 'rgba(22, 29, 31, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
                  itemStyle={{ color: cpuColor }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="value" fill={isOffline ? '#3c494e' : cpuColor} shape={<CustomBar />} activeBar={<CustomActiveBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-400">内存 (RAM)</span>
            <span className="text-sm font-headline font-bold text-white">{ramText}</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            {!isOffline && <div className={`${getRamColorClass(ramPct)} h-full transition-all duration-500`} style={{ width: `${ramPct}%` }}></div>}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-white/5 flex justify-between items-center text-[11px]">
        <div className="flex space-x-4">
          {isOffline ? (
            <span className="text-slate-400">无法连接至主机</span>
          ) : (
            <>
              <span className="text-slate-400"><span className={`font-bold ${getTpsColorClass(tps)}`}>{tps.toLocaleString()}</span> TPS</span>
              <span className="text-slate-400"><span className={`font-bold ${getQpsColorClass(qps)}`}>{qps.toLocaleString()}</span> QPS</span>
            </>
          )}
        </div>
        {isOffline ? <RefreshCw size={14} className="text-[#FF4D4D] cursor-pointer" /> : <ExternalLink size={14} className="text-slate-400 group-hover:text-[#00D1FF] cursor-pointer" />}
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
  const { timeRange, setTimeRange, isLoading, data: sessionData } = useMockData([
    { time: '14:00', value: 30 }, { time: '14:05', value: 35 }, { time: '14:10', value: 45 }, { time: '14:15', value: 40 },
    { time: '14:20', value: 55 }, { time: '14:25', value: 65 }, { time: '14:30', value: 60 }, { time: '14:35', value: 50 },
    { time: '14:40', value: 55 }, { time: '14:45', value: 70 }, { time: '14:50', value: 80 }, { time: '14:55', value: 75 },
    { time: '15:00', value: 65 }, { time: '15:05', value: 60 }, { time: '15:10', value: 40 }, { time: '15:15', value: 30 }
  ]);

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
              <SessionStat label="前台" value="124" color="text-primary" />
              <SessionStat label="后台" value="18" color="text-on-surface-variant" />
              <SessionStat label="等待" value="12" color="text-error" border="border-error/20" />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="bg-surface-low p-6 rounded-xl border border-outline-variant/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold font-headline tracking-tight text-on-surface">会话负载趋势 (Sessions Load)</h3>
                <p className="text-xs text-on-surface-variant mt-1">数据库活动会话实时监控</p>
              </div>
              <div className="flex gap-2">
                <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end h-full relative">
              {isLoading && <ChartLoadingOverlay />}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
            <h3 className="text-lg font-bold font-headline tracking-tight">当前长时间会话摘要 (Long Running Sessions)</h3>
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
          <h3 className="text-lg font-bold font-headline tracking-tight">表空间详细状态 (Tablespace Status)</h3>
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
        <span className={`text-3xl font-bold font-headline tracking-tighter ${color}`}>{value}</span>
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
  const { timeRange, setTimeRange, isLoading, data: sqlData } = useMockData([
    { time: '14:00', value: 40 }, { time: '14:05', value: 55 }, { time: '14:10', value: 35 }, { time: '14:15', value: 70 },
    { time: '14:20', value: 90 }, { time: '14:25', value: 65 }, { time: '14:30', value: 45 }, { time: '14:35', value: 80 },
    { time: '14:40', value: 60 }, { time: '14:45', value: 75 }
  ]);

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
            <div className="flex justify-between items-start">
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
              <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
            </div>
            <div className="mt-8 h-48 w-full relative">
              {isLoading && <ChartLoadingOverlay />}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sqlData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
  const { timeRange, setTimeRange, isLoading, data: waitData } = useMockData([
    { time: '14:00', 'User I/O': 40, 'System I/O': 24, 'Concurrency': 24, 'Commit': 10, 'Configuration': 5, 'Administrative': 2, 'Network': 15, 'Application': 8, 'Idle': 100 },
    { time: '14:05', 'User I/O': 30, 'System I/O': 13, 'Concurrency': 22, 'Commit': 15, 'Configuration': 4, 'Administrative': 1, 'Network': 12, 'Application': 6, 'Idle': 110 },
    { time: '14:10', 'User I/O': 45, 'System I/O': 28, 'Concurrency': 30, 'Commit': 12, 'Configuration': 6, 'Administrative': 3, 'Network': 18, 'Application': 10, 'Idle': 90 },
    { time: '14:15', 'User I/O': 50, 'System I/O': 35, 'Concurrency': 40, 'Commit': 20, 'Configuration': 8, 'Administrative': 4, 'Network': 25, 'Application': 15, 'Idle': 70 },
    { time: '14:20', 'User I/O': 35, 'System I/O': 20, 'Concurrency': 25, 'Commit': 18, 'Configuration': 5, 'Administrative': 2, 'Network': 14, 'Application': 9, 'Idle': 105 },
    { time: '14:25', 'User I/O': 25, 'System I/O': 15, 'Concurrency': 18, 'Commit': 8, 'Configuration': 3, 'Administrative': 1, 'Network': 10, 'Application': 5, 'Idle': 120 },
    { time: '14:30', 'User I/O': 38, 'System I/O': 22, 'Concurrency': 26, 'Commit': 14, 'Configuration': 6, 'Administrative': 2, 'Network': 16, 'Application': 7, 'Idle': 95 },
  ]);

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
        <GaugeCard title="Buffer Cache Hit" value={98.2} />
        <GaugeCard title="Cursor Cache Hit" value={92.4} />
        <GaugeCard title="Library Cache Hit" value={99.9} />
        <GaugeCard title="Row Cache Hit" value={84.1} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 bg-[#161D1F] p-8 rounded-xl border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-1">数据库等待时间</h2>
              <p className="text-sm text-on-surface-variant">Database Wait Times by Class (ms)</p>
            </div>
            <div className="flex gap-2">
              <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
            <div className="absolute inset-0 pointer-events-none opacity-5 z-10" style={{ backgroundSize: '4px 4px', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)' }}></div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdministrative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorApplication" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#eab308" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorCommit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorConcurrency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorConfiguration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorUserIO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSystemIO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#3c494e" vertical={false} horizontal={true} opacity={0.2} />
                <XAxis dataKey="time" stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#bbc9cf" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} ms`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(36, 43, 46, 0.7)', backdropFilter: 'blur(20px)', borderColor: 'rgba(60, 73, 78, 0.15)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#dde3e7' }}
                />
                <Legend 
                  content={(props: any) => {
                    const { payload } = props;
                    const colorMap: Record<string, string> = {
                      'Administrative': '#22c55e',
                      'Application': '#eab308',
                      'Commit': '#3b82f6',
                      'Concurrency': '#f97316',
                      'Configuration': '#ef4444',
                      'Network': '#a855f7',
                      'Other': '#ec4899',
                      'User I/O': '#00d1ff',
                      'System I/O': '#14b8a6'
                    };
                    return (
                      <div className="mt-4 flex flex-wrap gap-4 justify-center">
                        {payload.map((entry: any, index: number) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[entry.value] || entry.color }}></div>
                            <span className="text-[10px] font-headline text-on-surface-variant uppercase tracking-tighter">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                  verticalAlign="bottom" 
                />
                <Area type="linear" dataKey="Other" stackId="1" stroke="none" fill="url(#colorOther)" />
                <Area type="linear" dataKey="Configuration" stackId="1" stroke="none" fill="url(#colorConfiguration)" />
                <Area type="linear" dataKey="Network" stackId="1" stroke="none" fill="url(#colorNetwork)" />
                <Area type="linear" dataKey="Administrative" stackId="1" stroke="none" fill="url(#colorAdministrative)" />
                <Area type="linear" dataKey="Application" stackId="1" stroke="none" fill="url(#colorApplication)" />
                <Area type="linear" dataKey="Commit" stackId="1" stroke="none" fill="url(#colorCommit)" />
                <Area type="linear" dataKey="Concurrency" stackId="1" stroke="none" fill="url(#colorConcurrency)" />
                <Area type="linear" dataKey="System I/O" stackId="1" stroke="none" fill="url(#colorSystemIO)" />
                <Area type="linear" dataKey="User I/O" stackId="1" stroke="#00d1ff" strokeWidth={2} fill="url(#colorUserIO)" style={{ filter: 'drop-shadow(0 0 8px rgba(0,209,255,0.5))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <MetricTrendCard title="User Commits" value="12.8k" trend="+14.2% vs prev hour" isPositive={true} color="text-primary" trendColor="text-primary/80" icon={<LineChartIcon size={18} />} data={[0.3, 0.5, 0.4, 0.6, 0.5, 0.8, 0.7]} />
          <MetricTrendCard title="Execute Count" value="4.1M" trend="-2.1% spike detected" isPositive={false} color="text-secondary" trendColor="text-error" icon={<Zap size={18} />} data={[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.8]} />
          <MetricTrendCard title="Lock Waits (锁等待)" value="248" trend="+5.4% active locks" isPositive={true} color="text-tertiary" trendColor="text-tertiary/80" icon={<Shield size={18} />} data={[0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 bg-[#161D1F] rounded-xl overflow-hidden border border-[#3C494E]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-[#3C494E]/15">
            <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-widest border-l-2 border-primary pl-3">等待事件统计详情 (Wait Events Detail)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-headline border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Wait Class</th>
                  <th className="px-6 py-4 text-right">Total Waits</th>
                  <th className="px-6 py-4 text-right">Time Waited (s)</th>
                  <th className="px-6 py-4 text-right">Avg Wait (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                <WaitEventRow name="db file sequential read" class="User I/O" waits="1,245,820" time="4,285.4" avg="3.44" />
                <WaitEventRow name="log file sync" class="Commit" waits="142,503" time="948.2" avg="6.65" />
                <WaitEventRow name="direct path read" class="User I/O" waits="856,122" time="1,210.1" avg="1.41" />
                <WaitEventRow name="resmgr:cpu quantum" class="Administrative" waits="12,401" time="325.6" avg="26.25" isWarning />
                <WaitEventRow name="enq: TX - row lock contention" class="Application" waits="452" time="154.2" avg="341.15" isWarning />
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-[#00D1FF] p-6 rounded-xl text-[#0E1417] flex flex-col justify-between relative overflow-hidden group shadow-[0_0_40px_rgba(0,209,255,0.05)]">
          <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/30 blur-[60px] rounded-full transition-all duration-500 group-hover:scale-150"></div>
          <div className="relative z-10">
            <Search className="w-8 h-8 mb-4 text-[#0E1417]" />
            <h3 className="text-lg font-black font-headline leading-tight">识别性能瓶颈</h3>
            <p className="text-xs opacity-80 mt-2 font-body font-medium">运行过去 60 分钟的全面 AWR 报告，以分析主要的等待事件。</p>
          </div>
          <button className="relative z-10 mt-6 w-full py-3 bg-[#0E1417] text-[#00D1FF] font-black font-headline uppercase tracking-widest text-xs rounded-sm hover:bg-black transition-colors">生成 AWR 报告</button>
        </div>
      </section>
    </div>
  );
}

function WaitEventRow({ name, class: waitClass, waits, time, avg, isWarning }: any) {
  const getClassStyle = (c: string) => {
    switch(c) {
      case 'User I/O': return 'bg-cyan-900/30 text-cyan-400';
      case 'Commit': return 'bg-blue-900/30 text-blue-400';
      case 'Administrative': return 'bg-green-900/30 text-green-400';
      case 'Application': return 'bg-yellow-900/30 text-yellow-400';
      case 'Network': return 'bg-purple-900/30 text-purple-400';
      case 'Concurrency': return 'bg-orange-900/30 text-orange-400';
      default: return 'bg-surface-high text-on-surface-variant';
    }
  };

  return (
    <tr className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
      <td className="px-6 py-4 font-medium text-on-surface">{name}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-headline tracking-wider ${getClassStyle(waitClass)}`}>
          {waitClass}
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-right text-on-surface-variant">{waits}</td>
      <td className="px-6 py-4 font-mono text-right text-on-surface-variant">{time}</td>
      <td className={`px-6 py-4 text-right font-mono font-bold ${isWarning ? 'text-error' : 'text-primary'}`}>{avg}</td>
    </tr>
  );
}

function GaugeCard({ title, value }: any) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let colorHex = '#FF4D4D'; // Red
  if (value >= 95) colorHex = '#00D1FF'; // Cyan
  else if (value >= 90) colorHex = '#FFB800'; // Yellow

  return (
    <div className="bg-[#161D1F] p-6 rounded-md border border-[#3C494E]/15 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(0,209,255,0.05)]">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: `${colorHex}33` }}></div>
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-surface-variant" />
          <circle 
            cx="48" cy="48" r={radius} fill="transparent" stroke={colorHex} strokeWidth="6" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${colorHex})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black font-headline text-on-surface">{value}<span className="text-[10px] font-normal">%</span></span>
        </div>
      </div>
      <p className="text-xs font-headline font-bold text-on-surface-variant tracking-wider uppercase">{title}</p>
    </div>
  );
}

function MetricTrendCard({ title, value, trend, isPositive, color, trendColor, icon, data }: any) {
  const chartData = (data || [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.6]).map((v: number) => ({ value: v * 100 }));
  const fillColor = color.includes('primary') ? '#00d1ff' : color.includes('tertiary') ? '#ffd59c' : color.includes('secondary') ? '#9ccee2' : color.includes('error') ? '#ffb4ab' : '#00d1ff';

  return (
    <div className="bg-[#161D1F] p-6 rounded-xl border border-[#3C494E]/15 flex flex-col justify-between h-full group hover:border-primary/30 shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-300">
      <div className="flex justify-between items-start">
        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</h4>
        <div className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      </div>
      <div className="mt-4">
        <div className={`text-4xl font-headline font-bold ${color} leading-none mb-2 tracking-tighter`} style={{ textShadow: `0 0 20px ${fillColor}66` }}>{value}</div>
        <div className={`flex items-center gap-2 text-[10px] font-medium ${trendColor || (isPositive ? 'text-primary/80' : 'text-error/80')}`}>
          <ArrowUp size={12} className={isPositive ? '' : 'rotate-180'} />
          <span>{trend}</span>
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
            <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
          </div>
          <div className="flex-1 min-h-[250px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
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
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline font-bold text-lg">告警级别分布 (Distribution)</h4>
            <TimeSelector selected={timeRange} onSelect={setTimeRange} isLoading={isLoading} />
          </div>
          <div className="flex-1 min-h-[250px] w-full relative">
            {isLoading && <ChartLoadingOverlay />}
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
      <td className="px-8 py-5 text-sm text-on-surface-variant font-mono">{time}</td>
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
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-sans">SELECTED INSTANCE</label>
      <div className="relative min-w-[240px]">
        <select className="appearance-none w-full bg-surface-high border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded-md font-sans font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer">
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
